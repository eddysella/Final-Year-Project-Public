import React, { useEffect, } from 'react';
import { ExpoConfigView } from '@expo/samples';
import {TouchableHighlight, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import {Card, Avatar} from 'react-native-elements';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import SquareGrid from "react-native-square-grid";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export const Main = props => {

  count = 0;
  count1 = 0;

  function renderLeague(item, index) {
    league = props.leagues[item];
      return (
          <View style={{borderWidth: 3, margin: 5, padding: 10, alignItems: 'center',  alignSelf: 'stretch'}}>
            <Avatar
                size = 'medium'
                source={{ uri: `${league.logo}`}}
                rounded
            />
            <Text h3>
                {league.name}
            </Text>
          </View>
      );
  }

  function renderTeam(item, index) {
    team = props.teams[item];
      return (
          <View style={{borderWidth: 3, margin: 5, padding: 10, alignItems: 'center',  alignSelf: 'stretch'}}>
            <Avatar
                size = 'medium'
                source={{ uri: `${team.logo}`}}
                rounded
            />
            <Text h3>
                {team.name}
            </Text>
          </View>
      );
  }

  if(props.teamStatus || props.leagueStatus){
    return (
      <View style={{flex:props.screenFlex}}>
        <ActivityIndicator size="large" color="#00ff00"/>
      </View>
    );
  }else if(!props.teamIDs.length && !props.leagueIDs.length){
    return (
      <View style={{flex:props.screenFlex}}>
      </View>
    );
  }else{
    return (
      <View style={{flex:props.screenFlex}}>
          <SquareGrid
              rows={0}
              columns={3}
              items={props.teamIDs}
              renderItem={renderTeam}
          />
          <SquareGrid
              rows={0}
              columns={3}
              items={props.leagueIDs}
              renderItem={renderLeague}
          />
      </View>
    );
  }
};
