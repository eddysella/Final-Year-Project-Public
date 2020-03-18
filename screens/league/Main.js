import React, { Component, useState } from 'react';
import { TouchableHighlight, FlatList, View, Text, Dimensions } from 'react-native';
import { Avatar, Button, ButtonGroup} from 'react-native-elements';
import { scale, } from 'react-native-size-matters';
import { MaterialIndicator,} from 'react-native-indicators';
import Fixtures from '../../containers/league/Fixtures'
import { mainColor } from '../styles/root'
const screenWidth = Math.round(Dimensions.get('window').width);
const itemWidth = scale(screenWidth/9); // screen / 2 / 4 sections
const screenHeight = Math.round(Dimensions.get('window').height);
const itemHeight = scale(screenHeight/15);

export const Main = props => {

  function ItemSeparator(){
    return (
      <View style={{
        height: 2,
        width: '100%',
        backgroundColor: "#000",
      }}/>
    );
  };

  function VItemSeparator(){
    return (
      <View style={{
        width: 2,
        height: '100%',
        backgroundColor: "#000",
      }}/>
    );
  };

  const buttons = ['Fixtures', 'Teams', 'Standings']
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
      <View style={{height: itemHeight, flexDirection:'row'}}>
        <View style={{flex:1, justifyContent:'center'}}>
          <Text style={{marginLeft: 10}}>{titles[0]} </Text>
        </View>
        <View style={{flex: 1, flexDirection:'row', marginRight:10}}>
          <View style={{width: itemWidth, justifyContent:'center', alignItems:'center'}}>
            <Text>{titles[3]} </Text>
          </View>
          <VItemSeparator/>
          <View style={{width: itemWidth, justifyContent:'center', alignItems:'center'}}>
            <Text>{titles[4]} </Text>
          </View>
          <VItemSeparator/>
          <View style={{width: itemWidth, justifyContent:'center', alignItems:'center'}}>
            <Text>{titles[5]} </Text>
          </View>
          <VItemSeparator/>
          <View style={{width: itemWidth, justifyContent:'center', alignItems:'center'}}>
            <Text>{titles[6]} </Text>
          </View>
        </View>
      </View>
    )
  }

  function renderStandingsItem(standing) {
    team = standing.item
    return (
      <View
      style={{flexDirection: 'row'}}>
        <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
          <Text h3 style={{marginLeft:10, marginRight:10,}}>{team[0]}</Text>
          <Avatar
            size = 'small'
            source={{ uri: `${team[1]}`}}
            rounded
          />
          <Text h3 style={{marginLeft: 10,}}>{team[2]} </Text>
        </View>
        <View style={{flex: 1, flexDirection:'row', marginRight:10}}>
          <View style={{borderBottomWidth:2, width: itemWidth, height:itemHeight, justifyContent:'center', alignItems:'center'}}>
            <Text>{team[3]} </Text>
          </View>
          <VItemSeparator/>
          <View style={{borderBottomWidth:2, width: itemWidth, height:itemHeight, justifyContent:'center', alignItems:'center'}}>
            <Text>{team[4]} </Text>
          </View>
          <VItemSeparator/>
          <View style={{borderBottomWidth:2, width: itemWidth, height:itemHeight, justifyContent:'center', alignItems:'center'}}>
            <Text>{team[5]} </Text>
          </View>
          <VItemSeparator/>
          <View style={{borderBottomWidth:2, width: itemWidth, height:itemHeight, justifyContent:'center', alignItems:'center'}}>
            <Text>{team[6]} </Text>
          </View>
        </View>
      </View>
    );
  };

  const RenderStandings = (item) =>{
    standings = item.item
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
        ref={(ref) => { this.teamList = ref; }}
        data={standings.data}
        renderItem={renderStandingsItem}
        keyExtractor={(item,index) => index.toString()}
        />
      </View>
    );
  }

  function renderTeamsItem(item) {
    team = props.teams[item.item];
    name = "    " + props.teams[item.item].name
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
            source={{ uri: `${team.logo}`}}
            rounded
        />
      }
      type='outline'
      onPress={ () =>{
            props.navigation.push('Team', {id: item.item, name: props.teams[item.item].name});
        }}>
      </Button>
    );
  };

  const RenderTeams = (item) => {
    teamIDs = item.item
    if(!teamIDs || teamIDs == null){
      return(
        <Text style={{alignSelf: 'center',  textAlign:'center'}}>No Teams Available</Text>
      );
    }
    return (
      <FlatList
      ref={(ref) => { this.teamList = ref; }}
      data={teamIDs}
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
          bottomPage = <Fixtures leagueID={leagueID} navigation={props.navigation}/>
          break;
        case 1:
          if(!teamsFetched){
            setTeamsFetched(true);
            props.fetchTeams(leagueID)
          }
          bottomPage = <RenderTeams item={league.teamIDs}/>
          break;
        case 2:
          if(!standingsFetched){
            setStandingsFetched(true);
            props.fetchStandings(leagueID)
          }
          bottomPage = <RenderStandings item={props.standings[leagueID]}/>
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
