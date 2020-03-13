import React, { Component} from 'react';
import {Image, View, Text,} from 'react-native';

export const Header = props => {

  fixtureID = props.navigation.getParam('id');
  fixture = props.fixturesByID[fixtureID];
  homeTeam = fixture.homeTeam;
  awayTeam = fixture.awayTeam;

  return (

    <View flexDirection={'row'} style={{flex:props.headerFlex, justifyContent: 'space-around', paddingTop:10, paddingHorizontal:10}}>
      <View style={{flex:2, margin: 5}}>
        <Image
        style={{flex:2}}
        resizeMode={"contain"}
        source={{ uri: homeTeam.logo }}
        />
        <Text style={{flex:1, textAlign:'center', fontSize:20, padding:10}}>{homeTeam.team_name}</Text>
      </View>

      <View style={{flex:1, margin: 5, alignItems:'center', justifyContent:'center'}}>
        <Text style={{fontSize:20}}>{fixture.status}</Text>
      </View>

      <View style={{flex:2, margin: 5}}>
        <Image
        style={{flex:2}}
        resizeMode={"contain"}
        source={{ uri: awayTeam.logo}}
        />
        <Text style={{flex:1, textAlign:'center', fontSize:20, padding:10}}>{awayTeam.team_name}</Text>
      </View>
    </View>
  );
};
