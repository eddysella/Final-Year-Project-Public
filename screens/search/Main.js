import React, {useState} from 'react';
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
        <Text style={{padding:10, fontSize:18}}>
          {props.props.name}
        </Text>
      </View>
    );
  }

  function renderLeague(item) {
    league = props.leagues[item.item];
    if(props.followingLeagueIDs.includes(parseInt(item.item))){
      icon = <Icon
              reverse={true}
              name='remove'
              type='ion-icon'
              onPress={() => {
                setRefresh(true);
                props.followingRemoveLeague(parseInt(item.item))
              }}
              />
    }else{
      icon = <Icon
              reverse={true}
              name='add'
              type='ion-icon'
              onPress={() => {
                setRefresh(true);
                props.followingAddLeague(parseInt(item.item))
              }}
              />
    }
    return(
      <TouchableHighlight onPress={ () => props.navigation.push('League', {id: item.item})}>
        <View flexDirection={'row'}>
          <RenderItem props={league}/>
          <View style={{ position: 'absolute', right: 0,}}>
          {icon}
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  function renderTeam(item) {
    team = props.teams[item.item];
    if(props.followingTeamIDs.includes(parseInt(item.item))){
      icon = <Icon
              reverse={true}
              name='remove'
              type='ion-icon'
              onPress={() => {
                setRefresh(true);
                props.followingRemoveTeam(parseInt(item.item))
              }}
              />
    }else{
      icon = <Icon
              reverse={true}
              name='add'
              type='ion-icon'
              onPress={() => {
                setRefresh(true);
                props.followingAddTeam(parseInt(item.item))
              }}
              />
    }
    return(
      <TouchableHighlight onPress={ () => props.navigation.push('Team', {id: item.item})}>
        <View flexDirection={'row'}>
          <RenderItem props={team}/>
          <View style={{ position: 'absolute', right: 0,}}>
          {icon}
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  [refresh,setRefresh] = useState(false);

  if(refresh){
    setRefresh(false);
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
          ref={(ref) => { this.leagueList = ref; }}
          sections={
            [
            {title: 'Leagues', data:props.leagueIDs, renderItem:renderLeague},
            {title: 'Teams', data:props.teamIDs, renderItem:renderTeam},
            ]
          }
          keyExtractor={(item,index) => item.toString()}
          extraData={refresh}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={{textAlign:'center', fontSize: 30,}}>{title}</Text>
          )}
          />
      </View>
    );
  }
};
