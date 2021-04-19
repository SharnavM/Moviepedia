import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Linking,
  FlatList,
  AsyncStorage,
} from 'react-native';
import MovieCard from '../components/MovieCard';

export default class MovieDetailsScreen extends Component {
  constructor(props) {
    super(props);

    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;

    this.state = {
      item: null,
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      cast: [],
      crew: [],
      mainCrew: [],
      reviews: [],
      reviewRender: [],
      dark: null,
      fontScaling: null,
    };
  }

  async componentDidMount() {
    let itemID = await this.props.navigation.getParam('itemID');
    let type = await this.props.navigation.getParam('type');

    this.getReviews(itemID, type);
    this.getDetails(itemID, type);
    this.getCredits(itemID, type);

    let t = await AsyncStorage.getItem('dark');

    this.setState({dark: t === 'true'});

    let fs = await AsyncStorage.getItem('fontScale');

    this.setState({fontScaling: parseFloat(fs)});
  }

  getReviews = async (id, type = undefined) => {
    let url = type
      ? `https://api.themoviedb.org/3/${type}/${id}/reviews?api_key=<api_key>&language=en-US&page=1`
      : `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=<api_key>&language=en-US&page=1`;

    let res = await fetch(url);

    res = await res.json();
    res = await res.results;
    if (res !== []) {
      this.setState({
        reviews: res,
        reviewRender: [res[0]],
      });
    } else {
      this.setState({reviewRender: ['No Reviews']});
    }
  };

  convertRuntime = time => {
    let hr = Math.floor(time / 60);
    let min = time % 60;
    hr = hr == 1 ? hr + ' hr' : hr + ' hrs';
    min = min <= 1 ? min + ' min' : min + ' mins';
    return hr == '0 hrs' ? `${min}` : `${hr} ${min}`;
  };

  convertDate = date => {
    if (date !== null) {
      let d = date.split('-');

      let yy = d[0];
      let mm = d[1];
      let dd = d[2];

      mm = this.state.months[mm - 1];

      return `${dd} ${mm}, ${yy}`;
    } else {
      return '';
    }
  };

  openURL = item => {
    if (item.site == 'YouTube') {
      Linking.openURL('https://youtu.be/' + item.key);
    } else if (item.site == 'Vimeo') {
      Linking.openURL('https://vimeo.com/' + item.key);
    }
  };

  getCredits = async (id, type = null) => {
    if (type) {
      var url =
        'https://api.themoviedb.org/3/' +
        type +
        '/' +
        id +
        '/credits?api_key=<api_key>';
    } else {
      var url =
        'https://api.themoviedb.org/3/movie/' +
        id +
        '/credits?api_key=<api_key>&append_to_response=videos';
    }

    var res = await fetch(url);
    res = await res.json();

    let director = res.crew.filter(elem => {
      return elem.job === 'Director';
    });

    this.setState({cast: res.cast, crew: director});
  };

  getDetails = async (id, type = null) => {
    if (type) {
      var url =
        'https://api.themoviedb.org/3/' +
        type +
        '/' +
        id +
        '?api_key=<api_key>&append_to_response=videos';
    } else {
      var url =
        'https://api.themoviedb.org/3/movie/' +
        id +
        '?api_key=<api_key>&append_to_response=videos';
    }

    let res = await fetch(url);
    res = await res.json();

    res.videos.results = res.videos.results.filter(elem => {
      return elem.type == 'Trailer';
    });

    this.setState({item: res});
  };

  loadMoreReviews = () => {
    let x = this.state.reviewRender[this.state.reviewRender.length - 1];

    x = this.state.reviews.indexOf(x);
    if (x != -1) {
      for (var i = 0; i < 2; i++) {
        if (x + i <= this.state.reviews.length - 1) {
          this.setState({
            reviewRender: [
              ...this.state.reviewRender,
              this.state.reviews[x + i],
            ],
          });
        }
      }
    }
  };

  render() {
    var d = this.state.dark;
    var fs = this.state.fontScaling;

    if (this.state.item) {
      return (
        <View
          style={{minHeight: '100%', backgroundColor: d ? '#18191a' : '#fff'}}>
          <ScrollView contentContainerStyle={{paddingBottom: 100}}>
            <View
              style={{
                minHeight: '100%',
                width: '100%',
                backgroundColor: d ? '#18191a' : '#fff',
              }}>
              <Image
                style={{
                  maxWidth: Dimensions.get('screen').width,
                  height: (37.5 / 100) * Dimensions.get('screen').height,
                  resizeMode: 'cover',
                  aspectRatio: 500 / 281,
                }}
                source={{
                  uri: `https://image.tmdb.org/t/p/original${this.state.item.backdrop_path}`,
                }}
              />
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: '95%',
                    borderRadius: 10,
                    marginTop: -60,
                    backgroundColor: d ? '#242526' : '#fff',
                    elevation: d ? 0 : 5,
                    padding: 10,
                  }}>
                  <Text
                    style={{
                      width: '75%',
                      fontWeight: 'bold',
                      fontSize: 15 * fs,
                      color: d ? '#f5f6f7' : 'black',
                    }}>
                    {this.state.item.title ||
                      this.state.item.name ||
                      this.state.item.original_name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11 * fs,
                      marginTop: 7.5,
                      color: d ? '#f5f6f7' : 'black',
                    }}>
                    {this.convertRuntime(
                      this.state.item.runtime ||
                        this.state.item.episode_run_time[0],
                    )}
                  </Text>
                  <Text
                    style={{fontSize: 11 * fs, color: d ? '#f5f6f7' : 'black'}}>
                    {this.convertDate(
                      this.state.item.release_date ||
                        this.state.item.first_air_date,
                    )}
                  </Text>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                      marginTop: -31,
                    }}>
                    <View style={{position: 'relative', top: -8, right: 2}}>
                      <Image
                        style={{
                          width: 8 * 2,
                          height: 8 * 2,
                          resizeMode: 'cover',
                        }}
                        source={require('../assets/star.png')}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 16 * fs,
                        color: d ? '#f5f6f7' : 'black',
                      }}>
                      {this.state.item.vote_average}
                      <Text style={{fontSize: 10 * fs}}>
                        /10 | {this.state.item.vote_count}
                      </Text>
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 12 * fs,
                      marginTop: 15,
                      color: d ? '#f5f6f7' : 'black',
                    }}>
                    Overview
                  </Text>
                  <Text
                    style={{
                      width: '95%',
                      fontSize: 11 * fs,
                      color: d ? '#f5f6f7' : 'black',
                    }}>
                    {this.state.item.overview}
                  </Text>
                  {this.state.item.videos.results.length != 0 ? (
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        marginTop: 10,
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          this.openURL(this.state.item.videos.results[0])
                        }
                        style={{
                          backgroundColor: '#7800a8',
                          paddingHorizontal: 15,
                          paddingVertical: 10,
                          borderRadius: 50,
                          transform: [{scale: 0.9}],
                        }}>
                        <Text style={{textAlign: 'center', color: '#fff'}}>
                          Watch Trailer
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
                <View
                  style={{
                    width: '95%',
                    borderRadius: 10,
                    marginTop: 20,
                    backgroundColor: d ? '#242526' : '#fff',
                    elevation: d ? 0 : 5,
                    padding: 10,
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: '100%',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 11 * fs,
                        marginTop: 2,
                        marginRight: 2,
                        color: d ? '#f5f6f7' : 'black',
                      }}>
                      Tags:
                    </Text>
                    <FlatList
                      style={{marginLeft: 3}}
                      horizontal={true}
                      data={this.state.item.genres}
                      renderItem={elem => {
                        return (
                          <View
                            key={elem.item.id}
                            style={{
                              paddingHorizontal: 15,
                              borderRadius: 50,
                              backgroundColor: '#D4FEF9',
                              marginTop: 2.5,
                              marginRight: 3,
                            }}>
                            <Text
                              style={{
                                textAlign: 'center',
                                fontSize: 10 * fs,
                                width: '100%',
                                marginTop: 0,
                              }}>
                              {elem.item.name}
                            </Text>
                          </View>
                        );
                      }}
                      keyExtractor={(elem, ind) => ind.toString()}
                    />
                  </View>
                </View>
                <View
                  style={{
                    width: '95%',
                    borderRadius: 10,
                    marginTop: 20,
                    backgroundColor: d ? '#242526' : '#fff',
                    elevation: d ? 0 : 5,
                    padding: 10,
                  }}>
                  <Text
                    style={{
                      width: '75%',
                      fontWeight: 'bold',
                      fontSize: 15 * fs,
                      color: d ? '#f5f6f7' : 'black',
                    }}>
                    Cast
                  </Text>
                  <ScrollView horizontal={true}>
                    {this.state.cast.map((item, index) => (
                      <MovieCard
                        dark={d ? true : false}
                        scale={0.95}
                        border={true}
                        key={index}
                        rating={null}
                        title={item.name}
                        genre={item.character}
                        imgURL={
                          item.profile_path
                            ? 'https://image.tmdb.org/t/p/w500/' +
                              item.profile_path
                            : 'https://copyrightagent.com/wp-content/uploads/2019/10/avatar.png'
                        }
                      />
                    ))}
                  </ScrollView>
                </View>
                <View
                  style={{
                    width: '95%',
                    borderRadius: 10,
                    marginTop: 20,
                    backgroundColor: d ? '#242526' : '#fff',
                    elevation: d ? 0 : 5,
                    padding: 10,
                  }}>
                  <Text
                    style={{
                      width: '75%',
                      fontWeight: 'bold',
                      fontSize: 15 * fs,
                      color: d ? '#f5f6f7' : 'black',
                    }}>
                    Reviews
                  </Text>
                  <View style={{width: '95%', marginTop: 10}}>
                    {this.state.reviewRender.map((item, index) =>
                      item !== undefined ? (
                        <View
                          key={index}
                          style={{width: '100%', marginTop: 10}}>
                          <View style={{display: 'flex', flexDirection: 'row'}}>
                            {item.author_details.avatar_path ? (
                              <Image
                                style={{
                                  width: 32 * 1.25,
                                  height: 32 * 1.25,
                                  borderRadius: 50,
                                }}
                                source={{
                                  uri:
                                    'https://image.tmdb.org/t/p/w500/' +
                                    item.author_details.avatar_path,
                                }}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 32 * 1.25,
                                  height: 32 * 1.25,
                                  borderRadius: 50,
                                }}
                                source={{
                                  uri:
                                    'https://copyrightagent.com/wp-content/uploads/2019/10/avatar.png',
                                }}
                              />
                            )}
                            <View
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '80%',
                                marginLeft: 10,
                                marginTop: -2,
                              }}>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                  color: d ? '#f5f6f7' : 'black',
                                }}>
                                {item.author}
                              </Text>
                              <Text
                                style={{
                                  width: '100%',
                                  fontSize: 11 * fs,
                                  color: d ? '#f5f6f7' : 'black',
                                }}>
                                {item.content}
                              </Text>
                            </View>
                          </View>
                        </View>
                      ) : (
                        <Text
                          style={{
                            fontStyle: 'italic',
                            fontSize: 11 * fs,
                            color: '#898989',
                          }}>
                          No Reviews
                        </Text>
                      ),
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={this.loadMoreReviews}
                    disabled={
                      this.state.reviews.length ===
                      this.state.reviewRender.filter(Boolean).length
                        ? true
                        : false
                    }
                    style={{width: '100%', marginTop: 5}}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 12 * fs,
                        color: '#0645ff',
                        textDecorationLine: 'underline',
                      }}>
                      {this.state.reviews.length ===
                      this.state.reviewRender.filter(Boolean).length
                        ? 'End Of List'
                        : 'See More'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return <View></View>;
    }
  }
}
