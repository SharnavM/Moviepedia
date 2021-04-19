import React, {Component} from 'react';
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  AsyncStorage,
} from 'react-native';

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);

    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;

    this.state = {
      placeholder: 'Search Movies and TV Shows',
      results: [],
      dark: null,
      fontScaling: null,
    };
  }

  getList = async str => {
    if (str.length < 3) {
      this.setState({results: []});
    } else {
      var res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=<api_key>&language=en-US&query=${str}&page=1&include_adult=false`,
      );

      res = await res.json();
      res = res.results.filter(elem => {
        return elem.media_type !== 'person';
      });
      this.setState({results: res});
    }
  };

  async componentDidMount() {
    let t = await AsyncStorage.getItem('dark');

    this.setState({dark: t === 'true'});

    let fs = await AsyncStorage.getItem('fontScale');

    this.setState({fontScaling: parseFloat(fs)});
  }

  render() {
    var d = this.state.dark;
    var fs = this.state.fontScaling;

    return (
      <View
        style={{minHeight: '100%', backgroundColor: d ? '#242526' : '#fff'}}>
        <TextInput
          onChangeText={txt => this.getList(txt)}
          onFocus={() => {
            this.setState({placeholder: ''});
          }}
          onBlur={() => {
            this.setState({placeholder: 'Search Movies and TV Shows'});
          }}
          placeholderTextColor={d ? '#7f8492' : '#666'}
          placeholder={this.state.placeholder}
          style={[
            styles.textInputStyle,
            {
              color: d ? '#7f8492' : '#666',
              backgroundColor: d ? '#18191a' : '#ddd',
              fontSize: 12 * fs,
            },
          ]}></TextInput>
        <View style={{marginTop: 20, paddingBottom: 20}}>
          <FlatList
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('MovieDetails', {
                    itemID: item.id,
                    type: item.media_type === 'movie' ? null : 'tv',
                  })
                }>
                <View
                  style={{
                    backgroundColor: d ? 'transparent' : '#fff',
                    display: 'flex',
                    flexDirection: 'row',
                    marginLeft: 10,
                    marginTop: 5,
                    borderBottomColor: d ? '#ffffff80' : '#00000040',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    padding: 10,
                  }}>
                  {item.poster_path ? (
                    <Image
                      style={{width: 263 / (1.5 * 3), height: 388 / (1.5 * 3)}}
                      source={{
                        uri:
                          'https://image.tmdb.org/t/p/w500/' + item.poster_path,
                      }}
                    />
                  ) : (
                    <Image
                      style={{width: 263 / (1.5 * 3), height: 388 / (1.5 * 3)}}
                      source={require('../assets/noMoviePoster.jpg')}
                    />
                  )}

                  <Text
                    style={{
                      width: '75%',
                      marginLeft: 5,
                      fontWeight: 'bold',
                      color: d ? '#f5f6f7' : 'black',
                    }}>
                    {item.title || item.name}
                  </Text>
                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: 10 * fs,
                      marginLeft: item.media_type === 'tv' ? 0 : -20,
                      marginTop: 70,
                      textAlign: 'right',
                      color: d ? '#f5f6f7' : 'black',
                    }}>
                    {item.media_type === 'tv' ? 'TV' : 'Movie'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            data={this.state.results}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInputStyle: {
    width: '95%',
    height: 50,
    backgroundColor: '#ddd',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 50,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
