import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppNavigator from './navigation/AppNavigator';

import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers/index'
import { initFixtures,} from './redux/creators/fixtures'
import { fetchTeams } from './redux/creators/teams'
import { fetchLeagues } from './redux/creators/leagues'
import store from './redux/store'

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
        <View style={styles.container}>
          <Provider store={store}>
          <AppNavigator/>
          </Provider>
        </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    store.dispatch(fetchTeams(store.getState().followingTeamIDs)),
    store.dispatch(fetchLeagues(store.getState().followingLeagueIDs)),
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

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
});


    //
    // async componentDidMount() {
    //     try {
    //         const arr = await AsyncStorage.getItem( 'PREFSTANDINGS' );
    //         console.log( "Im getting called" );
    //         if ( value !== null ) {
    //             console.log( "Found saved standings" );
    //             let collect = [];
    //             for ( value in JSON.parse( arr ) ) {
    //                 getLeagueByID( value ).then( data => collect.push(data));
    //             }
    //             this.setState({
    //                 leaguesList: collect,
    //                 loading: false,
    //             });
    //         }
    //     } catch ( e ) {
    //         try {
    //             console.log( "Init default standings" );
    //             await AsyncStorage.setItem( 'PREFSTANDINGS', JSON.stringify( [ 1 ] ) );
    //             console.log( 'retrievingData' );
    //             getLeagueByID( '1' ).then( data =>
    //                 this.setState( {
    //                     leaguesList: data,
    //                     loading: false,
    //                 } )
    //             );
    //         } catch ( error ) {
    //             // Error saving data
    //         }
    //     }
    // }
