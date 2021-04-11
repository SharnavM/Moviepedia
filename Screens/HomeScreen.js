import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MovieCard from '../components/MovieCard';
import Header from '../components/Header';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topMovies: [],
      genres: [],
      popularMovies: [],
      popularTV: [],
      TVgenres: [],
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

  componentDidMount() {
    this.getGenres();
    this.getTVGenres();
    this.getTopMovies();
    this.getPopularMovies();
    this.getPopularTV();
  }

  render() {
    return (
      <View>
        <ScrollView style={{backgroundColor: '#fff'}}>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={[styles.mainTitle, {marginTop: 15}]}>Top Movies</Text>
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
                    fontSize: 10,
                    textAlignVertical: 'center',
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
                  <MovieCard
                    key={index}
                    rating={item.vote_average}
                    title={item.title}
                    genre={this.findGenres(
                      item.genre_ids[item.genre_ids.length - 1],
                    )}
                    imgURL={
                      'https://image.tmdb.org/t/p/w500/' + item.poster_path
                    }
                  />
                ) : null,
              )}
            </View>
          </ScrollView>
          <View
            style={{
              borderBottomColor: '#00000040',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={[styles.mainTitle, {marginTop: 15}]}>
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
                    fontSize: 10,
                    textAlignVertical: 'center',
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
                  <MovieCard
                    key={index}
                    rating={item.vote_average}
                    title={item.title}
                    genre={this.findGenres(
                      item.genre_ids[item.genre_ids.length - 1],
                    )}
                    imgURL={
                      'https://image.tmdb.org/t/p/w500/' + item.poster_path
                    }
                  />
                ) : null,
              )}
            </View>
          </ScrollView>
          <View
            style={{
              borderBottomColor: '#00000040',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={[styles.mainTitle, {marginTop: 15}]}>
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
                    fontSize: 10,
                    textAlignVertical: 'center',
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
                  <MovieCard
                    key={index}
                    rating={item.vote_average}
                    title={item.name}
                    genre={this.findTVGenres(item.genre_ids[0])}
                    imgURL={
                      'https://image.tmdb.org/t/p/w500/' + item.poster_path
                    }
                  />
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
