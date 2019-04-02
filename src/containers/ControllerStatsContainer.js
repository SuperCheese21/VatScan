import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import { MapView } from 'expo';

import StatsLabel from '../components/StatsLabel';
import StatsRow from '../components/StatsRow';
import TextBlock from '../components/TextBlock';
import mapStyle from '../config/map-styles/style_blue_essence.json';

const ControllerStatsContainer = ({ client }) => (
    <Surface style={styles.statsContainer}>
        <StatsLabel text="Controller Info" />

        <StatsRow label="Type" text={client.typeString} />
        <StatsRow label="Frequency" text={client.frequency} />

        <TextBlock text={client.atisMessage} />

        <MapView
            style={{ width: '100%', height: 300, marginTop: 5 }}
            provider={'google'}
            initialRegion={{
                latitude: client.latitude,
                longitude: client.longitude,
                latitudeDelta: 5,
                longitudeDelta: 5
            }}
            customMapStyle={mapStyle}
            moveOnMarkerPress={false}
            toolbarEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            showsIndoors={false}
        >
            <MapView.Polygon
                coordinates={client.polygon}
                strokeWidth={1}
                strokeColor={client.strokeColor}
                fillColor={client.fillColor}
            />
        </MapView>
    </Surface>
);

const styles = StyleSheet.create({
    statsContainer: {
        borderRadius: 10,
        padding: 10,
        elevation: 10,
        margin: 5
    }
});

export default ControllerStatsContainer;
