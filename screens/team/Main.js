import React, { Component, useState } from 'react';
import { TouchableHighlight, SectionList, FlatList, View, Text,} from 'react-native';
import { Avatar, Button, ButtonGroup } from 'react-native-elements';
import { scale,} from 'react-native-size-matters';
import { MaterialIndicator,} from 'react-native-indicators';
import Fixtures from '../../containers/team/Fixtures'
import { mainColor } from '../styles/root'

export const Main = props => {

  function ItemSeparator(){
    return (
      <View style={{height: scale(2), width: '100%', backgroundColor: "#000"}}/>
    );
  };

  const buttons = ['Fixtures', 'Leagues', 'Players']
    const RenderTopBar = () => {
        return (
          <ButtonGroup
          onPress={setTab}
          selectedIndex={currentTab}
          buttons={buttons}
          containerStyle={{flex:1}}
          selectedButtonStyle={{borderBottomWidth:2, borderColor:mainColor, backgroundColor:'white'}}
          textStyle={{color:'black'}}
          selectedTextStyle={{color:'black'}}
          />
      );
    }

  function renderPlayersItem(item) {
    player = props.players[item.item];
    return (
        <Button
        raised
        containerStyle={{marginVertical: 5, marginHorizontal:20}}
        buttonStyle={{borderColor:'#0f0f0f'}}
        titleStyle={{color:'#0f0f0f'}}
        title = {player.name}
        type='outline'
        onPress={ () =>{
              props.navigation.push('Player', {playerID: item.item, teamID:teamID, name: props.players[item.item].name});
          }}>
        </Button>
      );
  };

  const RenderPlayers = (item) =>{
    playerIDs = item.item;
    if(!playerIDs || playerIDs == null){
      return(
        <Text style={{alignSelf: 'center',  textAlign:'center'}}>No Players Available</Text>
      );
    }
    return (
      <SectionList
      ref={(ref) => { this.leagueList = ref; }}
      sections={[
        {title: 'Attackers', data:playerIDs['Attacker']},
        {title: 'Midfielders', data:playerIDs['Midfielder']},
        {title: 'Defenders', data:playerIDs['Defender']},
        {title: 'Goalkeepers', data:playerIDs['Goalkeeper']},
      ]}
      renderItem={renderPlayersItem}
      keyExtractor={(item,index) => item.toString()}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={{alignSelf: 'center', fontSize:18, padding:10}}>{title}</Text>
      )}
      />
    );
  }

  function renderLeaguesItem(item) {
      league = props.leagues[item.item];
      name = "    " + props.leagues[item.item].name
      return (
        <Button
        raised
        containerStyle={{marginVertical: 5, marginHorizontal:20}}
        buttonStyle={{borderColor:'#0f0f0f'}}
        titleStyle={{color:'#0f0f0f'}}
        title = {name}
        icon = {
          <Avatar
              size = 'medium'
              source={{ uri: `${league.logo}`}}
              rounded
          />
        }
        type='outline'
        onPress={ () =>{
              props.navigation.push('League', {id: item.item});
          }}>
        </Button>
        );
  };

  const RenderLeagues = (item) => {
    leagueIDs = item.item;
      if(!leagueIDs || leagueIDs == null){
        return(
          <Text style={{alignSelf: 'center',  textAlign:'center'}}>No Leagues Available</Text>
        );
      }
      return (
        <FlatList
        ref={(ref) => { this.teamList = ref; }}
        data={leagueIDs}
        renderItem={renderLeaguesItem}
        keyExtractor={(item,index) => index.toString()}
        />
      );
  }

  teamID = props.navigation.getParam('id');
  team = props.teams[teamID];
  const [currentTab, setTab] = useState(0);
  const [leaguesFetched, setLeaguesFetched] = useState(false);
  const [playersFetched, setPlayersFetched] = useState(false);
  props.initFixtures(teamID);
  if(!leaguesFetched){
    props.fetchLeagues(teamID)
    setLeaguesFetched(true);
  }

  if(props.fetching){
    return(
      <View style={{flex:1}}>
        <View style={{flex:props.topBarFlex}}>
          <RenderTopBar/>
        </View>
        <View style={{flex:props.screenFlex}}>
          <MaterialIndicator/>
        </View>
      </View>
    );
  }else{
    bottomPage = null;
    switch(currentTab){
      case 0:
        bottomPage = <Fixtures teamID={teamID} navigation={props.navigation}/>;
        break;
      case 1:
        bottomPage = <RenderLeagues item={team.leagueIDs}/>;
        break;
      case 2:
        if(!playersFetched){
          props.fetchPlayers(teamID)
          setPlayersFetched(true);
        }
        bottomPage = <RenderPlayers item={team.playerIDs}/>;
        break;
    }
    return (
    <View style={{flex:1}}>
      <View style={{flex:props.topBarFlex}}>
        <RenderTopBar/>
      </View>
      <View style={{flex:props.screenFlex}}>
        {bottomPage}
      </View>
    </View>
    );
  }
}
