import React, { Component, useState } from 'react';
import { ExpoConfigView } from '@expo/samples';
import {TouchableHighlight, SectionList, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import {Card} from 'react-native-elements';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component'
import { MaterialIndicator,} from 'react-native-indicators';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const itemWidth = screenWidth - scale(screenWidth/5);
const itemHeight = scale(screenWidth/4);
const itemHorizontalPadding = (itemWidth/5);
const itemVerticalPadding = scale(15);

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
        <View style={{flex:props.TopBarFlex}}>
            <View style={{flex:1, justifyContent: 'space-around'}}>
              <Text style={{flex:1, textAlign:'center'}}>{team.name}</Text>
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
    player = playerStats[playerID.item];
    if(player.captain){
      position = <Text h3>  {player.position}  Captain</Text>;
    } else {
      position = <Text h3>  {player.position}  </Text>
    }
    return (
        <TouchableHighlight onPress={ () =>{
              props.navigation.navigate('Player', {id: playerID.item});
          }}>
          <View flexDirection={'row'} style={{borderWidth: 2, margin: 5, padding: 10, alignItems: 'center',  alignSelf: 'stretch'}}>
          <Text h3>
              {player.name}
          </Text>
          <Text h3>
              {position}
          </Text>
          </View>
        </TouchableHighlight>
        );
  };

  const RenderPlayers = (item) =>{
    playerIDs = item.item;
      if(!playerIDs or playerIDs == null){
        return(
          <View style={{flex:props.ScreenFlex}}>
            <Text style={{flex:1, alignSelf: 'center',  textAlign:'center'}}>No Players Available</Text>
          </View>
        );
      }
      return (
        <View style={{flex:props.ScreenFlex}}>
            <FlatList
            ItemSeparatorComponent={ItemSeparator}
            ref={(ref) => { this.teamList = ref; }}
            data={playerIDs}
            renderItem={renderPlayersItem}
            keyExtractor={(item,index) => index.toString()}
            />
        </View>
      );
  }

  function renderLeaguesItem(leagueID) {
      league = leagues[leagueID.item];
      return (
          <TouchableHighlight onPress={ () =>{
                props.navigation.navigate('League', {id: leagueID.item});
            }}>
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
          </TouchableHighlight>
          );
  };

  const RenderLeagues = (item) => {
    leagueIDs = item.item;
      if(!leagueIDs or leagueIDs == null){
        return(
          <View style={{flex:props.ScreenFlex}}>
            <Text style={{flex:1, alignSelf: 'center',  textAlign:'center'}}>No Leagues Available</Text>
          </View>
        );
      }
      return (
        <View style={{flex:props.ScreenFlex}}>
            <FlatList
            ItemSeparatorComponent={ItemSeparator}
            ref={(ref) => { this.teamList = ref; }}
            data={leagueIDs}
            renderItem={renderLeaguesItem}
            keyExtractor={(item,index) => index.toString()}
            />
        </View>
      );
  }

// need to fix this !?!?!?!?!?!
  function renderFixturesItem(fixture) {
      fixture = fixture.item;
      status = fixture.status;
      return (
          <TouchableHighlight onPress={ () =>{
                props.navigation.navigate('Fixture', {id: fixture.fixtureID});
            }}>
            <View  width={itemWidth} flexDirection={'row'} style={{ justifyContent: 'space-around'}}>
              <Text style={{flex:1,   textAlign:'center'}}>{fixture.homeTeam.team_name}</Text>
              <Text style={{flex:1, alignSelf: 'center',  textAlign:'center'}}>{status}</Text>
              <Text style={{flex:1,   textAlign:'center'}}>{fixture.awayTeam.team_name}</Text>
            </View>
          </TouchableHighlight>
          );
  };

  const RenderFixtures = (item) => {
    team = item.item;
    if(!team.fixtures){
        return(
          <View style={{flex:props.ScreenFlex}}>
            <Text style={{flex:1, alignSelf: 'center',  textAlign:'center'}}>No Fixtures Available</Text>
          </View>
        );
      }
      return (
        <View style={{flex:props.ScreenFlex}}>
            <FlatList
            ItemSeparatorComponent={ItemSeparator}
            ref={(ref) => { this.fixturesList = ref; }}
            data={team.fixtures}
            renderItem={renderFixturesItem}
            keyExtractor={(item,index) => index.toString()}
            />
        </View>
      );
  }

  teamID = JSON.stringify(props.navigation.getParam('id'));
  team = props.teams[teamID];
  [currentTab, setTab] = useState(0);
  [fixturesFetched, setFixturesFetched] = useState(false);
  [leaguesFetched, setLeaguesFetched] = useState(false);
  [playersFetched, setPlayersFetched] = useState(false);

  if(team.fetchingLeagues || team.fetchingPastFixtures
    || team.fetchingFutureFixtures || team.isFetching){
    return(
      <View style={{flex:1}}>
        <RenderTopBar item={team}/>
        <View style={{flex:props.ScreenFlex}}>
          <MaterialIndicator/>
        </View>
      </View>
    );
  }else if(currentTab == 0){
    if(!fixturesFetched){
      props.fetchPastFixtures(teamID);
      setFixturesFetched(true);
    }
    return (
      <View style={{flex:1}}>
        <RenderTopBar item={team}/>
        <RenderFixtures item={team}/>
      </View>
    );
  }else if(currentTab == 1){
    if(!teamsFetched){
      props.fetchLeagues(leagueID)
      setLeaguesFetched(true);
    }
    return(
      <View style={{flex:1}}>
        <RenderTopBar item={team}/>
        <RenderLeagues item={team.leagueIDs}/>
      </View>
    );
  }else if(currentTab == 2){
    if(!standingsFetched){
      props.fetchPlayers(leagueID)
      setPlayersFetched(true);
    }
    return(
      <View style={{flex:1}}>
        <RenderTopBar item={team}/>
        <RenderPlayers item={team.playerIDs}/>
      </View>
    );
  }
};
