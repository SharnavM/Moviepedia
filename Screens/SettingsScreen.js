import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Switch,
  AsyncStorage,
  ToastAndroid,
} from 'react-native';

export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {dark: null, switch: null};
  }

  async componentDidMount() {
    let t = await AsyncStorage.getItem('dark');

    this.setState({dark: t === 'true', switch: t === 'true'});
  }

  onValueChange = async val => {
    ToastAndroid.show(
      'Restart the App for Changes to take Effect',
      ToastAndroid.SHORT,
    );
    AsyncStorage.setItem('dark', val + '');

    this.setState({switch: !this.state.switch});
  };

  render() {
    if (this.state.dark !== null) {
      var d = this.state.dark;
      return (
        <View
          style={{minHeight: '100%', backgroundColor: d ? '#242526' : '#fff'}}>
          <View
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{width: 64, height: 64, marginTop: 40}}
              source={require('../assets/logo_hollow.png')}
            />
            <Text style={{color: d ? '#F5F6F7' : 'black'}}>Moviepedia</Text>
          </View>
          <View
            style={{
              marginTop: 20,
              borderBottomColor: d ? '#ffffff80' : '#00000040',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              marginTop: 15,
            }}>
            <Text style={{marginLeft: 10, color: d ? '#F5F6F7' : 'black'}}>
              Dark Mode
            </Text>
            <Switch
              style={{position: 'absolute', top: 7, right: 10}}
              onValueChange={this.onValueChange}
              value={this.state.switch}
              trackColor={{false: '#777', true: '#B2DFDB'}}
              thumbColor={this.state.switch ? '#009385' : '#B9B9B9'}
            />
          </View>
        </View>
      );
    } else {
      return <View></View>;
    }
  }
}
