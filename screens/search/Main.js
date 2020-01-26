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

  function renderItem(item){
    return (
        <View flexDirection={'row'} style={{borderWidth: 2, margin: 5, padding: 10, alignItems: 'center',  alignSelf: 'stretch'}}>
          <Avatar
              size = 'medium'
              source={{ uri: `${item.logo}`}}
              rounded
          />
          <Text h3>
              {item.name}
          </Text>
        </View>
    );
  }

  function renderLeague(item) {
    league = props.leagues[item.item];
    return renderItem(league);
  }

  function renderTeam(item, index) {
    team = props.teams[item.item];
    return renderItem(team);
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
          ref={(ref) => { this.leagueList = ref; }}
          sections={[{title: 'Leagues', data:props.leagueIDs, renderItem:renderLeague},
                      {title: 'Teams', data:props.teamIDs, renderItem:renderTeam}
                    ]}
          keyExtractor={(item,index) => item.name + index}
          renderSectionHeader={({ section: { title } }) => (
            <Text>{title}</Text>
          )}
          />
      </View>
    );
  }
};
