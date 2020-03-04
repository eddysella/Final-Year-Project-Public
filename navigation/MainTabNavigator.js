import React, {Component} from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import TabBarIcon from '../components/TabBarIcon';

import FixturesContainer from '../containers/fixturesV2/Main';
import FixturesDetailsContainer from '../containers/fixturesV2/Details';
import SearchContainer from '../containers/search/Main';
import LeagueContainer from '../containers/league/Main';
import TeamContainer from '../containers/team/Main';
import FollowingContainer from '../containers/following/Main';
import PlayerContainer from '../containers/misc/Player';

const FixturesStack = createStackNavigator({
  Fixtures: FixturesContainer,
  Inner: FixturesDetailsContainer,
}, {headerLayoutPreset: 'center'});

const SearchStack = createStackNavigator({
  Search: SearchContainer,
  League: LeagueContainer,
  Team: TeamContainer,
  Fixture: FixturesDetailsContainer,
  Player: PlayerContainer
}, {headerLayoutPreset: 'center'});

const FollowingStack = createStackNavigator({
  Following: FollowingContainer,
  League: LeagueContainer,
  Team: TeamContainer,
  Fixture: FixturesDetailsContainer,
  Player: PlayerContainer
}, {headerLayoutPreset: 'center'});

const MainTabNavigator = createBottomTabNavigator(
    {
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
                  if (routeName === 'Fixtures') {
                    iconName = `ios-calendar`;
                  }else if (routeName === 'Search') {
                    iconName = `ios-search`;
                  }else if (routeName === 'Following') {
                    iconName = `ios-heart`;
                  }
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
        lazy: true,
        initialRouteName: 'Fixtures',
    }
);

export default MainTabNavigator;
