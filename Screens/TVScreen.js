import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import GenreCard from '../components/GenreCard';
import MovieCard from '../components/MovieCard';

export default class TVScreen extends Component {
  constructor(props) {
    super(props);

    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;

    this.state = {
      genre: [],
      bgImages: [],
      topRated: [],
      nowPlaying: [],
      fontScaling: null,
    };
  }

  getGenre = async () => {
    var res = await fetch(
      'https://api.themoviedb.org/3/genre/tv/list?api_key=<api_key>&language=en-US&page=1&language=en-US',
    );

    res = await res.json();

    this.setState({genre: res.genres}, () => {
      this.state.genre.forEach(elem => {
        this.getBG(elem.id);
      });
    });
  };

  findGenres = id => {
    var s = this.state.genre.filter(elem => {
      return elem.id == id;
    });
    s = s[0];
    if (s) {
      return s.name;
    }
  };

  getNowPlaying = async () => {
    var res = await fetch(
      `https://api.themoviedb.org/3/tv/on_the_air?api_key=<api_key>&language=en-US&page=1`,
    );

    res = await res.json();

    res = res.results;

    this.setState({nowPlaying: res});
  };

  getBG = async id => {
    var res = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=<api_key>&with_genres=${id}&page=1`,
    );

    res = await res.json();

    res = res.results;

    var rand = res[Math.floor(Math.random() * res.length)];
    if (rand.backdrop_path !== null) {
      var url = 'https://image.tmdb.org/t/p/w500' + rand.backdrop_path;
      this.setState({bgImages: [...this.state.bgImages, url]});
    } else {
      this.getBG(id);
    }
  };

  getTopRated = async () => {
    var res = await fetch(
      `https://api.themoviedb.org/3/tv/top_rated?api_key=<api_key>&language=en-US&page=1`,
    );

    res = await res.json();

    res = res.results;

    this.setState({topRated: res});
  };

  async componentDidMount() {
    this.getGenre();
    this.getTopRated();
    this.getNowPlaying();

    let t = await AsyncStorage.getItem('dark');

    this.setState({dark: t === 'true'});

    let fs = await AsyncStorage.getItem('fontScale');

    this.setState({fontScaling: parseFloat(fs)});
  }

  render() {
    var d = this.state.dark;
    var fs = this.state.fontScaling;

    return (
      <View>
        <ScrollView style={{backgroundColor: d ? '#242526' : '#fff'}}>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text
              style={[
                styles.mainTitle,
                {
                  marginTop: 15,
                  color: d ? '#f5f6f7' : 'black',
                  fontSize: 15 * fs,
                },
              ]}>
              Browse by Genre
            </Text>
          </View>
          <ScrollView horizontal={true}>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              {this.state.genre.map((item, ind) =>
                ind <= 9 ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('MovieList', {
                        url: `https://api.themoviedb.org/3/discover/tv?api_key=<api_key>&with_genres=${item.id}`,
                        genre: this.state.genre,
                        headerTitle: `${item.name} Shows`,
                        type: 'tv',
                      })
                    }>
                    <GenreCard
                      dark={d ? true : false}
                      imgURL={this.state.bgImages[ind]}
                      key={ind}
                      genre={item.name}
                    />
                  </TouchableOpacity>
                ) : null,
              )}
            </View>
          </ScrollView>
          <ScrollView horizontal={true}>
            <View
              style={{display: 'flex', flexDirection: 'row', marginTop: -10}}>
              {this.state.genre.map((item, ind) =>
                ind > 9 ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('MovieList', {
                        url: `https://api.themoviedb.org/3/discover/tv?api_key=<api_key>&with_genres=${item.id}`,
                        genre: this.state.genre,
                        headerTitle: `${item.name} Shows`,
                        type: 'tv',
                      })
                    }>
                    <GenreCard
                      dark={d ? true : false}
                      imgURL={this.state.bgImages[ind]}
                      key={ind}
                      genre={item.name}
                    />
                  </TouchableOpacity>
                ) : null,
              )}
            </View>
          </ScrollView>
          <View
            style={{
              borderBottomColor: d ? '#ffffff80' : '#00000040',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text
              style={[
                styles.mainTitle,
                {
                  marginTop: 15,
                  color: d ? '#f5f6f7' : 'black',
                  fontSize: 15 * fs,
                },
              ]}>
              Top Rated Shows
            </Text>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 10,
                marginTop: 22,
              }}
              onPress={() => {
                this.props.navigation.navigate('MovieList', {
                  type: 'tv',
                  sub: 'top_rated',
                  genre: this.state.genre,
                  headerTitle: 'Top Rated Shows',
                });
              }}>
              <Text
                style={[
                  {
                    fontSize: 10 * fs,
                    textAlignVertical: 'center',
                    color: d ? '#f5f6f7' : 'black',
                  },
                ]}>
                See All &gt;
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                overflow: 'visible',
              }}>
              {this.state.topRated.map((item, index) =>
                index < 9 ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('MovieDetails', {
                        itemID: item.id,
                        type: 'tv',
                      })
                    }>
                    <MovieCard
                      dark={d ? true : false}
                      key={index}
                      rating={item.vote_average}
                      title={item.name}
                      genre={this.findGenres(item.genre_ids[0])}
                      imgURL={
                        item.poster_path
                          ? 'https://image.tmdb.org/t/p/w500/' +
                            item.poster_path
                          : null
                      }
                    />
                  </TouchableOpacity>
                ) : null,
              )}
            </View>
          </ScrollView>
          <View
            style={{
              borderBottomColor: d ? '#ffffff80' : '#00000040',
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginTop: 5,
            }}
          />
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text
              style={[
                styles.mainTitle,
                {
                  marginTop: 15,
                  color: d ? '#f5f6f7' : 'black',
                  fontSize: 15 * fs,
                },
              ]}>
              Now Airing
            </Text>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 10,
                marginTop: 22,
              }}
              onPress={() => {
                this.props.navigation.navigate('MovieList', {
                  type: 'tv',
                  sub: 'on_the_air',
                  genre: this.state.genre,
                  headerTitle: 'Now Airing',
                });
              }}>
              <Text
                style={[
                  {
                    fontSize: 10 * fs,
                    textAlignVertical: 'center',
                    color: d ? '#f5f6f7' : 'black',
                  },
                ]}>
                See All &gt;
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                overflow: 'visible',
              }}>
              {this.state.nowPlaying.map((item, index) =>
                index < 9 ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('MovieDetails', {
                        itemID: item.id,
                        type: 'tv',
                      })
                    }>
                    <MovieCard
                      dark={d ? true : false}
                      key={index}
                      rating={item.vote_average}
                      title={item.name}
                      genre={this.findGenres(item.genre_ids[0])}
                      imgURL={
                        item.poster_path
                          ? 'https://image.tmdb.org/t/p/w500/' +
                            item.poster_path
                          : null
                      }
                    />
                  </TouchableOpacity>
                ) : null,
              )}
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainTitle: {
    fontSize: 15,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});
