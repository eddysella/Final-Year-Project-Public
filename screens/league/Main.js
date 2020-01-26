import React, { Component, useEffect } from 'react';
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

  currentTab = 0;

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

  const RenderTopBar = (league) => {
    console.log(league)
    league = league.props;
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
            <View style={{flex:3, justifyContent: 'space-around'}}>
              <Text style={{flex:1, textAlign:'center'}}>{league.name}</Text>
            </View>
            <View flexDirection={'row'} style={{flex:1, justifyContent: 'space-around'}}>
                <TouchableHighlight onPress={() => props.setTab(0)}
                style={{flex:1, borderBottomWidth:fixturesBorder}}>
                <Text style={{textAlign: 'center'}}>Fixtures</Text>
                </TouchableHighlight>

                <TouchableHighlight onPress={() => props.setTab(1)}
                    style={{flex:1, alignItems: 'center', borderBottomWidth:teamsBorder}}>
                <Text style={{textAlign:'center'}}>Teams</Text>
                </TouchableHighlight>

                <TouchableHighlight onPress={() => props.setTab(2)}
                style={{flex:1, borderBottomWidth:standingsBorder}}>
                <Text style={{textAlign: 'center'}}>Standings</Text>
                </TouchableHighlight>
            </View>
        </View>
    );
  }

  const RenderStandings = (item) =>{
    standings = item.props;
      if(!standings.standingsInOrder){
        <View style={{flex:1}}>
          <MaterialIndicator/>
        </View>
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
    teamIDs = item.props;
      if(!teamIDs){
        <View style={{flex:1}}>
          <MaterialIndicator/>
        </View>
      }
      return (
        <View style={{flex:props.screenFlex}}>
            <FlatList
            ItemSeparatorComponent={ItemSeparator}
            ref={(ref) => { this.teamList = ref; }}
            data={teamIDs}
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
    fixtures = item.props;
      if(!fixtures){
        <View style={{flex:1}}>
          <MaterialIndicator/>
        </View>
      }
      // add date dropdown
      return (
        <View style={{flex:props.screenFlex}}>
            <FlatList
            ItemSeparatorComponent={ItemSeparator}
            ref={(ref) => { this.fixturesList = ref; }}
            data={fixtures}
            renderItem={renderFixturesItem}
            keyExtractor={(item,index) => index.toString()}
            />
        </View>
      );
  }

  function setTab(tab){
    currentTab = tab;
  }

  leagueID = JSON.stringify(props.navigation.getParam('id'));
  league = props.leaguesByID[leagueID];
  fetched = [0,0,0]
// add isFetching

  if(currentTab == 0){
    if(!fetched[0]){
      props.fetchFixtures(leagueID);
      fetched[0]=1
    }
    return (
      <View style={{flex:1}}>
        <RenderTopBar item={league}/>
        <RenderFixtures item={league.fixtures}/>
      </View>
    );
  }else if(currentTab == 1){
    if(!fetched[1]){
      props.fetchTeams(leagueID)
      fetched[1]=1
    }
    return(
      <View style={{flex:1}}>
        <RenderTopBar item={league}/>
        <RenderTeams item={league.teamIDs}/>
      </View>
    );
  }else if(currentTab == 2){
    if(!fetched[2]){
      props.fetchStandings(leagueID)
      fetched[2]=1
    }
    return(
      <View style={{flex:1}}>
        <RenderTopBar item={league}/>
        <RenderStandings item={props.standings}/>
      </View>
    );
  }
};
