import React, { Component, useState } from 'react';
import { ExpoConfigView } from '@expo/samples';
import {Image, TouchableHighlight, SectionList, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import {Card} from 'react-native-elements';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { MaterialIndicator,} from 'react-native-indicators';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const itemWidth = screenWidth - scale(screenWidth/5);
const itemHeight = scale(screenWidth/4);
const itemHorizontalPadding = (itemWidth/5);
const itemVerticalPadding = scale(15);

export const Details = props => {

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
        <View flexDirection={'row'} style={{flex:3, justifyContent: 'space-around'}}>
          <View style={{flex:1, margin: 5}}>
            <Image
            style={{flex:2}}
            resizeMode={"contain"}
            source={{ uri: fixture.homeLogo }}
            />
            <Text style={{flex:1, textAlign:'center'}}>{fixture.homeName}</Text>
          </View>

          <View style={{flex:1, margin: 5, alignItems:'center', justifyContent:'center'}}>
            <Text>{fixture.status}</Text>
          </View>

          <View style={{flex:1, margin: 5}}>
            <Image
            style={{flex:2}}
            resizeMode={"contain"}
            source={{ uri: fixture.awayLogo}}
            />
            <Text style={{flex:1, textAlign:'center'}}>{fixture.awayName}</Text>
          </View>
        </View>
        <View flexDirection={'row'} style={{flex:1, justifyContent: 'space-around'}}>
          <TouchableHighlight onPress={() => setTab(0)}
          style={{flex:1, borderBottomWidth:statsBorder}}>
          <Text style={{textAlign: 'center'}}>Stats</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => setTab(1)}
            style={{flex:1, alignItems: 'center', borderBottomWidth:eventsBorder}}>
          <Text style={{textAlign:'center'}}>Events</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => setTab(2)}
          style={{flex:1, borderBottomWidth:lineupBorder}}>
          <Text style={{textAlign: 'center'}}>Line-Up</Text>
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

  fixture = props.screen
  const [currentTab, setTab] = useState(0);
  console.log(props.fetching)

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
      <View style={{flex:1}}>
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
