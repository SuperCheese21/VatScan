import React from 'react';
import { BackHandler, RefreshControl, ScrollView, Text, View } from 'react-native';

import ControllerStatsContainer from '../containers/ControllerStatsContainer';
import ClientStatsContainer from '../containers/ClientStatsContainer';
import FlightPlanContainer from '../containers/FlightPlanContainer';
import FlightStatsContainer from '../containers/FlightStatsContainer';
import styles from '../styles';

export default class ClientScreen extends React.PureComponent {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        const callsign = this.props.navigation.getParam('callsign');
        if (callsign) {
            for (const client in this.props.screenProps.clients) {
                if (client.callsign === callsign) {
                    this.props.screenProps.setFocusedClient(client);
                    break;
                }
            }
        }
    }

    componentWillUnmount() {
        if (this.props.navigation.getParam('removeFocusedClient')) {
            this.props.screenProps.removeFocusedClient();
        }
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.props.navigation.goBack();
        return true;
    }

    getStatsComponent(client) {
        if (client.type === 'PILOT') {
            return (
                <>
                    <FlightPlanContainer client={client} />
                    <FlightStatsContainer client={client} />
                </>
            );
        } else if (client.type === 'ATC') {
            return <ControllerStatsContainer client={client} />
        }
    }

    render() {
        const { focusedClient: client } = this.props.screenProps;
        return (
            <>
                <View style={styles.header}>
                    <Text style={[styles.text, styles.headerText, {
                        textAlign: 'center'
                    }]}>
                        {client.callsign}
                    </Text>
                </View>

                <ScrollView
                    style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.screenProps.loading}
                            onRefresh={this.props.screenProps.refresh}
                        />
                    }
                >

                    <ClientStatsContainer client={client} />

                    {this.getStatsComponent(client)}

                </ScrollView>
            </>
        );
    }
}
