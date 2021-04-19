import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Switch,
  AsyncStorage,
  ToastAndroid,
  Slider,
} from 'react-native';

export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);

    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;

    this.state = {dark: null, switch: null, sliderVal: null, staticFS: null};
  }

  async componentDidMount() {
    let t = await AsyncStorage.getItem('dark');
    let fs = await AsyncStorage.getItem('fontScale');
    this.setState({
      dark: t === 'true',
      switch: t === 'true',
      sliderVal: parseFloat(fs),
      staticFS: parseFloat(fs),
    });
  }

  onSliderChange = async val => {
    ToastAndroid.show(
      'Restart the App for Changes to take Effect',
      ToastAndroid.SHORT,
    );

    await AsyncStorage.setItem('fontScale', val + '');
    console.log(val);
    this.setState({sliderVal: val});
  };

  onValueChange = async val => {
    ToastAndroid.show(
      'Restart the App for Changes to take Effect',
      ToastAndroid.SHORT,
    );
    AsyncStorage.setItem('dark', val + '');

    this.setState({switch: !this.state.switch});
  };

  render() {
    var fs = this.state.staticFS;
    if (this.state.dark !== null && this.state.sliderVal) {
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
            <Text style={{color: d ? '#F5F6F7' : 'black', fontSize: 14 * fs}}>
              Moviepedia
            </Text>
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
            <Text
              style={{
                marginLeft: 10,
                color: d ? '#F5F6F7' : 'black',
                fontSize: 14 * fs,
              }}>
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
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              marginTop: 30,
            }}>
            <Text
              style={{
                marginLeft: 10,
                color: d ? '#F5F6F7' : 'black',
                fontSize: 14 * fs,
              }}>
              Font Scaling
            </Text>
            <Slider
              value={this.state.sliderVal}
              onSlidingComplete={this.onSliderChange}
              style={{
                position: 'absolute',
                top: 7,
                right: 10,
                width: 100,
              }}
              minimumValue={1}
              maximumValue={1.5}
            />
          </View>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              marginTop: 5,
            }}>
            <Text
              style={{
                marginLeft: 10,
                color: d ? '#bbbbbb' : 'black',
                fontSize: 8 * fs,
              }}>
              (Proceed with caution. Certain parts of app may misalign)
            </Text>
          </View>
        </View>
      );
    } else {
      return <View></View>;
    }
  }
}
