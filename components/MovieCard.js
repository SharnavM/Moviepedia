import React, {Component} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

export default class MovieCard extends Component {
  constructor(props) {
    super(props);

    this.state = {img: null};
  }

  componentDidMount() {}

  render() {
    return (
      <View
        style={[
          styles.ViewStyle,
          {transform: [{scale: this.props.scale ? this.props.scale : 1}]},
        ]}>
        <Image
          style={{
            width: '100%',
            height: '75%',
            resizeMode: 'cover',
            borderRadius: 10,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
          }}
          source={{uri: this.props.imgURL}}
        />
        <Text style={styles.titleStyle}>
          {this.props.title.length > 28
            ? this.props.title.substr(0, 30) + '...'
            : this.props.title}
        </Text>
        <Text style={styles.GenreStyle}>{this.props.genre}</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            position: 'absolute',
            right: 7,
            bottom: 10,
          }}>
          <Image
            style={{
              width: 8 * 2,
              height: 8 * 2,
              resizeMode: 'contain',
            }}
            source={require('../assets/star.png')}
          />

          <Text style={{fontSize: 8, marginLeft: 2}}>{this.props.rating}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ViewStyle: {
    width: 263 / 1.5,
    height: 388 / 1.5,
    borderRadius: 10,
    backgroundColor: 'transparent',
    marginTop: 10,
    marginLeft: 10,
  },

  titleStyle: {
    fontWeight: 'bold',
    width: '95%',
    fontSize: 10,
    marginLeft: 3,
  },
  GenreStyle: {
    width: '100%',
    fontSize: 8,
    marginLeft: 3,
    position: 'absolute',
    right: -4,
    bottom: 8,
  },
});
