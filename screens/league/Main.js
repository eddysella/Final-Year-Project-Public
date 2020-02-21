import React, { Component, useState } from 'react';
import { TouchableHighlight, FlatList, View, Text, Dimensions } from 'react-native';
import { Avatar} from 'react-native-elements';
import { scale, } from 'react-native-size-matters';
import { MaterialIndicator,} from 'react-native-indicators';
import Fixtures from '../../containers/league/Fixtures'
const screenWidth = Math.round(Dimensions.get('window').width);
const itemWidth = scale(screenWidth/10); // screen / 2 / 4 sections

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
      <View style={{flex:1}}>
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

  const StandingsHeader = () =>{
    titles = [
      "Rank",
      " ",
      " ",
      "Games",
      "S/C",
      "GoalD",
      "Points"
    ];
    return (
      <View style={{flexDirection:'row', margin: 10}}>
        <View style={{flex: 1}}>
          <Text style={{alignSelf: 'flex-start', marginLeft:5}}>{titles[0]} </Text>
        </View>
        <View style={{flex: 1, flexDirection:'row',}}>
          <View style={{width: itemWidth}}>
            <Text h3 style={{textAlign:'center'}}>{titles[3]} </Text>
          </View>
          <VItemSeparator/>
          <View style={{width: itemWidth}}>
            <Text h3 style={{textAlign:'center'}}>{titles[4]} </Text>
          </View>
          <VItemSeparator/>
          <View style={{width: itemWidth}}>
            <Text h3 style={{textAlign:'center'}}>{titles[5]} </Text>
          </View>
          <VItemSeparator/>
          <View style={{width: itemWidth}}>
            <Text h3 style={{textAlign:'center'}}>{titles[6]} </Text>
          </View>
        </View>
      </View>
    )
  }

  function renderStandingsItem(standing) {
    team = standing.item
    return (
      <View
      style={{margin: 10, flexDirection: 'row'}}>
        <View style={{flex:1, flexDirection:'row'}}>
          <Text h3 style={{marginLeft:10, marginRight:10,}}>{team[0]}</Text>
          <Avatar
            size = 'small'
            source={{ uri: `${team[1]}`}}
            rounded
          />
          <Text h3 style={{marginLeft: 10,}}>{team[2]} </Text>
        </View>
        <View style={{flex: 1, flexDirection:'row'}}>
        <View style={{width: itemWidth}}>
          <Text h3 style={{textAlign:'center'}}>{team[3]} </Text>
        </View>
        <VItemSeparator/>
        <View style={{width: itemWidth}}>
          <Text h3 style={{textAlign:'center'}}>{team[4]} </Text>
        </View>
        <VItemSeparator/>
        <View style={{width: itemWidth}}>
          <Text h3 style={{textAlign:'center'}}>{team[5]} </Text>
        </View>
        <VItemSeparator/>
        <View style={{width: itemWidth}}>
          <Text h3 style={{textAlign:'center'}}>{team[6]} </Text>
        </View>
        </View>
      </View>
    );
  };

  const RenderStandings = (item) =>{
    leagueID = item.leagueID;
    standings = props.standings[leagueID]
    if(!standings){
      return(
        <Text style={{alignSelf: 'center',  textAlign:'center'}}>
          No Standings Available
        </Text>
      );
    }
    return (
      <View style={{flex:1}}>
        <StandingsHeader/>
        <FlatList
        ItemSeparatorComponent={ItemSeparator}
        ref={(ref) => { this.teamList = ref; }}
        data={standings.data}
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
  props.initFixtures(leagueID);

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
          bottomPage = <Fixtures leagueID={leagueID} navigation={props.navigation}/>
          break;
        case 1:
          if(!teamsFetched){
            setTeamsFetched(true);
            props.fetchTeams(leagueID)
          }
          bottomPage = <RenderTeams item={league}/>
          break;
        case 2:
          if(!standingsFetched){
            setStandingsFetched(true);
            props.fetchStandings(leagueID)
          }
          bottomPage = <RenderStandings leagueID={leagueID}/>
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
