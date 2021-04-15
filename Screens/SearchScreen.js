import React, {Component} from 'react';
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {placeholder: 'Search Movies and TV Shows', results: []};
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

  render() {
    return (
      <View style={{minHeight: '100%', backgroundColor: '#fff'}}>
        <TextInput
          onChangeText={txt => this.getList(txt)}
          onFocus={() => {
            this.setState({placeholder: ''});
          }}
          onBlur={() => {
            this.setState({placeholder: 'Search Movies and TV Shows'});
          }}
          placeholderTextColor="#666"
          placeholder={this.state.placeholder}
          style={[styles.textInputStyle]}></TextInput>
        <View style={{marginTop: 20, paddingBottom: 20}}>
          <FlatList
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('MovieDetails', {
                    item: item,
                  })
                }>
                <View
                  style={{
                    backgroundColor: '#fff',
                    display: 'flex',
                    flexDirection: 'row',
                    marginLeft: 10,
                    marginTop: 5,
                    borderBottomColor: '#00000040',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    padding: 10,
                  }}>
                  <Image
                    style={{width: 263 / (1.5 * 3), height: 388 / (1.5 * 3)}}
                    source={{
                      uri:
                        'https://image.tmdb.org/t/p/w500/' + item.poster_path,
                    }}
                  />
                  <Text
                    style={{width: '75%', marginLeft: 5, fontWeight: 'bold'}}>
                    {item.title || item.name}
                  </Text>
                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: 10,
                      marginLeft: item.media_type === 'tv' ? 0 : -20,
                      marginTop: 70,
                      textAlign: 'right',
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
