import React, { useEffect, } from 'react';
import { ExpoConfigView } from '@expo/samples';
import {TouchableHighlight, SectionList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import {Card, Avatar} from 'react-native-elements';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import SquareGrid from "react-native-square-grid";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export const Main = props => {

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

count = 0
  function renderLeague(item, index) {
    if(count == 0){
    console.log(item)
    count++;
    }

    league = props.leagues[item.item];
      return (
          <View flexDirection={'row'} style={{borderWidth: 2, margin: 5, padding: 10, alignItems: 'center',  alignSelf: 'stretch'}}>
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
    team = props.teams[item.item];
      return (
          <View flexDirection={'row'} style={{borderWidth: 2, margin: 5, padding: 10, alignItems: 'center',  alignSelf: 'stretch'}}>
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
    return(
      <View style={{flex:props.screenFlex}}>
          <SectionList
          ItemSeparatorComponent={ItemSeparator}
          // showsVerticalScrollIndicator={false}
          // initialScrollIndex={4}
          ref={(ref) => { this.leagueList = ref; }}
          sections={[{title: 'Leagues', data:props.leagueIDs}]}
          renderItem={renderLeague}
          keyExtractor={(item,index) => index.toString()}
          initialNumToRender={10}
          renderSectionHeader={({ section: { title } }) => (
            <Text>{title}</Text>
          )}
          />
          <SectionList
          ItemSeparatorComponent={ItemSeparator}
          // showsVerticalScrollIndicator={false}
          // initialScrollIndex={4}
          ref={(ref) => { this.leagueList = ref; }}
          sections={[{title: 'Teams', data:props.teamIDs}]}
          renderItem={renderTeam}
          keyExtractor={(item,index) => index.toString()}
          renderSectionHeader={({ section: { title } }) => (
            <Text>{title}</Text>
          )}
          />
      </View>
    );
  }
};
