import React, { Component, useState } from 'react';
import { ExpoConfigView } from '@expo/samples';
import {Image, TouchableHighlight, SectionList, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import {Card} from 'react-native-elements';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { MaterialIndicator,} from 'react-native-indicators';
const screenWidth = Math.round(Dimensions.get('window').width);
// const screenHeight = Math.round(Dimensions.get('window').height);
const itemWidth = screenWidth - scale(screenWidth/5);
// const itemHeight = scale(screenWidth/4);
// const itemHorizontalPadding = (itemWidth/5);
// const itemVerticalPadding = scale(15);

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
          style={{flex:1, borderBottomWidth:pastBorder}}>
          <Text style={{textAlign: 'center'}}>Past</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => setTab(1)}
            style={{flex:1, alignItems: 'center', borderBottomWidth:todayBorder}}>
          <Text style={{textAlign:'center'}}>Today</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => setTab(2)}
          style={{flex:1, borderBottomWidth:futureBorder}}>
          <Text style={{textAlign: 'center'}}>Future</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  function renderItem(item) {
    fixture = props.fixturesByID[item.item]
    return (
      <TouchableHighlight onPress={ () => {
          props.fetchSpecificFixture(item.item)
          props.navigation.push('Inner', {id: item.item});
      }}>
        <View  width={itemWidth} flexDirection={'row'} style={{ justifyContent: 'space-around'}}>
          <Text style={{flex:1,   textAlign:'center'}}>{fixture.homeTeam.team_name}</Text>
          <Text style={{flex:1, textAlign:'center', alignSelf: 'center',}}>{fixture.status}</Text>
          <Text style={{flex:1,   textAlign:'center'}}>{fixture.awayTeam.team_name}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  function renderDates(item){
    date = item.item
    return (
      <Card title={new Date(parseInt(date)).toLocaleDateString()}>
      {
        <View style={{alignItems: 'center'}}>
          <FlatList
            data={props.fixturesByDate[date]}
            renderItem={renderItem}
            keyExtractor={(item,index) => index.toString()}
          />
        </View>
      }
      </Card>
    );
  };

  const RenderFutureFixtures = () => {
    return (
      <FlatList
        data={props.curFutureDates}
        renderItem={renderDates}
        keyExtractor={(item,index) => index.toString()}
        extraData={props.curFutureDates}
        onEndReached={() => {
          if(!(props.fetchingFuture)){
            props.fetchMoreFuture([props.leagueID])
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
    return (
      <Card>
      {
        <View style={{alignItems: 'center'}}>
          <FlatList
            data={props.todayIDs}
            renderItem={renderItem}
            keyExtractor={(item,index) => index.toString()}
          />
        </View>
      }
      </Card>
    );
  }

    const RenderPastFixtures = () => {
      return (
        <FlatList
          data={props.curPastDates}
          renderItem={renderDates}
          keyExtractor={(item,index) => index.toString()}
          extraData={props.curPastDates}
          onEndReached={() => {
            if(!(props.fetchingPast)){
              props.fetchMorePast([props.leagueID])
            }
          }}
          onEndReachedThreshold={0.2}
        />
      );
    }

  const [currentTab, setTab] = useState(1);

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
        if(!(props.curPastDates.length)){
          if(!(props.fetchingPast)){
            props.fetchMorePast([props.leagueID])
          }
        }
        bottomPage = <RenderPastFixtures/>;
        break;
      case 1:
        bottomPage = <RenderTodayFixtures/>;
        break;
      case 2:
        if(!(props.curFutureDates.length)){
          if(!(props.fetchingFuture)){
            props.fetchMoreFuture([props.leagueID])
          }
        }
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
