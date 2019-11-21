import React, {Component} from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import TabBarIcon from '../components/TabBarIcon';
import StandingsContainer from '../containers/StandingsContainer';
import SpecificStandingContainer from '../containers/SpecificStandingContainer';
import FixturesContainer from '../containers/FixturesContainer';
import SearchScreen from '../screens/Search';
import FollowingScreen from '../screens/Following';

const StandingsStack = createStackNavigator({
  Standings: StandingsContainer,
  Inner: SpecificStandingContainer,
}, {headerLayoutPreset: 'center'});

const FixturesStack = createStackNavigator({
  Fixtures: FixturesContainer,
}, {headerLayoutPreset: 'center'});

const SearchStack = createStackNavigator({
  Search: SearchScreen,
}, {headerLayoutPreset: 'center'});

const FollowingStack = createStackNavigator({
  Following: FollowingScreen,
}, {headerLayoutPreset: 'center'});

export default createBottomTabNavigator(
    {
        Standings: StandingsStack,
        Fixtures: FixturesStack,
        Search: SearchStack,
        Following: FollowingStack,
    },
    {
        headerLayoutPreset: 'center',
        defaultNavigationOptions: ({ navigation }) => ({
                  tabBarIcon: ({ focused, horizontal, tintColor }) => {
                  const { routeName } = navigation.state;
                  let IconComponent = Ionicons;
                  let iconName;
                  if (routeName === 'Standings') {
                    iconName = `ios-trending-up`;
                  }else if (routeName === 'Fixtures') {
                    iconName = `ios-calendar`;
                  }else if (routeName === 'Search') {
                    iconName = `ios-search`;
                  }else if (routeName === 'Following') {
                    iconName = `ios-heart`;
                  }

                  // You can return any component that you like here!
                  return <IconComponent name={iconName} size={25} color={tintColor} />;
                },
                headerStyle: {
                                backgroundColor: '#f4511e',
                              },
                              headerTintColor: '#fff',
                              headerTitleStyle: {
                                fontWeight: 'bold',
                              },
                }),
        lazy: 'false',
        initialRouteName: 'Fixtures',

    }
);
