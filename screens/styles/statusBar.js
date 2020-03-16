import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { mainColor } from './root'

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight/2;

const NewStatusBar = () => (
  <View style={{height: STATUSBAR_HEIGHT}} backgroundColor={mainColor}>

  </View>
);

export default NewStatusBar;
