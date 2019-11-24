import React, {Component} from 'react';
import { TouchableHighlight, Image, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import SquareGrid from "react-native-square-grid";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export const TopBar = props => {

    itemWidth = screenWidth/3;

    fixture = props.data[0];
    status = fixture.status;

    if(fixture.status == 'NS'){
        var date = new Date(fixture.timeStamp*1000);
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Will display time in 10:30:23 format
        status = hours + ':' + minutes.substr(-2);
    }else if (['HT', 'FT'].includes(fixture.status)){
        status = String(fixture.goalsHome + "  " + fixture.status + "  " + fixture.goalsAway);
    }else if (['1H','2H','ET','P'].includes(fixture.status)){
        status = String(fixture.goalsHome + "  " + fixture.elapsed + "'  " + fixture.goalsAway);
    }

    homeLogo=fixture.homeTeam['logo'];
    homeName=fixture.homeTeam['team_name'];
    awayLogo=fixture.awayTeam['logo'];
    awayName=fixture.awayTeam['team_name'];

    statsBorder=0;
    eventsBorder=0;
    lineupBorder=0;
    if(props.currentTab == 0){
        statsBorder=2;
    }else if(props.currentTab == 1){
        eventsBorder=2;
    }else if(props.currentTab == 2){
        lineupBorder=2;
    }


    return (
        <View style={{flex:props.TopBarFlex}}>
            <View  flexDirection={'row'} style={{flex:3, justifyContent: 'space-around'}}>
                <View style={{flex:1, margin: 5, padding: 10}}>
                    <Image
                    style={{flex:2}}
                    resizeMode={"contain"}
                    source={{ uri: homeLogo }}
                    />
                    <Text style={{flex:1, textAlign:'center'}}>{homeName}</Text>
                </View>

                <View style={{flex:1, margin: 5, padding: 10, alignItems:'center', justifyContent:'center'}}>
                    <Text>{status}</Text>
                </View>

                <View style={{flex:1, margin: 5, padding: 10}}>
                    <Image
                    style={{flex:2}}
                    resizeMode={"contain"}
                    source={{ uri: awayLogo}}
                    />
                    <Text style={{flex:1, textAlign:'center'}}>{awayName}</Text>
                </View>
            </View>
            <View flexDirection={'row'} style={{flex:1, justifyContent: 'space-around'}}>
                <TouchableHighlight onPress={() => props.setTab(0)}
                style={{flex:1,  margin: 5, padding: 5, borderBottomWidth:statsBorder}}
                >
                <Text style={{textAlign: 'center'}}>Stats</Text>
                </TouchableHighlight>

                <TouchableHighlight onPress={() => props.setTab(1)}
                    style={{flex:1,  margin: 5, padding: 5, alignItems: 'center', borderBottomWidth:eventsBorder}}
                    >
                <Text style={{textAlign:'center'}}>Events</Text>
                </TouchableHighlight>

                <TouchableHighlight onPress={() => props.setTab(2)}
                style={{flex:1,  margin: 5, padding: 5, borderBottomWidth:lineupBorder}}
                >
                <Text style={{textAlign: 'center'}}>Line-Up</Text>
                </TouchableHighlight>
            </View>
        </View>
    );
}
