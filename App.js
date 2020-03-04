import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppNavigator from './navigation/AppNavigator';

import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'

import store from './redux/store'
import rootReducer from './redux/reducers/index'

import { initFixtures,} from './redux/creators/fixtures'
import { fetchTeams } from './redux/creators/teams'
import { fetchLeagues } from './redux/creators/leagues'
import { initFollowedLeagues, initFollowedTeams } from './redux/creators/following'

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
          <AppLoading
          startAsync={loadResourcesAsync}
          onError={handleLoadingError}
          onFinish={() => handleFinishLoading(setLoadingComplete)}
          />

    );
  } else {
    return (
        <View style={{flex: 1}}>
          <Provider store={store}>
          <AppNavigator/>
          </Provider>
        </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    retrieveFollowing(),
    store.dispatch(initFixtures()),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
  ])
}

async function retrieveFollowing(){
  try {
        console.log( "Retrieving leagues from storage" );
        AsyncStorage.getItem( 'FOLLOWINGLEAGUES' )
        .then(leagues => {
          if ( leagues !== null ) {
            console.log( "Retrieved leagues from storage" );
              leagueArray = JSON.parse(leagues)
              store.dispatch(initFollowedLeagues(leagueArray))
          }
        })
  } catch ( e ) {}
  try {
        console.log( "Retrieving teams from storage" );
        AsyncStorage.getItem( 'FOLLOWINGTEAMS' )
        .then(teams => {
          if ( teams !== null ) {
            console.log( "Retrieved teams from storage" );
              teamArray = JSON.parse(teams)
              store.dispatch(initFollowedTeams(teamArray))
          }
        })
  } catch ( e ) {}
}

function handleLoadingError(error) {
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}
