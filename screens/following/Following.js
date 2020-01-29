import React, { useEffect, } from 'react';
import { ExpoConfigView } from '@expo/samples';
import { Button, TouchableHighlight, SectionList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import {Card, Avatar} from 'react-native-elements';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import SquareGrid from "react-native-square-grid";
import { MaterialIndicator,} from 'react-native-indicators'
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
    league = props.leagues[item.item];
    return(
      <TouchableHighlight style={{width:'33%'}} onPress={ () => props.navigation.push('League', {id: item.item})}>
        <RenderItem props={league}/>
      </TouchableHighlight>
    );
  }

  function renderTeam(item) {
    team = props.teams[item.item];
    return(
      <TouchableHighlight style={{width:'33%'}} onPress={ () => props.navigation.push('Team', {id: item.item})}>
        <RenderItem props={team}/>
      </TouchableHighlight>
    );
  }

  if(!props.teamIDs.length && !props.leagueIDs.length){
    return (
      <View style={{flex:props.screenFlex}}>
        <Button title="Follow a League /n or Team"
          onPress={() => props.navigation.navigate('Search')}
        />
      </View>
    );
  }else{
    return(
      <View style={{flex:1}}>
          <SectionList
          ItemSeparatorComponent={ItemSeparator}
          ref={(ref) => { this.leagueList = ref; }}
          sections={[{title: 'Leagues', data:props.leagueIDs, renderItem:renderLeague},
                      {title: 'Teams', data:props.teamIDs, renderItem:renderTeam}
                    ]}
          keyExtractor={(item,index) => item.toString()}
          renderSectionHeader={({ section: { title } }) => (
            <Text>{title}</Text>
          )}
          />
      </View>
    );
  }
};
