import React, { Component, useState } from 'react';
import { ExpoConfigView } from '@expo/samples';
import { TouchableHighlight, SectionList, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import { Card, Avatar } from 'react-native-elements';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component'
import { MaterialIndicator,} from 'react-native-indicators';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const itemWidth = screenWidth - scale(screenWidth/2);
const itemHeight = scale(screenWidth/4);
const itemHorizontalPadding = (itemWidth/5);
const itemVerticalPadding = scale(15);

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
      <View>
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
            props.navigation.push('Player', {id: playerID.item});
        }}>
        <View flexDirection={'row'} style={{borderWidth: 2, margin: 5, padding: 10, alignItems: 'center',  alignSelf: 'stretch'}}>
          <Text h3>{player.position}{player.name}</Text>
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
        <FlatList
        ItemSeparatorComponent={ItemSeparator}
        ref={(ref) => { this.teamList = ref; }}
        data={playerIDs}
        renderItem={renderPlayersItem}
        keyExtractor={(item,index) => index.toString()}
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

// need to fix this !?!?!?!?!?!
  function renderFixturesItem(fixture) {
      fixture = fixture.item;
      status = fixture.status;
      outcome = '';
      if(fixture.goalsHome > fixture.goalsAway){
        outcome = 'W';
      }else if(fixture.goalsHome < fixture.goalsAway){
        outcome = 'L';
      }else if(fixture.goalsHome == fixture.goalsAway){
        outcome = 'D';
      }else if(fixture.statusShort == 'NS'){
        outcome = 'NS';
      }
      date = new Date(fixture.timeStamp).toLocaleDateString();
      return (
        <TouchableHighlight onPress={ () =>{
              props.navigation.push('Fixture', {id: fixture.fixtureID});
          }}>
          <View  width={itemWidth} flexDirection={'row'} style={{ justifyContent: 'space-around'}}>
            <Text style={{flex:1,   textAlign:'center'}}>{fixture.homeTeam.team_name}</Text>
            <Text style={{flex:1,   textAlign:'center'}}>{status}</Text>
            <Text style={{flex:1,   textAlign:'center'}}>{fixture.awayTeam.team_name}</Text>
            <Text style={{flex:1,   textAlign:'center'}}>{date}</Text>
            <Text style={{flex:1,   textAlign:'center'}}>{outcome}</Text>
          </View>
        </TouchableHighlight>
        );
  };

  const RenderFixtures = (item) => {
    team = item.item;
    if(!team.pastFixtures){
        return(
          <Text style={{flex:1, alignSelf: 'center',  textAlign:'center'}}>No Fixtures Available</Text>
        );
      }
      return (
        <FlatList
          ItemSeparatorComponent={ItemSeparator}
          ref={(ref) => { this.fixturesList = ref; }}
          data={team.pastFixtures}
          renderItem={renderFixturesItem}
          keyExtractor={(item,index) => index.toString()}
          />
      );
  }

  teamID = JSON.stringify(props.navigation.getParam('id'));
  team = props.teams[teamID];
  [currentTab, setTab] = useState(0);
  [fixturesFetched, setFixturesFetched] = useState(false);
  [leaguesFetched, setLeaguesFetched] = useState(false);
  [playersFetched, setPlayersFetched] = useState(false);

  if(props.fetching){
    return(
      <View>
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
        props.fetchPastFixtures(teamID);
        setFixturesFetched(true);
        bottomPage = <RenderFixtures item={team}/>;
        break;
      case 1:
        props.fetchLeagues(teamID)
        setLeaguesFetched(true);
        bottomPage = <RenderLeagues item={team.leagueIDs}/>;
        break;
      case 2:
        props.fetchPlayers(teamID)
        setPlayersFetched(true);
        bottomPage = <RenderPlayers item={team.playerIDs}/>;
        break;
    }
      return (
      <View>
        <View style={{flex:props.topBarFlex}}>
          <RenderTopBar item={team}/>
        </View>
        <View style={{flex:props.screenFlex}}>
          <RenderPlayers item={team.playerIDs}/>
        </View>
      </View>
      );
  }
}
