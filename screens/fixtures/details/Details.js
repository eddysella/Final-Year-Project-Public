import React, {Component} from 'react';
import { ExpoConfigView } from '@expo/samples';
import {TouchableHighlight, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
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
        console.log(stat);
        stat=stat.item
        return (
            <View  width={itemWidth} flexDirection={'row'} style={{ justifyContent: 'space-around'}}>
                <Text style={{flex:1, textAlign: 'center'}}>{stat.home}</Text>
                <Text style={{flex:1, alignSelf: 'center',  textAlign:'center'}}>{stat.stat}</Text>
                <Text style={{flex:1, textAlign: 'center'}}>{stat.away}</Text>
                <ItemSeparator/>
            </View>
        );
    };

    function renderStatsCardTitle(homeTeam, awayTeam){
        return(
            <View flexDirection={'row'} style={{justifyContent: 'space-around'}}>
                <View style={{flex:1}}>
                    <Text style={{flex:1}}>{homeTeam}</Text>
                </View>
                <View style={{flex:1}}>
                    <Text style={{flex:1}}>{awayTeam}</Text>
                </View>
            </View>
        );
    }

    function renderStats(stats, homeTeam, awayTeam) {
        if(!stats){
            return renderStats(props.emptyStats);
        }
        return (
            //title={ () => renderStatsCardTitle(homeTeam,awayTeam)}
            <View style={{flex:props.ScreenFlex}}>
                <Card>
                {
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <FlatList
                        // showsVerticalScrollIndicator={false}
                        // initialScrollIndex={4}
                        data={stats}
                        renderItem={renderStatItem}
                        keyExtractor={(item,index) => index.toString()}
                        />
                    </View>
                }
                </Card>
            </View>
        );
    };

    function renderNoData(data){

        title="There are no " + {data} + " available";
        return (
            //title={ () => renderStatsCardTitle(homeTeam,awayTeam)}
            <View style={{flex:props.ScreenFlex}}>
                <Card title={title} >
                {
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    </View>
                }
                </Card>
            </View>
        );
    }

    function renderEventItem(ev) {
        ev=ev.item;
        return (
            <View style={{ justifyContent: 'space-around'}}>
                <Text style={{flex:1, alignSelf: 'center',  textAlign:'center'}}>{ev.elapsed}' {ev.player} {ev.detail}</Text>
                <ItemSeparator/>
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
                {
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <FlatList
                        // showsVerticalScrollIndicator={false}
                        // initialScrollIndex={4}
                        data={events}
                        renderItem={renderEventItem}
                        keyExtractor={(item,index) => index.toString()}
                        />
                    </View>
                }
                </Card>
            </View>
        );
    }

    function renderLineupItem(lineup) {
        lineup=lineup.item;
        return (
            <View style={{ justifyContent: 'space-around'}}>
                <Text style={{flex:1, alignSelf: 'center',  textAlign:'center'}}>{ev.elapsed}' {ev.player} {ev.detail}</Text>
                <ItemSeparator/>
            </View>
        );
    };

    function renderLineups(lineups){
        if(!events){
            return renderNoData('Lineups');
        }
        return (
            //title={ () => renderStatsCardTitle(homeTeam,awayTeam)}
            <View style={{flex:props.ScreenFlex}}>
                <Card>
                {
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <FlatList
                        // showsVerticalScrollIndicator={false}
                        // initialScrollIndex={4}
                        data={lineups}
                        renderItem={renderLineupItem}
                        keyExtractor={(item,index) => index.toString()}
                        />
                    </View>
                }
                </Card>
            </View>
        );
    }

    fixture = props.data[0];
    data=[];

    if(props.currentTab == 0){
        return renderStats(fixture.stats, fixture.homeTeam, fixture.awayTeam);
    }else if(props.currentTab == 1){
        return renderEvents(fixture.events);
    }else if(props.currentTab == 2){
        return renderLineups(fixture.lineups);
    }
};
