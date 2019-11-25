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
    console.log(status);
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
                <View style={{flex:1, margin: 5}}>
                    <Image
                    style={{flex:2}}
                    resizeMode={"contain"}
                    source={{ uri: homeLogo }}
                    />
                    <Text style={{flex:1, textAlign:'center'}}>{homeName}</Text>
                </View>

                <View style={{flex:1, margin: 5, alignItems:'center', justifyContent:'center'}}>
                    <Text>{status}</Text>
                </View>

                <View style={{flex:1, margin: 5}}>
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
                style={{flex:1, borderBottomWidth:statsBorder}}
                >
                <Text style={{textAlign: 'center'}}>Stats</Text>
                </TouchableHighlight>

                <TouchableHighlight onPress={() => props.setTab(1)}
                    style={{flex:1, alignItems: 'center', borderBottomWidth:eventsBorder}}
                    >
                <Text style={{textAlign:'center'}}>Events</Text>
                </TouchableHighlight>

                <TouchableHighlight onPress={() => props.setTab(2)}
                style={{flex:1, borderBottomWidth:lineupBorder}}
                >
                <Text style={{textAlign: 'center'}}>Line-Up</Text>
                </TouchableHighlight>
            </View>
        </View>
    );
}
