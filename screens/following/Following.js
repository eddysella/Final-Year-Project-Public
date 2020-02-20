import React from 'react';
import { Button, TouchableHighlight, SectionList, View, Text,} from 'react-native';
import {Avatar} from 'react-native-elements';
import SquareGrid from "react-native-square-grid";
import { MaterialIndicator,} from 'react-native-indicators'

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
