import React, { Component, useState } from 'react';
import {Image, TouchableHighlight, SectionList, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions } from 'react-native';

export const Header = props => {

  fixtureID = props.navigation.getParam('id');
  homeTeam = fixture.homeTeam;
  awayTeam = fixture.awayTeam;

  return (

    <View flexDirection={'row'} style={{flex:props.headerFlex, justifyContent: 'space-around', paddingTop:10,}}>
      <View style={{flex:1, margin: 5}}>
        <Image
        style={{flex:2}}
        resizeMode={"contain"}
        source={{ uri: homeTeam.logo }}
        />
        <Text style={{flex:1, textAlign:'center'}}>{homeTeam.team_name}</Text>
      </View>

      <View style={{flex:1, margin: 5, alignItems:'center', justifyContent:'center'}}>
        <Text>{fixture.status}</Text>
      </View>

      <View style={{flex:1, margin: 5}}>
        <Image
        style={{flex:2}}
        resizeMode={"contain"}
        source={{ uri: awayTeam.logo}}
        />
        <Text style={{flex:1, textAlign:'center'}}>{awayTeam.team_name}</Text>
      </View>
    </View>
  );
};
