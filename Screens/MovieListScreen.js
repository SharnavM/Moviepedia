import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  FlatList,
  AsyncStorage,
} from 'react-native';
import MovieCard from '../components/MovieCard';
import Header from '../components/Header';

export default class MovieListScreen extends Component {
  constructor(props) {
    super(props);

    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;

    this.state = {
      currentPage: 1,
      movies: [],
      type: null,
      sub: null,
      genres: [],
      flag: false,
      headerTitle: null,
      totalPages: null,
      dark: null,
      fontScaling: null,
    };
  }

  async componentDidMount() {
    let t = await AsyncStorage.getItem('dark');
    var gen = await this.props.navigation.getParam('genre');
    this.setState({genres: gen, dark: t === 'true'});

    let fs = await AsyncStorage.getItem('fontScale');

    this.setState({fontScaling: parseFloat(fs)});

    var headerTitle = this.props.navigation.getParam('headerTitle');
    headerTitle = headerTitle.includes('Science Fiction')
      ? headerTitle.replace('Science Fiction', 'Sci-Fi')
      : headerTitle;
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
    if (await this.props.navigation.getParam('url')) {
      var url =
        (await this.props.navigation.getParam('url')) +
        `&page=${this.state.currentPage}`;
    } else {
      var url = `https://api.themoviedb.org/3/${type}/${sub}?api_key=<api_key>&language=en-US&page=${this.state.currentPage}`;
    }
    var res = await fetch(url);

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
  };

  render() {
    var d = this.state.dark;
    var fs = this.state.fontScaling;

    return (
      <View style={{marginLeft: -10, backgroundColor: d ? '#242526' : 'white'}}>
        <Header
          dark={d ? true : false}
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
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('MovieDetails', {
                    itemID: item.id,
                    type: this.state.type === 'tv' ? 'tv' : null,
                  })
                }>
                <MovieCard
                  dark={d ? true : false}
                  border={true}
                  scale={0.9}
                  imgURL={
                    item.poster_path
                      ? 'https://image.tmdb.org/t/p/w500/' + item.poster_path
                      : null
                  }
                  rating={item.vote_average}
                  title={item.title || item.name}
                  genre={this.findGenres(item.genre_ids[0])}
                />
              </TouchableOpacity>
            )}
            numColumns={2}
            keyExtractor={item => item.id}
          />
        )}
      </View>
    );
  }
}
