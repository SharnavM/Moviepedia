import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';

export default class Header extends Component {
  render() {
    return (
      <View
        style={{
          minWidth: '100%',
          height: 50,
          backgroundColor: '#fff',
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
                tintColor: '#303a52',
              }}
              source={require('../assets/back.png')}></Image>
          </TouchableOpacity>
        )}
        <Text
          style={{
            fontWeight: 'bold',
            color: '#303a52',
            fontSize: 22,
            marginLeft: 5,
          }}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}
