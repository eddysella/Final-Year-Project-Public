import React, {Component} from 'react';
import { ExpoConfigView } from '@expo/samples';
import {TouchableHighlight, SectionList, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import {Card} from 'react-native-elements';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export const Screen = props => {

    let itemWidth = screenWidth - scale(screenWidth/5);
    let itemHeight = scale(screenWidth/4);
    let itemHorizontalPadding = (itemWidth/5);
    let itemVerticalPadding = scale(15);

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

    function renderStats(stats, homeTeam, awayTeam) {
        return (
            <View style={{flex:props.ScreenFlex}}>
                <Card>
                    <FlatList
                    showsVerticalScrollIndicator={false}
                    // initialScrollIndex={4}
                    data={stats}
                    renderItem={renderStatItem}
                    keyExtractor={(item,index) => index.toString()}
                    />
                </Card>
            </View>
        );
    };

    function renderNoData(data){

        title="There are no " + data + " available";
        return (
            //title={ () => renderStatsCardTitle(homeTeam,awayTeam)}
            <View style={{flex:props.ScreenFlex}}>
                <Card title={title} >
                <View>
                </View>
                </Card>
            </View>
        );
    }

    function renderEventItem(ev) {
        ev=ev.item;
        return (
            <View style={{ justifyContent: 'space-around'}}>
                <Text style={{flex:1, alignSelf: 'center',  textAlign:'center'}}>{ev.elapsed}' {ev.player} {ev.detail}</Text>
            </View>
        );
    };

    function renderEvents(events){
        if(!events){
            return renderNoData('Events');
        }
        return (
            //title={ () => renderStatsCardTitle(homeTeam,awayTeam)}
            <View style={{flex:props.ScreenFlex}}>
                <Card>
                    <FlatList
                    showsVerticalScrollIndicator={false}
                    // initialScrollIndex={4}
                    data={events}
                    renderItem={renderEventItem}
                    keyExtractor={(item,index) => index.toString()}
                    />
                </Card>
            </View>
        );
    }

    function renderLineupItem(player) {
        player=player.item;
        return (
            <View style={{ justifyContent: 'space-around'}}>
                <Text style={{flex:1}}>{player.pos} {player.player}</Text>
            </View>
        );
    };

    function renderLineupCards(team) {
        team = team.item;
        return (
            //title={ () => renderStatsCardTitle(homeTeam,awayTeam)}
            <Card title={team.team}>
            <SectionList
                sections={[
                 { title: 'Starting', data: team.starting },
                 { title: 'Substitutes', data: team.subs },
                ]}
                renderSectionHeader={ ({section}) => <Text> { section.title } </Text> }
                renderItem={renderLineupItem}
                keyExtractor={ (item, index) => item+index.toString() }
                />
            </Card>
        );
    };

    function renderLineups(lineups){
        if(!lineups){
            return renderNoData('Lineups');
        }
        return (
            <View style={{flex:props.ScreenFlex}}>
                <FlatList
                showsVerticalScrollIndicator={false}
                // initialScrollIndex={4}
                data={lineups}
                renderItem={renderLineupCards}
                keyExtractor={(item,index) => index.toString()}
                />
            </View>
        );
    }

    fixture = props.data[0];

    if(props.currentTab == 0){
        return renderStats(fixture.stats, fixture.homeTeam, fixture.awayTeam);
    }else if(props.currentTab == 1){
        return renderEvents(fixture.events);
    }else if(props.currentTab == 2){
        return renderLineups(fixture.lineups);
    }
};
