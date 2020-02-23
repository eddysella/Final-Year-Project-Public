import React, { Component, useState } from 'react';
import {TouchableHighlight, SectionList, FlatList, View, Text, Dimensions } from 'react-native';
import {Card} from 'react-native-elements';
import { MaterialIndicator,} from 'react-native-indicators';

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
    fixture = item.item;
    statsBorder=0;
    eventsBorder=0;
    lineupBorder=0;
    if(currentTab == 0){
      statsBorder=2;
      eventsBorder=0;
      lineupBorder=0;
    }else if(currentTab == 1){
      statsBorder=0;
      eventsBorder=2;
      lineupBorder=0;
    }else if(currentTab == 2){
      statsBorder=0;
      eventsBorder=0;
      lineupBorder=2;
    }
    return (
      <View style={{flex:1}}>
        <View flexDirection={'row'} style={{flex:1, justifyContent: 'space-around'}}>
          <TouchableHighlight onPress={() => setTab(0)}
          style={{flex:1, borderBottomWidth:statsBorder}}>
          <Text style={{textAlign: 'center', fontSize:18,}}>Stats</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => setTab(1)}
            style={{flex:1, alignItems: 'center', borderBottomWidth:eventsBorder}}>
          <Text style={{textAlign:'center', fontSize:18,}}>Events</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => setTab(2)}
          style={{flex:1, borderBottomWidth:lineupBorder}}>
          <Text style={{textAlign: 'center', fontSize:18,}}>Line-Up</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  function renderNoData(data) {
    title="There are no " + data + " available";
    return (
      <Card title={title} >
        <View>
        </View>
      </Card>
    );
  }

  function renderStatItem(stat) {
    stat=stat.item
    return (
      <View flexDirection={'row'} style={{flex:1, justifyContent: 'space-around'}}>
        <Text style={{flex:1, textAlign: 'center'}}>{stat.home}</Text>
        <Text style={{flex:1, alignSelf: 'center',  textAlign:'center'}}>{stat.stat}</Text>
        <Text style={{flex:1, textAlign: 'center'}}>{stat.away}</Text>
      </View>
    );
  };

  const RenderStats = (item) => {
    stats = item.item;
    if(!stats){
        return renderNoData('Stats');
    }
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={stats}
        renderItem={renderStatItem}
        keyExtractor={(item,index) => index.toString()}
      />
    );
  };

  function renderEventItem(ev) {
    ev=ev.item;
    return (
      <View style={{ justifyContent: 'space-around'}}>
        <Text style={{flex:1, alignSelf: 'center',  textAlign:'center'}}>{ev.elapsed}' {ev.player} {ev.detail}</Text>
      </View>
    );
  };

  const RenderEvents = (item) => {
    events = item.item;
    if(!events){
      return renderNoData('Events');
    }
    return (
        <FlatList
        showsVerticalScrollIndicator={false}
        // initialScrollIndex={4}
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item,index) => index.toString()}
      />
    );
  }

  function renderLineupItem(player) {
    player=player.item;
    return (
      <View style={{ justifyContent: 'space-around'}}>
        <Text style={{flex:1}}>{player.pos} {player.player}</Text>
      </View>
    );
  };

  function renderLineupCards(team) {
    team = team.item;
    return (
      <Card title={team.team}>
        <SectionList
          sections={[
           { title: 'Starting', data: team.starting },
           { title: 'Substitutes', data: team.subs },
          ]}
          renderSectionHeader={ ({section}) => <Text> { section.title } </Text> }
          renderItem={renderLineupItem}
          keyExtractor={ (item, index) => item+index.toString() }
        />
      </Card>
    );
  };

  const RenderLineups = (item) => {
    lineups = item.item
    if(!lineups){
      return renderNoData('Lineups');
    }
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={lineups}
        renderItem={renderLineupCards}
        keyExtractor={(item,index) => index.toString()}
      />
    );
  }

  fixtureID = props.navigation.getParam('id');
  fixture = props.fixturesByID[fixtureID];
  const [currentTab, setTab] = useState(0);

  if(props.fetching){
    return(
      <View style={{flex:1}}>
        <View style={{flex:props.topBarFlex}}>
          <RenderTopBar item={props.topBar}/>
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
        bottomPage = <RenderStats item={fixture.stats}/>;
        break;
      case 1:
        bottomPage = <RenderEvents item={fixture.events}/>;
        break;
      case 2:
        bottomPage = <RenderLineups item={fixture.lineups}/>;
        break;
    }
    return (
      <View style={{flex:props.viewFlex, paddingTop:10}}>
        <View style={{flex:props.topBarFlex}}>
          <RenderTopBar item={props.topBar}/>
        </View>
        <View style={{flex:props.screenFlex}}>
          {bottomPage}
        </View>
      </View>
    );
  }
};
