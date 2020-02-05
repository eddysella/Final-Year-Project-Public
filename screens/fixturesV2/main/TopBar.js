import React, { Component, useState } from 'react';
import { ExpoConfigView } from '@expo/samples';
import {Image, TouchableHighlight, SectionList, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import {Card} from 'react-native-elements';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { MaterialIndicator,} from 'react-native-indicators';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const itemWidth = screenWidth - scale(screenWidth/5);
const itemHeight = scale(screenWidth/4);
const itemHorizontalPadding = (itemWidth/5);
const itemVerticalPadding = scale(15);

export const TopBar = props => {

  function ItemSeparator(){
    return (
      <View
        style={{
          height: scale(2),
          width: '100%',
          backgroundColor: "#000",
        }}
      />
    );
  };

  pastBorder=0;
  todayBorder=0;
  futureBorder=0;
  if(currentTab == 0){
    pastBorder=2;
    todayBorder=0;
    futureBorder=0;
  }else if(currentTab == 1){
    pastBorder=0;
    todayBorder=2;
    futureBorder=0;
  }else if(currentTab == 2){
    pastBorder=0;
    todayBorder=0;
    futureBorder=2;
  }

  return (
    <View style={{flex:1}}>
      <View flexDirection={'row'} style={{flex:1, justifyContent: 'space-around'}}>
        <TouchableHighlight onPress={() => setTab(0)}
        style={{flex:1, borderBottomWidth:pastBorder}}>
        <Text style={{textAlign: 'center'}}>Past</Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={() => setTab(1)}
          style={{flex:1, alignItems: 'center', borderBottomWidth:todayBorder}}>
        <Text style={{textAlign:'center'}}>Today</Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={() => setTab(2)}
        style={{flex:1, borderBottomWidth:futureBorder}}>
        <Text style={{textAlign: 'center'}}>Future</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}
