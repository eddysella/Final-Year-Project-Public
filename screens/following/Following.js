import React, {useState} from 'react';
import { Button, TouchableHighlight, View, Text, Dimensions, Alert} from 'react-native';
import { Avatar, Icon, ButtonGroup } from 'react-native-elements';
import { FlatGrid } from 'react-native-super-grid';
import { MaterialIndicator,} from 'react-native-indicators'
import { Updates } from 'expo';
import { mainColor } from '../styles/root'
import { scale, } from 'react-native-size-matters';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const itemWidth = (screenWidth/2.2);
const itemHeight = scale(screenHeight/6);

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

  const buttons = ['Leagues', 'Teams']
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

  const RenderTeams = () => {
    if(!props.teamIDs.length){
      return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <Button
            title="Follow a Team"
            onPress={() => props.navigation.navigate('Search')}
            color={mainColor}
          />
        </View>
      );
    }
    return (
      <View stlye={{flex:1}}>
        <FlatGrid
        itemDimension={itemWidth}
        items={props.teamIDs}
        renderItem={renderTeam}
        />
      </View>
    );
  }

  function renderTeam(item){
    team = props.teams[item.item]
    return(
      <TouchableHighlight
        style={{borderWidth: 2, borderRadius: 5, borderColor: mainColor }}
        onPress={ () => props.navigation.push('Team', {id: item.item, name: props.teams[item.item].name})}>
        <View style={{padding:10 , alignItems:'center',}}>
          <View style={{ position: 'absolute', right: 0, top: 0, }}>
          <Icon size={10} reverse={true} name='remove' type='ion-icon'
            onPress={() => {
              props.removeTeam(item.item)
              Alert.alert(
                "The fixtures won't display correctly until the application is restarted",
                "Would you like to restart now?",
                [
                  {text: 'No'},
                  {text: 'Restart', onPress: () => Updates.reload()},
                ],
                {cancelable: false},
              );
            }}/>
          </View>
          <Avatar size = 'large' source={{ uri: `${team.logo}`}} rounded />
          <Text style={{textAlign:'center', fontSize:18}}>
              {team.name}
          </Text>
          </View>
      </TouchableHighlight>
    );
  }

  const RenderLeagues = () => {
    if(!props.leagueIDs.length){
      return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <Button
            title="Follow a League"
            onPress={() => props.navigation.navigate('Search')}
            color={mainColor}
          />
        </View>
      );
    }
    return (
      <View stlye={{flex:1}}>
      <FlatGrid
      itemDimension={itemWidth}
      items={props.leagueIDs}
      renderItem={renderLeague}
      />
      </View>
    );
  }

  function renderLeague(item){
    league = props.leagues[item.item]
    return(
      <TouchableHighlight
        style={{borderWidth: 2, borderRadius: 5, borderColor: mainColor }}
        onPress={ () => props.navigation.push('League', {id: item.item, name: props.leagues[item.item].name})}>
        <View style={{padding:10 , alignItems:'center',}}>
          <View style={{ position: 'absolute', right: 0, top: 0, }}>
          <Icon size={10} reverse={true} name='remove' type='ion-icon'
            onPress={() => {
              props.removeLeague(item.item)
              Alert.alert(
                "The fixtures won't display correctly until the application is restarted",
                "Would you like to restart now?",
                [
                  {text: 'No'},
                  {text: 'Restart', onPress: () => Updates.reload()},
                ],
                {cancelable: false},
              );
            }}/>
          </View>
          <Avatar size = 'large' source={{ uri: `${league.logo}`}} rounded />
          <Text style={{textAlign:'center', fontSize:18}}>
              {league.name}
          </Text>
          </View>
      </TouchableHighlight>
    );
  }

  const [currentTab, setTab] = useState(0);
  bottomPage = null;
  switch(currentTab){
    case 0:
      bottomPage = <RenderLeagues/>;
      break;
    case 1:
      bottomPage = <RenderTeams/>;
      break;
  }
  return (
    <View style={{flex:1}}>
      <View style={{flex:props.topBarFlex}}>
        <RenderTopBar/>
      </View>
      <View style={{flex:props.screenFlex}}>
        {bottomPage}
      </View>
    </View>
  );
};
