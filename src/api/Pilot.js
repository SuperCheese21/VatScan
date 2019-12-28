import moment from 'moment';

import Client from './Client';
import { getGCDistance } from './util';

import constants from '../config/constants.json';
import airportCoords from '../data/airportCoords.json';
import airportNames from '../data/airportNames.json';
import GA_ICON from '../../assets/icons/ga.png';
import NARROWBODY_ICON from '../../assets/icons/narrowbody.png';
import WIDEBODY_ICON from '../../assets/icons/widebody.png';

export default class Pilot extends Client {
  constructor(data) {
    super(data);
    this.altitude = data[7];
    this.groundSpeed = parseInt(data[8], 10);
    this.aircraft = data[9];
    this.tasCruise = data[10];
    this.depAirport = data[11];
    this.plannedAltitude = data[12];
    this.arrAirport = data[13];
    this.transponder = data[17];
    this.flightType = data[21];
    this.depTime = data[22];
    this.hrsEnRoute = parseInt(data[24], 10);
    this.minEnRoute = parseInt(data[25], 10);
    this.remarks = data[29];
    this.route = data[30];
    this.heading = parseFloat(data[38]);
  }

  getAircraftType() {
    const widebody = constants.aircraft.WIDEBODY;
    const narrowbody = constants.aircraft.NARROWBODY;

    if (this.checkAircraftType(widebody)) {
      return 2;
    }

    if (this.checkAircraftType(narrowbody) || !this.aircraft) {
      return 1;
    }

    return 0;
  }

  checkAircraftType(list) {
    if (list.find(aircraft => this.aircraft.includes(aircraft))) {
      return true;
    }

    return false;
  }

  getETEMinutes() {
    if (this.distRemaining && this.groundSpeed > 0) {
      if (this.distRemaining <= 2 && this.groundSpeed < 40) {
        return 0;
      }
      return Math.round(
        60 * (this.distRemaining / this.groundSpeed) + this.altitude / 3400,
      );
    }
    return -1;
  }

  get aircraftIcon() {
    const type = this.getAircraftType();

    if (type === 2) {
      return WIDEBODY_ICON;
    }

    if (type === 1) {
      return NARROWBODY_ICON;
    }

    return GA_ICON;
  }

  get depCoords() {
    return airportCoords[this.depAirport];
  }

  get arrCoords() {
    return airportCoords[this.arrAirport];
  }

  get distFlown() {
    return getGCDistance(this.depCoords, this.location);
  }

  get distRemaining() {
    return getGCDistance(this.location, this.arrCoords);
  }

  get progress() {
    return this.distFlown / (this.distFlown + this.distRemaining);
  }

  get depCityName() {
    const names = airportNames[this.depAirport];
    if (names) {
      const region = names.region.split('-');
      if (region[0] === 'US') {
        return `${names.city}, ${region[1]}`;
      }
      return `${names.city}, ${names.country}`;
    }
    return 'Unknown';
  }

  get arrCityName() {
    const names = airportNames[this.arrAirport];
    if (names) {
      const region = names.region.split('-');
      if (region[0] === 'US') {
        return `${names.city}, ${region[1]}`;
      }
      return `${names.city}, ${names.country}`;
    }
    return 'Unknown';
  }

  get plannedDepTime() {
    return `${this.depTime.padStart(4, '0')} z`;
  }

  get plannedDuration() {
    if (this.hrsEnRoute || this.minEnRoute) {
      return `${this.hrsEnRoute} hrs ${this.minEnRoute} min`;
    }
    return 'N/A';
  }

  get plannedArrTime() {
    if (this.hrsEnRoute || this.minEnRoute) {
      const departureTime = moment.utc(this.depTime.padStart(4, '0'), 'HHmm');
      const flightDuration = 60 * this.hrsEnRoute + this.minEnRoute;
      return `${departureTime.add(flightDuration, 'm').format('HHmm')} z`;
    }
    return 'N/A';
  }

  get ete() {
    const eteMinutes = this.getETEMinutes();
    if (eteMinutes) {
      return moment.utc(eteMinutes * 60000).format('H:mm');
    }
    return null;
  }

  get eta() {
    const eteMinutes = this.getETEMinutes();
    if (eteMinutes) {
      return moment
        .utc()
        .add(eteMinutes, 'm')
        .format('HHmm');
    }
    return null;
  }
}
