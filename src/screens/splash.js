import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

//Routes
import { HomeNavigator } from '../routes/app';

//Custom
import Network from '../components/network';

let eventConnected;

class Splash extends Component {
  state = {
    isConnected: true,
  };

  componentDidMount = () => {
    eventConnected = NetInfo.addEventListener((state) => {
      this.setState({ isConnected: state.isConnected });
    });
  };

  componentWillUnmount = () => {
    eventConnected();
  };

  render() {
    let { isConnected } = this.state;
    return (
      <>
        <HomeNavigator />
        <Network isConnected={isConnected} />
      </>
    );
  }
}
export default Splash;
