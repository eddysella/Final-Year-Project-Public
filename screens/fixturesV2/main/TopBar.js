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


  const RenderTopBar = (item) => {
    fixture = item.item;
    statsBorder=0;
    eventsBorder=0;
    lineupBorder=0;
    if(currentTab == 0){
      statsBorder=2;
      eventsBorder=0;
      lineupBorder=0;
    }else if(currentTab == 1){
      statsBorder=0;
      eventsBorder=2;
      lineupBorder=0;
    }else if(currentTab == 2){
      statsBorder=0;
      eventsBorder=0;
      lineupBorder=2;
    }

    return (
      <View style={{flex:1}}>
        <View flexDirection={'row'} style={{flex:3, justifyContent: 'space-around'}}>
          <View style={{flex:1, margin: 5}}>
            <Image
            style={{flex:2}}
            resizeMode={"contain"}
            source={{ uri: fixture.homeLogo }}
            />
            <Text style={{flex:1, textAlign:'center'}}>{fixture.homeName}</Text>
          </View>

          <View style={{flex:1, margin: 5, alignItems:'center', justifyContent:'center'}}>
            <Text>{fixture.status}</Text>
          </View>

          <View style={{flex:1, margin: 5}}>
            <Image
            style={{flex:2}}
            resizeMode={"contain"}
            source={{ uri: fixture.awayLogo}}
            />
            <Text style={{flex:1, textAlign:'center'}}>{fixture.awayName}</Text>
          </View>
        </View>
        <View flexDirection={'row'} style={{flex:1, justifyContent: 'space-around'}}>
          <TouchableHighlight onPress={() => setTab(0)}
          style={{flex:1, borderBottomWidth:statsBorder}}>
          <Text style={{textAlign: 'center'}}>Stats</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => setTab(1)}
            style={{flex:1, alignItems: 'center', borderBottomWidth:eventsBorder}}>
          <Text style={{textAlign:'center'}}>Events</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => setTab(2)}
          style={{flex:1, borderBottomWidth:lineupBorder}}>
          <Text style={{textAlign: 'center'}}>Line-Up</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
