import React, {Component} from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import TabBarIcon from '../components/TabBarIcon';
import StandingsContainer from '../containers/standings/Main';
import StandingsDetailsContainer from '../containers/standings/Details';
import FixturesContainer from '../containers/fixturesV2/Main';
import FixturesDetailsContainer from '../containers/fixturesV2/Details';
import SearchContainer from '../containers/search/Main';
import LeagueContainer from '../containers/league/Main';
import TeamContainer from '../containers/team/Main';
import FollowingContainer from '../containers/following/Main';
import PlayerContainer from '../containers/misc/Player';
import Sample from '../screens/sample';
// import FollowingScreen from '../screens/following/Following';

const StandingsStack = createStackNavigator({
  Standings: Sample, // TODO: Change to real screen
  // Inner: Sample,
}, {headerLayoutPreset: 'center'});

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
        lazy: true,
        initialRouteName: 'Search',

    }
);

export default MainTabNavigator;
