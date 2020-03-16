import React, { Component, useState } from 'react';
import {TouchableHighlight, SectionList, FlatList, View, Text, Dimensions } from 'react-native';
import {Card, Button, ButtonGroup} from 'react-native-elements';
import { scale,} from 'react-native-size-matters';
import { MaterialIndicator,} from 'react-native-indicators';
import { mainColor } from '../../styles/root'
const screenWidth = Math.round(Dimensions.get('window').width);
const itemWidth = screenWidth/1.5
const screenHeight = Math.round(Dimensions.get('window').height);
const itemHeight = screenHeight/19

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

  function shouldDisplayData(){
    return props.followedTeams.length || props.followedLeagues.length;
  }

  function renderItem(item) {
    fixture = props.fixturesByID[item.item]
    return (
      <Button
      raised
      containerStyle={{marginVertical: 5, marginHorizontal:20}}
      buttonStyle={{borderColor:'#0f0f0f'}}
      icon = {
        <View  width={itemWidth} minHeight={itemHeight} flexDirection={'row'} style={{ justifyContent: 'space-around', alignItems:'center'}}>
          <Text style={{flex:1, fontSize:16, textAlign:'center'}}>{fixture.homeTeam.team_name}</Text>
          <Text style={{flex:1, fontSize:16, textAlign:'center'}}>{fixture.status}</Text>
          <Text style={{flex:1, fontSize:16, textAlign:'center'}}>{fixture.awayTeam.team_name}</Text>
        </View>
      }
      type='outline'
      onPress={ () =>{
            props.navigation.push('Inner', {id: item.item, name: props.fixturesByID[item.item].league.name});
        }}>
      </Button>
    );
  };

  function processDate(date){
    collect = []
    for( league in date ){
      name = null
      if(props.leaguesByID[league] === undefined){
        name = "Loading";
      }else{
        name = props.leaguesByID[league]['name']
      }
      collect.push({title: name, data: date[league]})
    }
    return collect;
  }

  function renderDates(item){
    date = item.item
    return (
      <Card title={new Date(parseInt(date)).toLocaleDateString()} titleStyle={{fontSize:18}}>
      {
        <View style={{alignItems: 'center'}}>
          <SectionList
          sections={processDate(props.fixtureIDs[date])}
          renderItem={renderItem}
          keyExtractor={(item,index) => item.toString()}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={{alignSelf: 'center', fontSize:20, padding:10}}>{title}</Text>
          )}
          />
        </View>
      }
      </Card>
    );
  };

  const RenderFutureFixtures = () => {
    if(!shouldDisplayData()){
      return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <Text style={{fontSize:20}}> Fixtures for followed leagues </Text>
          <Text style={{fontSize:20}}> and teams are displayed here</Text>
        </View>
      )
    }
    return (
      <FlatList
        data={props.curFutureDates}
        renderItem={renderDates}
        keyExtractor={(item,index) => index.toString()}
        extraData={props.curFutureDates}
        onEndReached={() => {
          if(!(props.fetchingFuture)){
            props.fetchMoreFuture()
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
    if(!shouldDisplayData()){
      return (
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <Text style={{fontSize:20}}> Fixtures for followed leagues </Text>
        <Text style={{fontSize:20}}> and teams are displayed here</Text>
      </View>
    )
    }else if(!props.fixtureIDs[date]){
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
          <SectionList
          ref={(ref) => { this.leagueList = ref; }}
          sections={processDate(props.fixtureIDs[date])}
          renderItem={renderItem}
          keyExtractor={(item,index) => item.toString()}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={{alignSelf: 'center', fontSize:20, padding:10}}>{title}</Text>
          )}
          />
        </View>
      }
      </Card>
    );
  }

  const RenderPastFixtures = () => {
    if(!shouldDisplayData()){
      return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <Text style={{fontSize:20}}> Fixtures for followed leagues </Text>
          <Text style={{fontSize:20}}> and teams are displayed here</Text>
        </View>
      )
    }
    return (
      <FlatList
        data={props.curPastDates}
        renderItem={renderDates}
        keyExtractor={(item,index) => index.toString()}
        extraData={props.curPastDates}
        onEndReached={() => {
          if(!(props.fetchingPast)){
            props.fetchMorePast()
          }
        }}
        onEndReachedThreshold={0.2}
      />
    );
  }

  const buttons = ['Past', 'Today', 'Future']
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

  const [currentTab, setTab] = useState(1);

  if(props.fetchingFuture || props.fetchingPast){
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
        if(!(props.curPastDates.length)){
          if(!(props.fetchingPast)){
            props.fetchMorePast()
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
            props.fetchMoreFuture()
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
