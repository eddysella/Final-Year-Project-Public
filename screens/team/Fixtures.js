import React, { Component, useState } from 'react';
import {TouchableHighlight, FlatList, View, Text, Dimensions } from 'react-native';
import {Card} from 'react-native-elements';
import { scale, } from 'react-native-size-matters';
import { MaterialIndicator,} from 'react-native-indicators';
const screenWidth = Math.round(Dimensions.get('window').width);
const itemWidth = screenWidth - scale(screenWidth/5);

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

  const RenderTopBar = () => {
    pastBorder=0;
    todayBorder=0;
    futureBorder=0;
    if(currentTab == 0){
      pastBorder=2;
      todayBorder=0;
      futureBorder=0;
    }else if(currentTab == 1){
      pastBorder=0;
      todayBorder=2;
      futureBorder=0;
    }else if(currentTab == 2){
      pastBorder=0;
      todayBorder=0;
      futureBorder=2;
    }

    return (
      <View style={{flex:1}}>
        <View flexDirection={'row'} style={{flex:1, justifyContent: 'space-around'}}>
          <TouchableHighlight onPress={() => setTab(0)}
          style={{flex:1, borderBottomWidth:pastBorder, justifyContent:'center'}}>
          <Text style={{textAlign: 'center', fontSize:18}}>Past</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => setTab(1)}
            style={{flex:1, alignItems: 'center', borderBottomWidth:todayBorder, justifyContent:'center'}}>
          <Text style={{textAlign:'center', fontSize:18}}>Today</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => setTab(2)}
          style={{flex:1, borderBottomWidth:futureBorder, justifyContent:'center'}}>
          <Text style={{textAlign: 'center', fontSize:18}}>Future</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  function renderItem(item){
    fixture = props.fixturesByID[item.item]
    return (
      <Card title={new Date(parseInt(fixture.date)).toLocaleDateString()}>
      {
        <View style={{alignItems: 'center'}}>
          <TouchableHighlight onPress={ () => {
              props.fetchSpecificFixture(item.item)
              props.navigation.push('Fixture', {id: item.item});
          }}>
            <View  width={itemWidth} flexDirection={'row'} style={{ justifyContent: 'space-around'}}>
              <Text style={{flex:1,   textAlign:'center'}}>{fixture.homeTeam.team_name}</Text>
              <Text style={{flex:1, textAlign:'center', alignSelf: 'center',}}>{fixture.status}</Text>
              <Text style={{flex:1,   textAlign:'center'}}>{fixture.awayTeam.team_name}</Text>
            </View>
          </TouchableHighlight>
        </View>
      }
      </Card>
    );
  };

  const RenderFutureFixtures = () => {
    return (
      <FlatList
        data={props.futureFixtureIDs}
        renderItem={renderItem}
        keyExtractor={(item,index) => index.toString()}
        extraData={props.futureFixtureIDs}
        onEndReached={() => {
          if(!(props.fetchingFuture)){
            props.fetchMoreFuture([props.teamID])
          }
        }}
        onEndReachedThreshold={0.2}
      />
    );
  }

  const RenderTodayFixtures = () => {
    today = new Date()
    today.setHours(0,0,0,0)
    date = today.getTime()
    if(!(props.todayIDs.length)){
      title="There are no games on today :(";
        return (
          <Card title={title} >
            <View>
            </View>
          </Card>
        );
    }
    fixID = props.todayIDs[0]
    fixture = props.fixturesByID[fixID]
    return (
      <Card>
      {
        <View style={{alignItems: 'center'}}>
          <TouchableHighlight onPress={ () => {
              props.fetchSpecificFixture(fixID)
              props.navigation.push('Inner', {id: fixID});
          }}>
            <View  width={itemWidth} flexDirection={'row'} style={{ justifyContent: 'space-around'}}>
              <Text style={{flex:1,   textAlign:'center'}}>{fixture.homeTeam.team_name}</Text>
              <Text style={{flex:1, textAlign:'center', alignSelf: 'center',}}>{fixture.status}</Text>
              <Text style={{flex:1,   textAlign:'center'}}>{fixture.awayTeam.team_name}</Text>
            </View>
          </TouchableHighlight>
        </View>
      }
      </Card>
    );
  }

    const RenderPastFixtures = () => {
      return (
        <FlatList
          data={props.pastFixtureIDs}
          renderItem={renderItem}
          keyExtractor={(item,index) => index.toString()}
          extraData={props.pastFixtureIDs}
          onEndReached={() => {
            if(!(props.fetchingPast)){
              props.fetchMorePast([props.teamID])
            }
          }}
          onEndReachedThreshold={0.2}
        />
      );
    }

  const [currentTab, setTab] = useState(1);
  const [initFuture, setFuture] = useState(false);
  const [initPast, setPast] = useState(false);

  if(props.fetchingFuture || props.fetchingPast){
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
        bottomPage = <RenderPastFixtures/>;
        break;
      case 1:
        if(!(props.pastFixtureIDs.length)){
          if(!(initPast)){
            setPast(true);
            props.fetchMorePast([props.teamID])
          }
        }
        if(!(props.futureFixtureIDs.length)){
          if(!(initFuture)){
            setFuture(true);
            props.fetchMoreFuture([props.teamID])
          }
        }
        bottomPage = <RenderTodayFixtures/>;
        break;
      case 2:
        bottomPage = <RenderFutureFixtures/>;
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
