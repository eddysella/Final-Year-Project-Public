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
    status = fixture.status;

    return (
      <TouchableHighlight onPress={ () => {
          props.fetchSpecificFixture(fixture.id);
          props.navigation.push('Inner');
      }}>
        <View  width={itemWidth} flexDirection={'row'} style={{ justifyContent: 'space-around'}}>
          <Text style={{flex:1,   textAlign:'center'}}>{fixture.homeTeam.team_name}</Text>
          <Text style={{flex:1, alignSelf: 'center',  textAlign:'center'}}>{status}</Text>
          <Text style={{flex:1,   textAlign:'center'}}>{fixture.awayTeam.team_name}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  function processDate(date){
    collect = []
    for( league in date ){
      collect.push({title: league, data: date[league]})
    }
    return collect;
  }

  function renderDates(item){
    date = item.item
    return (
      <Card title={date}>
      {
        <View key={date} style={{justifyContent: 'center', alignItems: 'center'}}>
          <SectionList
          ItemSeparatorComponent={ItemSeparator}
          ref={(ref) => { this.leagueList = ref; }}
          sections={processDate(props.fixtureIDs[date])}
          renderItem={renderItem}
          keyExtractor={(item,index) => item.toString()}
          renderSectionHeader={({ section: { title } }) => (
            <Text>{title}</Text>
          )}
          />
        </View>
      }
      </Card>
    );
  };

  const RenderFutureFixtures = () => {
    return (
      <FlatList
        ItemSeparatorComponent={ItemSeparator}
        ref={(ref) => { this.flatListRef = ref; }}
        data={props.curFutureDates}
        renderItem={renderDates}
        keyExtractor={(item,index) => index.toString()}
        extraData={props.curFutureDates}
        onEndReached={() => props.fetchMoreFuture()}
      />
    );
  }

  const RenderTodayFixtures = () => {
    today = new Date().toDateString();
    if(!props.fixtureIDs[today]){
      title="There are no games on today :(";
        return (
          <Card title={title} >
            <View>
            </View>
          </Card>
        );
    }
    return (
      <SectionList
      ItemSeparatorComponent={ItemSeparator}
      ref={(ref) => { this.leagueList = ref; }}
      sections={processDate(props.fixtureIDs[today])}
      renderItem={renderItem}
      keyExtractor={(item,index) => item.toString()}
      renderSectionHeader={({ section: { title } }) => (
        <Text>{title}</Text>
      )}
      />
    );
  }

  const RenderPastFixtures = () => {
    return (
      <FlatList
        ItemSeparatorComponent={ItemSeparator}
        ref={(ref) => { this.flatListRef = ref; }}
        data={props.curPastDates}
        renderItem={renderDates}
        keyExtractor={(item,index) => index.toString()}
        extraData={props.curPastDates}
        onEndReached={() => props.fetchMorePast()}
      />
    );
  }

  const [currentTab, setTab] = useState(1);
  console.log(props.fixtureIDs);

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
        bottomPage = <RenderPastFixtures/>;
        break;
      case 1:
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
