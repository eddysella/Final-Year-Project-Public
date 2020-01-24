import React, { useEffect, } from 'react';
import { ExpoConfigView } from '@expo/samples';
import {TouchableHighlight, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import {Card} from 'react-native-elements';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import SquareGrid from "react-native-square-grid";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export const Main = props => {

  function renderLeague(item, index) {
    console.log(item);
      return (
          <View style={{borderWidth: 3, margin: 5, padding: 10, alignItems: 'center',  alignSelf: 'stretch'}}>
              <Avatar
                  size = 'large'
                  source={{ uri: `${item.logo}`}}
                  rounded
              />
              <Text h3>
                  {item.name}
              </Text>
          </View>
      );
  }

  function renderTeam(item, index) {
      return (
          <View style={{borderWidth: 3, margin: 5, padding: 10, alignItems: 'center',  alignSelf: 'stretch'}}>
              <Avatar
                  size = 'large'
                  source={{ uri: `${item.logo}`}}
                  rounded
              />
              <Text h3>
                  {item.name}
              </Text>
          </View>
      );
  }

  if(!props.teamIDs.length && !props.leagueIDs.length){
    return (
      <View style={{flex:props.screenFlex}}>
      </View>
    );
  }else if(props.teamStatus || props.leagueStatus){
    return (
      <View style={{flex:props.screenFlex}}>
        <ActivityIndicator/>
      </View>
    );
  }else{
    return (
      <View style={{flex:props.screenFlex}}>
        <Card title={"League"}>
        {
          <SquareGrid
              rows={0}
              columns={3}
              items={props.teamIDs}
              renderItem={renderTeam}
          />
        }
        </Card>
        <Card title={"Team"}>
        {
          <SquareGrid
              rows={0}
              columns={3}
              items={props.leagueIDs}
              renderItem={renderLeague}
          />
        }
        </Card>
      </View>
    );
  }
};
