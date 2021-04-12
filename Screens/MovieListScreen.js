import React, {Component} from 'react';
import {ScrollView, View, Text, FlatList} from 'react-native';
import MovieCard from '../components/MovieCard';
import Header from '../components/Header';

export default class MovieListScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 1,
      movies: [],
      type: null,
      sub: null,
      genres: [],
      flag: false,
      headerTitle: null,
      totalPages: null,
    };
  }

  async componentDidMount() {
    var gen = await this.props.navigation.getParam('genre');
    this.setState({genres: gen});

    var headerTitle = this.props.navigation.getParam('headerTitle');
    this.setState({headerTitle: headerTitle});

    var type = await this.props.navigation.getParam('type');
    var sub = await this.props.navigation.getParam('sub');

    this.setState({type: type, sub: sub});
    this.get(type, sub);
    this.setState({flag: true});
  }

  findGenres = id => {
    var s = this.state.genres.filter(elem => {
      return elem.id == id;
    });
    s = s[0];
    if (s) {
      return s.name;
    }
  };

  get = async (type, sub) => {
    var res = await fetch(
      `https://api.themoviedb.org/3/${type}/${sub}?api_key=<api_key>&language=en-US&page=${this.state.currentPage}`,
    );

    res = await res.json();

    this.setState({totalPages: res.total_pages});

    res = await res.results;

    this.setState({movies: [...this.state.movies, ...res]});
    this.setState({currentPage: this.state.currentPage + 1});
  };

  onReachEnd = () => {
    if (this.state.currentPage < this.state.totalPages) {
      this.get(this.state.type, this.state.sub);
    }
    console.log(this.state.currentPage);
  };

  render() {
    return (
      <View style={{marginLeft: -10}}>
        <Header
          navigation={this.props.navigation}
          backBtn
          marginLeft={13}
          title={this.state.headerTitle}
        />
        {this.state.flag && (
          <FlatList
            data={this.state.movies}
            onEndReached={this.onReachEnd}
            onEndReachedThreshold={0.7}
            renderItem={({item, index}) => (
              <MovieCard
                scale={0.9}
                imgURL={'https://image.tmdb.org/t/p/w500/' + item.poster_path}
                rating={item.vote_average}
                title={item.title || item.name}
                genre={this.findGenres(item.genre_ids[0])}
              />
            )}
            numColumns={2}
            keyExtractor={item => item.id}
          />
        )}
      </View>
    );
  }
}
