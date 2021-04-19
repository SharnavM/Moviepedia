import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';

export default class Header extends Component {
  render() {
    var d = this.props.dark;
    return (
      <View
        style={{
          minWidth: '100%',
          height: 50,
          backgroundColor: d ? '#18191a' : '#fff',
          marginLeft: this.props.marginLeft ? this.props.marginLeft : 0,
          display: 'flex',
          flexDirection: 'row',
        }}>
        {this.props.backBtn && (
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Image
              style={{
                width: 32,
                height: 32,
                marginTop: 10,
                tintColor: d ? '#f5f6f7' : '#303a52',
              }}
              source={require('../assets/back.png')}></Image>
          </TouchableOpacity>
        )}
        <Text
          style={{
            fontWeight: 'bold',
            color: d ? '#f4f5f6' : '#303a52',
            fontSize: 22,
            marginLeft: 5,
          }}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}
