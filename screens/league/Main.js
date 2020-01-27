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
    league = item.item;
    fixturesBorder=0;
    teamsBorder=0;
    standingsBorder=0;
    if(currentTab == 0){
        fixturesBorder=2;
        teamsBorder=0;
        standingsBorder=0;
    }else if(currentTab == 1){
        fixturesBorder=0;
        teamsBorder=2;
        standingsBorder=0;
    }else if(currentTab == 2){
        fixturesBorder=0;
        teamsBorder=0;
        standingsBorder=2;
    }
    return (
        <View style={{flex:props.TopBarFlex}}>
            <View style={{flex:1, justifyContent: 'space-around'}}>
              <Text style={{flex:1, textAlign:'center'}}>{league.name}</Text>
            </View>
            <View flexDirection={'row'} style={{flex:1, justifyContent: 'space-around'}}>
                <TouchableHighlight onPress={() => setTab(0)}
                style={{flex:1, borderBottomWidth:fixturesBorder}}>
                <Text style={{textAlign: 'center'}}>Fixtures</Text>
                </TouchableHighlight>

                <TouchableHighlight onPress={() => setTab(1)}
                    style={{flex:1, alignItems: 'center', borderBottomWidth:teamsBorder}}>
                <Text style={{textAlign:'center'}}>Teams</Text>
                </TouchableHighlight>

                <TouchableHighlight onPress={() => setTab(2)}
                style={{flex:1, borderBottomWidth:standingsBorder}}>
                <Text style={{textAlign: 'center'}}>Standings</Text>
                </TouchableHighlight>
            </View>
        </View>
    );
  }

  const RenderStandings = (item) =>{
    standings = item.item;
      if(standings.isFetching){
        return(
          <View style={{flex:props.ScreenFlex}}>
            <MaterialIndicator/>
          </View>
        );
      }else if(!standings.standingsInOrder){
        return(
          <View style={{flex:props.ScreenFlex}}>
            <Text style={{flex:1, alignSelf: 'center',  textAlign:'center'}}>No Standings Available</Text>
          </View>
        );
      }
      return (
          <View style={{flex:props.ScreenFlex}}>
            <Table borderStyle={{borderWidth: 2}}>
              <Row data={standings.titles}/>
              <Rows data={standings.standingsInOrder}/>
            </Table>
          </View>
      );
  }

  function renderTeamsItem(teamID) {
      team = teams[teamID.item];
      return (
          <TouchableHighlight onPress={ () =>{
                props.navigation.navigate('Team', {id: teamID});
            }}>
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
          </TouchableHighlight>
          );
  };

  const RenderTeams = (item) => {
    league = item.item;
      if(league.fetchingTeams){
        return(
          <View style={{flex:props.ScreenFlex}}>
            <MaterialIndicator/>
          </View>
        );
      }else if(!league.teamIDs){
        return(
          <View style={{flex:props.ScreenFlex}}>
            <Text style={{flex:1, alignSelf: 'center',  textAlign:'center'}}>No Teams Available</Text>
          </View>
        );
      }
      return (
        <View style={{flex:props.ScreenFlex}}>
            <FlatList
            ItemSeparatorComponent={ItemSeparator}
            ref={(ref) => { this.teamList = ref; }}
            data={league.teamIDs}
            renderItem={renderTeamsItem}
            keyExtractor={(item,index) => index.toString()}
            />
        </View>
      );
  }

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
    league = item.item;
      if(league.fetchingFixtures){
        return(
          <View style={{flex:props.ScreenFlex}}>
            <MaterialIndicator/>
          </View>
        );
      }else if(!league.fixtures){
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
            data={league.fixtures}
            renderItem={renderFixturesItem}
            keyExtractor={(item,index) => index.toString()}
            />
        </View>
      );
  }

  leagueID = JSON.stringify(props.navigation.getParam('id'));
  league = props.leagues[leagueID];
  [currentTab, setTab] = useState(0);
  [fixturesFetched, setFixturesFetched] = useState(false);
  [teamsFetched, setTeamsFetched] = useState(false);
  [standingsFetched, setStandingsFetched] = useState(false);

  if(currentTab == 0){
    if(!fixturesFetched){
      props.fetchFixtures(leagueID);
      setFixturesFetched(true);
    }
    return (
      <View style={{flex:1}}>
        <RenderTopBar item={league}/>
        <RenderFixtures item={league}/>
      </View>
    );
  }else if(currentTab == 1){
    if(!teamsFetched){
      props.fetchTeams(leagueID)
      setTeamsFetched(true);
    }
    return(
      <View style={{flex:1}}>
        <RenderTopBar item={league}/>
        <RenderTeams item={league}/>
      </View>
    );
  }else if(currentTab == 2){
    if(!standingsFetched){
      props.fetchStandings(leagueID)
      setStandingsFetched(true);
    }
    return(
      <View style={{flex:1}}>
        <RenderTopBar item={league}/>
        <RenderStandings item={props.standings}/>
      </View>
    );
  }
};
