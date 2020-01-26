import React, { Component, useEffect } from 'react';
import { ExpoConfigView } from '@expo/samples';
import {TouchableHighlight, SectionList, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import {Card} from 'react-native-elements';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component'

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const itemWidth = screenWidth - scale(screenWidth/5);
const itemHeight = scale(screenWidth/4);
const itemHorizontalPadding = (itemWidth/5);
const itemVerticalPadding = scale(15);

export const Main = props => {

  useEffect(() => {
    switch(currentTab){
      case '0':
        props.fetchFixtures(leagueID)
        break;
      case '1':
        props.fetchTeams(leagueID)
        break;
      case '2':
        props.fetchStandings(leagueID)
        break;
    }
  })

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

  const RenderTopBar = (props) => {
    league = props.props;
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

  const RenderStandings = (props) =>{
    standings = props.props;
      if(!standings.standingsInOrder){
        <View style={{flex:1}}>
          <ActivityIndicator/>
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
                props.navigation.navigate('');
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

  const RenderTeams = (props) => {
    teamIDs = props.props;
      if(!teamIDs){
        <View style={{flex:1}}>
          <ActivityIndicator/>
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
                props.navigation.navigate('');
            }}>
            <View  width={itemWidth} flexDirection={'row'} style={{ justifyContent: 'space-around'}}>
              <Text style={{flex:1,   textAlign:'center'}}>{fixture.homeTeam.team_name}</Text>
              <Text style={{flex:1, alignSelf: 'center',  textAlign:'center'}}>{status}</Text>
              <Text style={{flex:1,   textAlign:'center'}}>{fixture.awayTeam.team_name}</Text>
            </View>
          </TouchableHighlight>
          );
  };

  const RenderFixtures = (props) => {
    fixtures = props.props;
      if(!fixtures){
        <View style={{flex:1}}>
          <ActivityIndicator/>
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

  leagueID = props.navigation.getParam('id');
  league = props.leaguesByID[leagueID];
  currentTab = 0

  setTab(tab){
    currentTab = tab;
  }

  if(currentTab == 0){
      return (
        <View style={{flex:1}}>
          <RenderTopBar props={league}/>
          <RenderFixtures props={league.fixtures}/>
        </View>
      );
  }else if(currentTab == 1){
    return(
      <View style={{flex:1}}>
        <RenderTopBar props={league}/>
        <RenderTeams props={league.teamIDs}/>
      </View>
    );
  }else if(currentTab == 2){
    return(
      <View style={{flex:1}}>
        <RenderTopBar props={league}/>
        <RenderStandings props={props.standings}/>
      </View>
    );
  }
};
