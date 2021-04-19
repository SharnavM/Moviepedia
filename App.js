import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Tab from './components/BottomTabs';
import MovieDetailsScreen from './Screens/MovieDetails';
import MovieListScreen from './Screens/MovieListScreen';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {dark: null};
  }

  async componentDidMount() {
    let t = await AsyncStorage.getItem('dark');

    this.setState({dark: t === 'true'});
  }
  render() {
    var d = this.state.dark;
    return <AppContainer theme={d ? 'dark' : 'light'} />;
  }
}

const Stack = createStackNavigator({
  Tab: {screen: Tab, navigationOptions: {headerShown: false}},
  MovieList: {screen: MovieListScreen, navigationOptions: {headerShown: false}},
  MovieDetails: {
    screen: MovieDetailsScreen,
    navigationOptions: {headerShown: false},
  },
});

const AppContainer = createAppContainer(Stack);
