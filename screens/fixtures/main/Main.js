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
    count=0;

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

    function renderItem(fixture) {
        fixture = fixture.item;
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
            status = String(fixture.goalsHome + "  " + fixture.status + "'  " + fixture.goalsAway);
        }else if (['1H','2H','ET','P'].includes(fixture.status)){
            status = String(fixture.goalsHome + "  " + fixture.elapsed + "'  " + fixture.goalsAway);
        }

        return (
            <View>
                <TouchableHighlight onPress={() =>
                    { props.navigation.navigate('Inner', {date:fixture.id}); }
                }>

                    <View  width={itemWidth} flexDirection={'row'} style={{ justifyContent: 'space-around'}}>
                        <Text style={{flex:1}}>{fixture.homeTeam.team_name}</Text>
                        <Text style={{flex:1, alignSelf: 'center',  textAlign:'center'}}>{status}</Text>
                        <Text style={{flex:1}}>{fixture.awayTeam.team_name}</Text>
                    </View>
                </TouchableHighlight>
                <ItemSeparator/>
            </View>
            );
            // <Image>
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
