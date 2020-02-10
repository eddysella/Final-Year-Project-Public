import React, { Component, useState } from 'react';
import { ExpoConfigView } from '@expo/samples';
import { TouchableHighlight, FlatList, View, Text, Dimensions } from 'react-native';
import { Card, Avatar} from 'react-native-elements';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { MaterialIndicator,} from 'react-native-indicators';
import { Switcher, SegmentedControlButton } from 'nachos-ui'
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const itemWidth = scale(screenWidth/2);
const itemHeight = scale(screenWidth/4);
const itemHorizontalPadding = (itemWidth/5);
const itemVerticalPadding = scale(15);

export const Main = props => {

  function ItemSeparator(){
    return (
      <View style={{
        height: scale(2),
        width: '100%',
        backgroundColor: "#000",
      }}/>
    );
  };

  function VItemSeparator(){
    return (
      <View style={{
        width: scale(2),
        height: '100%',
        backgroundColor: "#000",
      }}/>
    );
  };

  const RenderTopBar = (item) => {
    league = item.item;
    teamsBorder=0;
    standingsBorder=0;
    if(currentTab == 0){
      teamsBorder=2;
      standingsBorder=0;
    }else if(currentTab == 1){
      teamsBorder=0;
      standingsBorder=2;
    }
    return (
      <View style={{flex:1}}>
        <View style={{flex:1, justifyContent: 'space-around'}}>
          <Text style={{flex:1, textAlign:'center'}}>{league.name}</Text>
        </View>
        <View flexDirection={'row'} style={{flex:1, justifyContent: 'space-around'}}>
          <TouchableHighlight onPress={() => setTab(0)}
          style={{flex:1, alignItems: 'center', borderBottomWidth:teamsBorder}}>
          <Text style={{textAlign:'center'}}>Teams</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => setTab(1)}
          style={{flex:1, borderBottomWidth:standingsBorder}}>
          <Text style={{textAlign: 'center'}}>Standings</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  function renderStandingsItem(standing) {
    team = standing.item
    return (
      <View
      flexDirection={'row'}
      style={{maxWidth:screenWidth, flex: 1, margin: 5, padding: 10}}>
        <Text h3>{team[0]}</Text>
        <Avatar
          size = 'small'
          source={{ uri: `${team[1]}`}}
          rounded
        />
        <Text h3>{team[2]} </Text>
        <View style={{width:itemWidth, flexDirection:'row', justifyContent: 'flex-end'}}>
          <VItemSeparator/>
          <Text h3>{team[3]} </Text>
          <VItemSeparator/>
          <Text h3>{team[4]} </Text>
          <VItemSeparator/>
          <Text h3>{team[5]} </Text>
          <VItemSeparator/>
          <Text h3>{team[6]} </Text>
          <VItemSeparator/>
        </View>
      </View>
    );
  };

  const RenderStandings = (item) =>{
    standings = item.item;
    if(!standings.tableData){
      return(
        <Text style={{alignSelf: 'center',  textAlign:'center'}}>
          No Standings Available
        </Text>
      );
    }
    return (
      <View style={{maxWidth:screenWidth}}>
        <Text>{standings.titles[0]} </Text>
        <View style={{width:itemWidth, flexDirection:'row', justifyContent: 'flex-end'}}>
          <VItemSeparator/>
          <Text h3>{standings.titles[3]} </Text>
          <VItemSeparator/>
          <Text h3>{standings.titles[4]} </Text>
          <VItemSeparator/>
          <Text h3>{standings.titles[5]} </Text>
          <VItemSeparator/>
          <Text h3>{standings.titles[6]} </Text>
          <VItemSeparator/>
        </View>
        <FlatList
        ItemSeparatorComponent={ItemSeparator}
        ref={(ref) => { this.teamList = ref; }}
        data={standings.tableData}
        renderItem={renderStandingsItem}
        keyExtractor={(item,index) => index.toString()}
        />
      </View>
    );
  }

  function renderTeamsItem(teamID) {
    team = props.teams[teamID.item];
    return (
      <TouchableHighlight onPress={ () =>{
            props.navigation.push('Team', {id: teamID.item});
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
    if(!league.teamIDs){
      return(
        <Text style={{alignSelf: 'center',  textAlign:'center'}}>No Teams Available</Text>
      );
    }
    return (
      <FlatList
      ItemSeparatorComponent={ItemSeparator}
      ref={(ref) => { this.teamList = ref; }}
      data={league.teamIDs}
      renderItem={renderTeamsItem}
      keyExtractor={(item,index) => index.toString()}
      />
    );
  }

  leagueID = JSON.stringify(props.navigation.getParam('id'));
  league = props.leagues[leagueID];
  const [currentTab, setTab] = useState(0);
  const [teamsFetched, setTeamsFetched] = useState(false);
  const [standingsFetched, setStandingsFetched] = useState(false);

  if(props.fetchingExtraLeagueData || props.fetchingStandings){
    return(
      <View style={{flex:1}}>
        <View style={{flex:props.topBarFlex}}>
          <RenderTopBar item={league}/>
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
          if(!teamsFetched){
            props.fetchTeams(leagueID)
            setTeamsFetched(true);
          }
          bottomPage = <RenderTeams item={league}/>
          break;
        case 1:
          if(!standingsFetched){
            props.fetchStandings(leagueID)
            setStandingsFetched(true);
          }
          bottomPage = <RenderStandings item={props.standings}/>
          break;
      }
      return (
        <View style={{flex:1}}>
          <View style={{flex:props.topBarFlex}}>
            <RenderTopBar item={league}/>
          </View>
          <View style={{flex:props.screenFlex}}>
            {bottomPage}
          </View>
        </View>
      );
    }
  }


  //
  // [fixturesFetched, setFixturesFetched] = useState(false);
  //
  // function renderFixturesItem(fixture) {
  //     fixture = fixture.item;
  //     status = fixture.status;
  //     return (
  //         <TouchableHighlight onPress={ () =>{
  //               props.navigation.navigate('Fixture', {id: fixture.fixtureID});
  //           }}>
  //           <View  width={itemWidth} flexDirection={'row'} style={{ justifyContent: 'space-around'}}>
  //             <Text style={{flex:1,   textAlign:'center'}}>{fixture.homeTeam.team_name}</Text>
  //             <Text style={{flex:1, alignSelf: 'center',  textAlign:'center'}}>{status}</Text>
  //             <Text style={{flex:1,   textAlign:'center'}}>{fixture.awayTeam.team_name}</Text>
  //           </View>
  //         </TouchableHighlight>
  //         );
  // };
  //
  // const RenderFixtures = (item) => {
  //   league = item.item;
  //   if(!league.fixtures){
  //       return(
  //         <View style={{flex:props.ScreenFlex}}>
  //           <Text style={{flex:1, alignSelf: 'center',  textAlign:'center'}}>No Fixtures Available</Text>
  //         </View>
  //       );
  //     }
  //     return (
  //       <View style={{flex:props.ScreenFlex}}>
  //           <FlatList
  //           ItemSeparatorComponent={ItemSeparator}
  //           ref={(ref) => { this.fixturesList = ref; }}
  //           data={league.fixtures}
  //           renderItem={renderFixturesItem}
  //           keyExtractor={(item,index) => index.toString()}
  //           />
  //       </View>
  //     );
  // }
