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

  const RenderItem = (props) => {
    return (
        <View flexDirection={'row'} style={{borderWidth: 2, margin: 5, padding: 10, alignItems: 'center',  alignSelf: 'stretch'}}>
          <Avatar
              size = 'medium'
              source={{ uri: `${props.props.logo}`}}
              rounded
          />
          <Text h3>
              {props.props.name}
          </Text>
        </View>
    );
  }

  function renderLeague(item) {
    leagueID = item.item;
    league = props.leagues[leagueID];
    return(
      <TouchableHighlight onPress={ leagueID => props.navigation.navigate('League', {id: leagueID});}>
          <RenderItem props={league}/>
        </TouchableHighlight>
    );
  }

  function renderTeam(item) {
    teamID = item.item;
    team = props.teams[teamID];
    return(
      <TouchableHighlight onPress={ teamID => props.navigation.navigate('Team', {id: teamID});}>
          <RenderItem props={team}/>
        </TouchableHighlight>
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
          ref={(ref) => { this.leagueList = ref; }}
          sections={[{title: 'Leagues', data:props.leagueIDs, renderItem:renderLeague},
                      {title: 'Teams', data:props.teamIDs, renderItem:renderTeam}
                    ]}
          keyExtractor={(item,index) => index.toString()}
          renderSectionHeader={({ section: { title } }) => (
            <Text>{title}</Text>
          )}
          />
      </View>
    );
  }
};
