import React, { useEffect, } from 'react';
import { ExpoConfigView } from '@expo/samples';
import {TouchableHighlight, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import {Card, SearchBar} from 'react-native-elements';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import SquareGrid from "react-native-square-grid";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
let input = '';

export const TopBar = props => {

  onChangeText = text => {
    props.update(text)
    props.search(text);
  }

  return (
    <View style={{flex:props.topBarFlex}}>
      <SearchBar
      platform={"android"}
       onChangeText={onChangeText}
       onClear={() => props.clear()}
       placeholder="search Team or League..."
       value={props.input}
      />
    </View>
  );
}
