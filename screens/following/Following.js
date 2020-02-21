import React from 'react';
import { Button, TouchableHighlight, View, Text, Dimensions} from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import { SectionGrid } from 'react-native-super-grid';
import { MaterialIndicator,} from 'react-native-indicators'
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
import { scale, } from 'react-native-size-matters';
const itemWidth = (screenWidth/2.2);
const itemHeight = scale(screenHeight/6);

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

  function renderLeague(item) {
    league = props.leagues[item.item];
    return(
      <TouchableHighlight
        style={{
          width: itemWidth,
          height:itemHeight,
          borderWidth: 2,
          borderRadius: 5,
        }}
        onPress={ () => props.navigation.push('League', {id: item.item})}>
        <View style={{padding:10 , alignItems:'center',}}>
          <View style={{
            position: 'absolute',
            right: 0,
            top: 0,
          }}>
          <Icon
            size={10}
            reverse={true}
            name='remove'
            type='ion-icon'
            onPress={() => {
              props.removeLeague(item.item)
            }}
          />
          </View>
          <Avatar
              size = 'large'
              source={{ uri: `${league.logo}`}}
              rounded
          />
          <Text style={{textAlign:'center',}}>
              {league.name}
          </Text>
          </View>
      </TouchableHighlight>
    );
  }

  function renderTeam(item) {
    team = props.teams[item.item];
    return(
      <TouchableHighlight
        style={{
          width: itemWidth,
          height:itemHeight,
          borderWidth: 2,
          borderRadius: 5,
        }}
        onPress={ () => props.navigation.push('Team', {id: item.item})}>
        <View style={{padding:10 , alignItems:'center',}}>
          <View style={{
            position: 'absolute',
            right: 0,
            top: 0,
          }}>
          <Icon
            size={10}
            reverse={true}
            name='remove'
            type='ion-icon'
            onPress={() => {
              props.removeTeam(item.item)
            }}
          />
          </View>
          <Avatar
              size = 'large'
              source={{ uri: `${team.logo}`}}
              rounded
          />
          <Text style={{textAlign:'center',}}>
              {team.name}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  if(!props.teamIDs.length && !props.leagueIDs.length){
    return (
      <View style={{flex:1, alignItems:'center'}}>
        <Button title="Follow a League /n or Team"
          onPress={() => props.navigation.navigate('Search')}
        />
      </View>
    );
  }else{
    return(
      <View style={{flex:1}}>
          <SectionGrid
          itemDimension={itemWidth}
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
