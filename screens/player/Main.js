import React, { Component, useState } from 'react';
import { View, Text, Dimensions, SectionList } from 'react-native';
import { MaterialIndicator,} from 'react-native-indicators';

export const Main = props => {
  const statTitles = [
    'Player',
    'Games',
    'Shots',
    'Passes',
    'Dribbles',
    'Tackles',
    'Cards',
    'Fouls',
  ]

  function ItemSeparator(){
    return (
      <View style={{
        height: scale(2),
        width: '100%',
        backgroundColor: "#000",
      }}/>
    );
  };

  function renderItem(stat) {
    stat = stat.item
    return (
        <View style={{margin: 5, padding: 10, alignItems: 'center',  alignSelf: 'stretch'}}>
          <Text h3>{stat}</Text>
        </View>
      );
  };

  function injured(stat){
    if(stat == "True"){
      return "Yes"
    }else if(stat == "False"){
      return "No"
    }else{
      return "Unavailable"
    }
    return
  }

  function processStats(stats){
    collect = {};
    collect['player'] = [
      "Position: " + stats.position,
      "Nationality: " + stats.nationality,
      "Height: " + (stats.height === "NULL" ? "Unavailable" : stats.height),
      "Weight: " + (stats.weight === "NULL" ? "Unavailable" : stats.weight),
      "Age: " + stats.age,
      "Injured: " + injured(stats.injured),
      "Captain: " + (stats.captain == 0 ? "No" : "Yes"),
    ]
    for(key in stats){
      stat = stats[key];
        switch(key){
          case 'games':
            collect[key] = [
              "Appearances: " + stat.appearences,
              "Minutes Played: " + stat.minutes_played,
            ]
            break;
          case 'shots':
            modAcc = stat.accuracy.toFixed(0)
            collect[key] = [
              "Total: " + stat.total,
              "Goals: " + stat.goals,
              "Conversion Rate: " + modAcc + "%",
              "Assists: " + stat.assists,
            ]
            break;
          case 'passes':
            modAcc = stat.accuracy.toFixed(0)
            collect[key] = [
              "Key: " + stat.key,
              "Accuracy: " + modAcc + "%",
            ]
            break;
          case 'dribbles':
            collect[key] = [
              "Attempts: " + stat.attempts,
              "Successful: " + stat.success,
            ]
            break;
          case 'tackles':
            collect[key] = [
              "Total: " + stat.total,
              "Successful: " + stat.interceptions,
            ]
            break;
          case 'cards':
            collect[key] = [
              "Red: " + stat.red,
              "Yellow: " + stat.yellow,
            ]
            break;
          case 'fouls':
            collect[key] = [
              "Committed: " + stat.committed,
              "Drawn: " + stat.drawn,
            ]
            break;
        }
    }
    return collect;
  }

  const RenderStatistics = (item) =>{
    stats = item.item;
    if(!stats || stats == null){
      return(
        <Text style={{alignSelf: 'center',  textAlign:'center'}}>No Statistics Available</Text>
      );
    }
    stats.shots['goals']=stats.goals.total;
    stats.shots['accuracy']=((stats.goals.total/stats.shots.total)*100);
    stats.shots['assists']=stats.goals.assists;

    processedStats = processStats(stats);

    return (
      <SectionList
      ref={(ref) => { this.leagueList = ref; }}
      sections={[
        {title: statTitles[0], data:processedStats.player},
        {title: statTitles[1], data:processedStats.games},
        {title: statTitles[2], data:processedStats.shots},
        {title: statTitles[3], data:processedStats.passes},
        {title: statTitles[4], data:processedStats.dribbles},
        {title: statTitles[5], data:processedStats.tackles},
        {title: statTitles[6], data:processedStats.cards},
        {title: statTitles[7], data:processedStats.fouls},
      ]}
      renderItem={renderItem}
      keyExtractor={(item,index) => item.toString()}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={{alignSelf: 'center', fontSize:18, padding:10}}>{title}</Text>
      )}
      />
    );
  }

  teamID = props.navigation.getParam('teamID');
  playerID = props.navigation.getParam('playerID');
  player = props.players[playerID];
  const [statsFetched, setStatsFetched] = useState(false);

  if(props.fetching){
    return(
      <View style={{flex:props.screenFlex}}>
        <MaterialIndicator/>
      </View>
    );
    }else{
      if(!statsFetched){
        props.fetchStatistics(teamID);
        setStatsFetched(true);
      }
      stats = props.playerStats[(teamID + "x" + playerID)];
      return (
        <View style={{flex:props.screenFlex}}>
          <RenderStatistics item={stats}/>
        </View>
      );
    }
  }
