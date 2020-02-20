import React from 'react';
import { TouchableHighlight, SectionList, View, Text,} from 'react-native';
import { Avatar, Icon} from 'react-native-elements';
import { MaterialIndicator,} from 'react-native-indicators';
import { scale,} from 'react-native-size-matters';
export const Main = props => {

  function ItemSeparator(){
    return (
      <View
        style={{
          height: scale(2),
          width: '100%',
          backgroundColor: "#000",
        }}/>
    );
  };

  const RenderItem = (props) => {
    return (
      <View flexDirection={'row'} style={{margin: 5, padding: 10, alignItems: 'center',  alignSelf: 'stretch'}}>
        <Avatar
          size = 'medium'
          source={{ uri: `${props.props.logo}`}}
          rounded
        />
        <Text h3>
          {props.props.name}
        </Text>
      </View>
    );
  }

  function renderLeague(item) {
    league = props.leagues[item.item];
    return(
      <TouchableHighlight onPress={ () => props.navigation.push('League', {id: item.item})}>
        <View flexDirection={'row'}>
          <RenderItem props={league}/>
          <Icon
            reverse={true}
            name='add'
            type='ion-icon'
            onPress={() => props.followingAddLeague(item.item)}/>
        </View>
      </TouchableHighlight>
    );
  }

  function renderTeam(item) {
    team = props.teams[item.item];
    return(
      <TouchableHighlight onPress={ () => props.navigation.push('Team', {id: item.item})}>
        <View flexDirection={'row'}>
          <RenderItem props={team}/>
          <Icon
            reverse={true}
            name='add'
            type='ion-icon'
            onPress={() => props.followingAddTeam(item.item)}/>
          </View>
      </TouchableHighlight>
    );
  }

  if(props.teamStatus || props.leagueStatus){
    return (
      <View style={{flex:props.screenFlex}}>
        <MaterialIndicator/>
      </View>
    );
  }else if(!props.teamIDs.length && !props.leagueIDs.length){
    return (
      <View style={{flex:props.screenFlex, justifyContent: 'center'}}>
      </View>
    );
  }else{
    return(
      <View style={{flex:props.screenFlex}}>
          <SectionList
          ItemSeparatorComponent={ItemSeparator}
          ref={(ref) => { this.leagueList = ref; }}
          sections={[
            {title: 'Leagues', data:props.leagueIDs, renderItem:renderLeague},
            {title: 'Teams', data:props.teamIDs, renderItem:renderTeam},
          ]}
          keyExtractor={(item,index) => item.toString()}
          renderSectionHeader={({ section: { title } }) => (
            <Text>{title}</Text>
          )}
          />
      </View>
    );
  }
};
