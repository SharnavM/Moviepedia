import createBottomTabNavigator from '../node_modules/react-navigation-tabs/lib/module/navigators/createBottomTabNavigator';
import HomeScreen from '../Screens/HomeScreen';
import SearchScreen from '../Screens/SearchScreen';
import FilmsScreen from '../Screens/FilmsScreen';
import TVScreen from '../Screens/TVScreen';
import SettingsScreen from '../Screens/SettingsScreen';
import {Image} from 'react-native';
import React from 'react';

const Tab = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Image
            style={{tintColor: tintColor, width: 30, height: 30, marginTop: 10}}
            source={require('../assets/home.png')}
          />
        ),
      },
    },
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Image
            style={{
              tintColor: tintColor,
              width: 30,
              height: 30,
              marginTop: 10,
              marginLeft: -5,
            }}
            source={require('../assets/search.png')}
          />
        ),
      },
    },
    Films: {
      screen: FilmsScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Image
            style={{tintColor: tintColor, width: 20, height: 20, marginTop: 10}}
            source={require('../assets/movie.png')}
          />
        ),
      },
    },
    TV: {
      screen: TVScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Image
            style={{tintColor: tintColor, width: 25, height: 25, marginTop: 5}}
            source={require('../assets/tv.png')}
          />
        ),
      },
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Image
            style={{tintColor: tintColor, width: 30, height: 30, marginTop: 10}}
            source={require('../assets/settings.png')}
          />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#D8334a',
      labelStyle: {
        fontSize: 8,
      },
    },
  },
);

export default Tab;
