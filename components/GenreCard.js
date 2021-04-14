import React, {Component} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

export default class GenreCard extends Component {
  constructor(props) {
    super(props);

    this.state = {img: null};
  }

  componentDidMount() {}

  render() {
    return (
      <View style={[styles.ViewStyle]}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}>
          <Image
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
              borderRadius: 10,
            }}
            source={{uri: this.props.imgURL}}
          />
          <View
            style={{
              backgroundColor: 'black',
              opacity: 0.7,
              width: '100%',
              height: 263 / 1.5 - 30,
              borderRadius: 15,
              position: 'absolute',
              top: 15,
              left: 0,
            }}
          />
          <Text style={styles.GenreStyle}>{this.props.genre}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ViewStyle: {
    width: 388 / 1.5,
    height: 263 / 1.5,
    borderRadius: 10,
    backgroundColor: 'transparent',
    marginLeft: 5,
    marginRight: 5,
  },

  GenreStyle: {
    fontSize: 15,
    zIndex: 10,
    color: 'white',
    position: 'absolute',
    fontWeight: 'bold',
  },
});
