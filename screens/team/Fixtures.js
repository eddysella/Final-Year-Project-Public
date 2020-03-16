import React, { Component, useState } from 'react';
import {TouchableHighlight, FlatList, View, Text, Dimensions } from 'react-native';
import {Card, Button, ButtonGroup} from 'react-native-elements';
import { scale, } from 'react-native-size-matters';
import { MaterialIndicator,} from 'react-native-indicators';
import { mainColor } from '../styles/root'
const screenWidth = Math.round(Dimensions.get('window').width);
const itemWidth = screenWidth/1.5
const screenHeight = Math.round(Dimensions.get('window').height);
const itemHeight = scale(screenHeight/17);

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

  function renderItem(item){
    fixture = props.fixturesByID[item.item]
    return (
      <Card title={new Date(parseInt(fixture.date)).toLocaleDateString()} titleStyle={{fontSize:18}}>
      {
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
          props.navigation.push('Fixture', {id: item.item, name: props.fixturesByID[item.item].league.name});
          }}>
        </Button>
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
          props.navigation.push('Fixture', {id: fixID, name: props.fixturesByID[fixID].league.name});
          }}>
        </Button>
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
