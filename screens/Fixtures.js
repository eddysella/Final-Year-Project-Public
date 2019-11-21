import React, {Component} from 'react';
import { ExpoConfigView } from '@expo/samples';
import {Button, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import {Card} from 'react-native-elements';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export const FixturesScreen = props => {

    let itemWidth = screenWidth - scale(screenWidth/5);
    let itemHorizontalPadding = (itemWidth/5);
    let itemVerticalPadding = scale(15);

    function renderItem(fixture) {
        fixture = fixture.item;
        console.log(fixture.homeTeam.team_name);

        return (
            // displays dimensions but blank text!ASDNLKASNFLKNADLFKN
            <View width={itemWidth} flexDirection={'row'} style={{justifyContent: 'space-around', alignItems: 'stretch'}}>
                <Text style={{borderWidth: 1}}>{fixture.homeTeam.team_name}</Text>
                <Text style={{alignSelf: 'center', borderWidth: 1}}>{fixture.status}</Text>
                <Text style={{borderWidth: 1}}>{fixture.awayTeam.team_name}</Text>
            </View>
            );
            // <Image
            // style={styles.image}
            // resizeMode="cover"
            // source={{ uri: u.avatar }}
            // />
            // <Text style={styles.name}>{u.name}</Text>
    };

    function renderCards(league) {
        return (
            <Card title={props.leagueNames[league.index]}>
            {
                <View key={props.leagueNames[league.index]} style={{justifyContent: 'center', alignItems: 'center'}}>
                    <FlatList
                    // showsVerticalScrollIndicator={false}
                    // initialScrollIndex={4}
                    data={league.item}
                    renderItem={renderItem}
                    keyExtractor={(item,index) => item.id.toString()}
                    />
                </View>
            }
            </Card>
        );
    };

    return (
        <View style={props.ScreenFlex}>
            <FlatList
            // showsVerticalScrollIndicator={false}
            // initialScrollIndex={4}
            data={props.leagueFixtures}
            renderItem={renderCards}
            keyExtractor={(item,index) => index.toString()}
            />
        </View>
    );

};
