import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, AsyncStorage} from 'react-native';

export default class MovieCard extends Component {
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;

    this.state = {img: null, fontScaling: null};
  }

  async componentDidMount() {
    let fs = await AsyncStorage.getItem('fontScale');

    this.setState({fontScaling: parseFloat(fs)});
  }

  render() {
    var d = this.props.dark;
    var fs = this.state.fontScaling;
    return (
      <View
        style={[
          styles.ViewStyle,
          {
            transform: [{scale: this.props.scale ? this.props.scale : 1}],
            borderWidth: this.props.border ? StyleSheet.hairlineWidth : 0,
            backgroundColor: d ? '#18191A' : 'transparent',
            borderColor: d ? '#f5f6f8' : 'black',
          },
        ]}>
        {this.props.imgURL ? (
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
        ) : (
          <Image
            style={{
              width: '100%',
              height: '75%',
              resizeMode: 'cover',
              borderRadius: 10,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0,
            }}
            source={require('../assets/noMoviePoster.jpg')}
          />
        )}
        <Text
          style={[
            styles.titleStyle,
            {color: d ? '#f5f6f7' : 'black', fontSize: 10 * fs},
          ]}>
          {this.props.title.length > 28
            ? `${this.props.title.substr(0, 30)}...`
            : this.props.title}
        </Text>
        <Text
          style={[
            styles.GenreStyle,
            {color: d ? '#f5f6f7' : 'black', fontSize: 8 * fs},
          ]}>
          {this.props.genre}
        </Text>
        {this.props.rating ? (
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

            <Text
              style={{
                fontSize: 9 * fs,
                marginLeft: 2,
                color: d ? '#f5f6f7' : 'black',
              }}>
              {this.props.rating}
            </Text>
          </View>
        ) : null}
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
    marginLeft: 3,
  },
  GenreStyle: {
    width: '97%',
    marginLeft: 0,
    position: 'absolute',
    right: -0,
    bottom: 8,
  },
});
