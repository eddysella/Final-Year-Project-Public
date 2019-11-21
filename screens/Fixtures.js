import React, {Component} from 'react';
import { ExpoConfigView } from '@expo/samples';
import {Button, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import {Card} from 'react-native-elements';

export const FixturesScreen = props => {

    function renderItem(fixture) {
        fixture = fixture.item;

        return (
            <View flexDirection={'row'} style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text>{fixture.id}</Text>
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
                    keyExtractor={(item,index) => item.id}
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
