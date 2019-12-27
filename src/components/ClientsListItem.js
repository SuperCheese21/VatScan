import React from 'react';
import { StyleSheet } from 'react-native';
import { List, Surface, TouchableRipple } from 'react-native-paper';

const styles = StyleSheet.create({
  listItem: {
    elevation: 5,
    margin: 5,
    borderRadius: 5,
  },
});

export default class ClientsListItem extends React.PureComponent {
  leftIcon = itemProps => {
    const { client } = this.props;
    return (
      <List.Icon
        color={itemProps.color}
        style={itemProps.style}
        icon={client.type === 'ATC' ? 'rss-feed' : 'airplanemode-active'}
      />
    );
  };

  onPress = () => {
    const { stackNavigation, client } = this.props;
    stackNavigation.navigate('ClientScreen', {
      callsign: client.callsign,
      removeFocusedClient: true,
    });
  };

  render() {
    const { client } = this.props;
    return (
      <Surface style={styles.listItem}>
        <TouchableRipple onPress={this.onPress}>
          <List.Item
            title={client.callsign}
            description={`${client.name} (${client.id})`}
            left={this.leftIcon}
          />
        </TouchableRipple>
      </Surface>
    );
  }
}
