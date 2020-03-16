import React, {Component} from 'react';
import { Platform, Text } from 'react-native';
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

import { mainColor, focusedColor } from '../screens/styles/root'

const FixturesStack = createStackNavigator({
  Fixtures: FixturesContainer,
  Inner: FixturesDetailsContainer
});

const SearchStack = createStackNavigator({
  Search: SearchContainer,
  League: LeagueContainer,
  Team: TeamContainer,
  Fixture: FixturesDetailsContainer,
  Player: PlayerContainer
});

const FollowingStack = createStackNavigator({
  Following: FollowingContainer,
  League: LeagueContainer,
  Team: TeamContainer,
  Fixture: FixturesDetailsContainer,
  Player: PlayerContainer
});

const MainTabNavigator = createBottomTabNavigator(
    {
        Fixtures: FixturesStack,
        Search: SearchStack,
        Following: FollowingStack,
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
          tabBarIcon: ({focused}) => {
          const { routeName } = navigation.state;
          const color = focused ? focusedColor : mainColor;
          let IconComponent = Ionicons;
          let iconName;
          if (routeName === 'Fixtures') {
            iconName = `ios-calendar`;
          }else if (routeName === 'Search') {
            iconName = `ios-search`;
          }else if (routeName === 'Following') {
            iconName = `ios-heart`;
          }
          return <IconComponent name={iconName} size={25} color={color}/>;
        },
        tabBarLabel: ({focused}) => {
          const { routeName } = navigation.state;
          const color = focused ? focusedColor : mainColor;
          return <Text style={{alignSelf:'center', color:color}}>{routeName}</Text>
        }
      }),
        lazy: true,
        initialRouteName: 'Fixtures',
    }
);

export default MainTabNavigator;
