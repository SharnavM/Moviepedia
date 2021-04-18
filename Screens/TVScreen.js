import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import GenreCard from '../components/GenreCard';
import MovieCard from '../components/MovieCard';

export default class TVScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genre: [],
      bgImages: [],
      topRated: [],
      nowPlaying: [],
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

  componentDidMount() {
    this.getGenre();
    this.getTopRated();
    this.getNowPlaying();
  }

  render() {
    return (
      <View>
        <ScrollView style={{backgroundColor: '#fff'}}>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={[styles.mainTitle, {marginTop: 15}]}>
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
              borderBottomColor: '#00000040',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={[styles.mainTitle, {marginTop: 15}]}>
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
                      key={index}
                      rating={item.vote_average}
                      title={item.name}
                      genre={this.findGenres(item.genre_ids[0])}
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
              borderBottomColor: '#00000040',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={[styles.mainTitle, {marginTop: 15}]}>Now Airing</Text>
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
                      key={index}
                      rating={item.vote_average}
                      title={item.name}
                      genre={this.findGenres(item.genre_ids[0])}
                      imgURL={
                        'https://image.tmdb.org/t/p/w500/' + item.poster_path
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
