import React, { Component, useState } from 'react';
import {TouchableHighlight, SectionList, FlatList, View, Text, Dimensions } from 'react-native';
import {Card, ButtonGroup} from 'react-native-elements';
import { MaterialIndicator,} from 'react-native-indicators';
import { mainColor } from '../../styles/root'

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

  const buttons = ['Statistics', 'Events', 'Line-Ups']
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
    position = null;
    switch(player.pos){
      case 'G':
        position = 'Goalkeeper: ';
        break;
      case 'D':
        position = 'Defender: ';
        break;
      case 'M':
        position = 'Mid: ';
        break;
      case 'F':
        position = 'Forward: ';
        break;
      case 'A':
        position = 'Attacker: ';
        break;
      default:
        position = 'n/a: '
        break;
    }
    return (
      <View flexDirection='row' style={{ justifyContent: 'center'}}>
        <Text style={{fontWeight: 'bold'}}>{position}</Text>
        <Text> {player.player}</Text>
      </View>
    );
  };

  function renderLineupCards(team) {
    team = team.item;
    return (
      <Card title={team.team} titleStyle={{fontSize:18}}>
        <SectionList
          sections={[
           { title: 'Starting', data: team.starting },
           { title: 'Substitutes', data: team.subs },
          ]}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={{alignSelf: 'center', fontSize:18, padding:10}}>{title}</Text>
          )}
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
  const [fetched, setFetched] = useState(false);
  if(!fetched){
    props.fetchSpecificFixture(fixtureID)
    setFetched(true);
  }

  if(props.fetching){
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
