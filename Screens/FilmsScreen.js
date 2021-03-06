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

export default class FilmsScreen extends Component {
  constructor(props) {
    super(props);

    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;

    this.state = {
      genre: [],
      bgImages: [],
      upcoming: [],
      nowPlaying: [],
      upcomingURL: '',
      dark: null,
      fontScaling: null,
    };
  }

  getGenre = async () => {
    var res = await fetch(
      'https://api.themoviedb.org/3/genre/movie/list?api_key=<api_key>&language=en-US&page=1&language=en-US',
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
      `https://api.themoviedb.org/3/movie/now_playing?api_key=<api_key>&language=en-US&page=1`,
    );

    res = await res.json();

    res = res.results;

    this.setState({nowPlaying: res});
  };

  getBG = async id => {
    var page = Math.floor(Math.random() * 4 + 1);
    var res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=<api_key>&with_genres=${id}&page=${page}`,
    );

    res = await res.json();

    res = res.results;

    var rand = res[Math.floor(Math.random() * res.length)];
    var url = 'https://image.tmdb.org/t/p/w500' + rand.backdrop_path;
    this.setState({bgImages: [...this.state.bgImages, url]});
  };

  getUpcoming = async () => {
    var year = new Date().getFullYear();
    var dd = String(new Date().getDate()).padStart(2, '0');
    var mm = String(new Date().getMonth() + 1).padStart(2, '0');
    var res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=<api_key>&primary_release_date.gte=${year}-${mm}-${dd}&primary_release_date.lte=${
        year + 1
      }-${mm}-${dd}`,
    );

    this.setState({
      upcomingURL: `https://api.themoviedb.org/3/discover/movie?api_key=<api_key>&primary_release_date.gte=${year}-${mm}-${dd}&primary_release_date.lte=${
        year + 1
      }-${mm}-${dd}`,
    });

    res = await res.json();

    res = res.results;

    this.setState({upcoming: res});
  };

  async componentDidMount() {
    this.getGenre();
    this.getUpcoming();
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
                        url: `https://api.themoviedb.org/3/discover/movie?api_key=<api_key>&with_genres=${item.id}`,
                        genre: this.state.genre,
                        headerTitle: `${item.name} Movies`,
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
                        url: `https://api.themoviedb.org/3/discover/movie?api_key=<api_key>&with_genres=${item.id}`,
                        genre: this.state.genre,
                        headerTitle: `${item.name} Movies`,
                      })
                    }>
                    <GenreCard
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
              Upcoming
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
                  sub: 'upcoming',
                  genre: this.state.genre,
                  headerTitle: 'Upcoming Movies',
                  url: this.state.upcomingURL,
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
              {this.state.upcoming.map((item, index) =>
                index < 9 ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('MovieDetails', {
                        itemID: item.id,
                      });
                    }}>
                    <MovieCard
                      dark={d ? true : false}
                      key={item.id}
                      rating={item.vote_average}
                      title={item.title}
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
                  fontSize: fs * 15,
                },
              ]}>
              Now Playing
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
                  sub: 'now_playing',
                  genre: this.state.genre,
                  headerTitle: 'Now Playing',
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
                      })
                    }>
                    <MovieCard
                      dark={d ? true : false}
                      key={item.id}
                      rating={item.vote_average}
                      title={item.title}
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
    marginLeft: 10,
    fontWeight: 'bold',
  },
});
