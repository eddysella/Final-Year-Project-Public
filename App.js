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
import { initFixtureDates, initTodaysFixtures, initCurrentDate} from './redux/creators/fixturesMain'
import store from './redux/store'

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  store.dispatch(initFixtureDates());
  store.dispatch(initCurrentDate());
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
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <Provider store={store}>
          <AppNavigator/>
          </Provider>
        </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    store.dispatch(initTodaysFixtures()),
    // store.dispatch(setTodaysStandings()),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
  ]);
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
