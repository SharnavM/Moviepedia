import React, {Component} from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Tab from './components/BottomTabs';

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}

const Stack = createStackNavigator({
  Tab: {screen: Tab, navigationOptions: {headerShown: false}},
});

const AppContainer = createAppContainer(Stack);
