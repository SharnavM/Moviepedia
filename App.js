import React, {Component} from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Tab from './components/BottomTabs';
import MovieDetailsScreen from './Screens/MovieDetails';
import MovieListScreen from './Screens/MovieListScreen';

export default class App extends Component {
  render() {
    return <AppContainer />;
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
