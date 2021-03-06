import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import MovieCard from '../components/MovieCard';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;

    this.state = {
      topMovies: [],
      genres: [],
      popularMovies: [],
      popularTV: [],
      TVgenres: [],
      fontScale: null,
    };
  }

  getTopMovies = async () => {
    var res = await fetch(
      'https://api.themoviedb.org/3/movie/top_rated?api_key=<api_key>&language=en-US&page=1',
    );

    res = await res.json();

    this.setState({topMovies: res.results});
  };

  getPopularMovies = async () => {
    var res = await fetch(
      'https://api.themoviedb.org/3/movie/popular?api_key=<api_key>&language=en-US&page=1',
    );

    res = await res.json();

    this.setState({popularMovies: res.results});
  };

  getPopularTV = async () => {
    var res = await fetch(
      'https://api.themoviedb.org/3/tv/popular?api_key=<api_key>&language=en-US&page=1',
    );

    res = await res.json();

    this.setState({popularTV: res.results});
  };

  getGenres = async () => {
    var res = await fetch(
      'https://api.themoviedb.org/3/genre/movie/list?api_key=<api_key>&language=en-US&page=1&language=en-US',
    );

    res = await res.json();
    var r = await res.genres;
    this.setState({genres: r});
  };

  getTVGenres = async () => {
    var res = await fetch(
      'https://api.themoviedb.org/3/genre/tv/list?api_key=<api_key>&language=en-US&page=1&language=en-US',
    );

    res = await res.json();
    var r = await res.genres;
    this.setState({TVgenres: r});
  };

  findGenres = id => {
    var s = this.state.genres.filter(elem => {
      return elem.id == id;
    });
    s = s[0];
    if (s) {
      return s.name;
    }
  };

  findTVGenres = id => {
    var s = this.state.TVgenres.filter(elem => {
      return elem.id == id;
    });
    s = s[0];
    if (s) {
      return s.name;
    }
  };

  async componentDidMount() {
    this.getGenres();
    this.getTVGenres();
    this.getTopMovies();
    this.getPopularMovies();
    this.getPopularTV();

    let t = await AsyncStorage.getItem('dark');
    if (t === null) {
      await AsyncStorage.setItem('dark', 'false');
    }
    t = await AsyncStorage.getItem('dark');
    this.setState({
      dark: t === 'true',
    });

    if ((await AsyncStorage.getItem('fontScale')) === null) {
      await AsyncStorage.setItem('fontScale', '1.5');
    }

    this.setState({
      fontScale: parseFloat(await AsyncStorage.getItem('fontScale')),
    });
  }

  render() {
    var d = this.state.dark;
    var fs = this.state.fontScale;
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
              Top Movies
            </Text>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 10,
                marginTop: 22,
              }}
              onPress={() => {
                this.props.navigation.navigate('MovieList', {
                  type: 'movie',
                  sub: 'top_rated',
                  genre: this.state.genres,
                  headerTitle: 'Top Movies',
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
              {this.state.topMovies.map((item, index) =>
                index < 9 ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('MovieDetails', {
                        itemID: item.id,
                      })
                    }>
                    <MovieCard
                      dark={d ? true : false}
                      key={item.id}
                      rating={item.vote_average}
                      title={item.title}
                      genre={this.findGenres(
                        item.genre_ids[item.genre_ids.length - 1],
                      )}
                      imgURL={
                        'https://image.tmdb.org/t/p/w500/' + item.poster_path
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
              marginTop: 15,
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
              Popular Movies
            </Text>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 10,
                marginTop: 22,
              }}
              onPress={() => {
                this.props.navigation.navigate('MovieList', {
                  type: 'movie',
                  sub: 'popular',
                  genre: this.state.genres,
                  headerTitle: 'Popular Movies',
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
              {this.state.popularMovies.map((item, index) =>
                index < 9 ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('MovieDetails', {
                        itemID: item.id,
                      })
                    }>
                    <MovieCard
                      dark={d ? true : false}
                      key={item.id}
                      rating={item.vote_average}
                      title={item.title}
                      genre={this.findGenres(
                        item.genre_ids[item.genre_ids.length - 1],
                      )}
                      imgURL={
                        'https://image.tmdb.org/t/p/w500/' + item.poster_path
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
              marginTop: 15,
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
              Popular Shows
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 22,
                position: 'absolute',
                right: 10,
              }}
              onPress={() => {
                this.props.navigation.navigate('MovieList', {
                  type: 'tv',
                  sub: 'popular',
                  genre: this.state.TVgenres,
                  headerTitle: 'Popular TV Shows',
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
              {this.state.popularTV.map((item, index) =>
                index < 9 ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('MovieDetails', {
                        itemID: item.id,
                        type: 'tv',
                      });
                    }}>
                    <MovieCard
                      dark={d ? true : false}
                      key={item.id}
                      rating={item.vote_average}
                      title={item.name}
                      genre={this.findTVGenres(item.genre_ids[0])}
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
    marginLeft: 10,
    fontWeight: 'bold',
  },
});
