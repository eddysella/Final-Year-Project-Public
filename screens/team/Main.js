import React, { Component, useState } from 'react';
import { ExpoConfigView } from '@expo/samples';
import { TouchableHighlight, SectionList, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import { Card, Avatar } from 'react-native-elements';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component'
import { MaterialIndicator,} from 'react-native-indicators';
import Fixtures from '../../containers/team/Fixtures'
const screenWidth = Math.round(Dimensions.get('window').width);
// const screenHeight = Math.round(Dimensions.get('window').height);
const itemWidth = screenWidth - scale(screenWidth/2);
// const itemHeight = scale(screenWidth/4);
// const itemHorizontalPadding = (itemWidth/5);
// const itemVerticalPadding = scale(15);

export const Main = props => {

  function ItemSeparator(){
    return (
      <View style={{height: scale(2), width: '100%', backgroundColor: "#000"}}/>
    );
  };

  const RenderTopBar = (item) => {
    team = item.item;
    fixturesBorder=0;
    leaguesBorder=0;
    playersBorder=0;
    if(currentTab == 0){
      fixturesBorder=2;
      leaguesBorder=0;
      playersBorder=0;
    }else if(currentTab == 1){
      fixturesBorder=0;
      leaguesBorder=2;
      playersBorder=0;
    }else if(currentTab == 2){
      fixturesBorder=0;
      leaguesBorder=0;
      playersBorder=2;
    }
    return (
      <View style={{flex:1}}>
        <View style={{flex:1, justifyContent: 'space-around'}}>
          <Text style={{textAlign:'center'}}>{team.name}</Text>
        </View>
        <View flexDirection={'row'} style={{flex:1, justifyContent: 'space-around'}}>
          <TouchableHighlight onPress={() => setTab(0)}
          style={{flex:1, borderBottomWidth:fixturesBorder}}>
          <Text style={{textAlign: 'center'}}>Fixtures</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => setTab(1)}
              style={{flex:1, alignItems: 'center', borderBottomWidth:leaguesBorder}}>
          <Text style={{textAlign:'center'}}>Leagues</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => setTab(2)}
          style={{flex:1, borderBottomWidth:playersBorder}}>
          <Text style={{textAlign: 'center'}}>Players</Text>
          </TouchableHighlight>
        </View>
      </View>

    );
  }

  function renderPlayersItem(playerID) {
    player = props.players[playerID.item];
    return (
      <TouchableHighlight onPress={ () =>{
            props.navigation.push('Player', {playerID: playerID.item, teamID:teamID});
        }}>
        <View flexDirection={'row'} style={{borderWidth: 2, margin: 5, padding: 10, alignItems: 'center',  alignSelf: 'stretch'}}>
          <Text h3>{player.name}</Text>
        </View>
      </TouchableHighlight>
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
      ItemSeparatorComponent={ItemSeparator}
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
        <Text>{title}</Text>
      )}
      />
    );
  }

  function renderLeaguesItem(leagueID) {
      league = props.leagues[leagueID.item];
      return (
        <TouchableHighlight onPress={ () =>{
              props.navigation.push('League', {id: leagueID.item});
          }}>
          <View flexDirection={'row'} style={{borderWidth: 2, margin: 5, padding: 10, alignItems: 'center',  alignSelf: 'stretch'}}>
            <Avatar
                size = 'medium'
                source={{ uri: `${league.logo}`}}
                rounded
            />
            <Text h3>{league.name}</Text>
          </View>
        </TouchableHighlight>
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
        ItemSeparatorComponent={ItemSeparator}
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
          <RenderTopBar item={team}/>
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
        <RenderTopBar item={team}/>
      </View>
      <View style={{flex:props.screenFlex}}>
        {bottomPage}
      </View>
    </View>
    );
  }
}
