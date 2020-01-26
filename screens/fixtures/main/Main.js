import React, { useEffect, } from 'react';
import { ExpoConfigView } from '@expo/samples';
import {TouchableHighlight, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import {Card} from 'react-native-elements';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export const Main = props => {

  let listRef = React.createRef();

  useEffect(() => {
    this.flatListRef.scrollToIndex({index:0});
  })

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

        return (
            <TouchableHighlight onPress={ () =>
                {
                  props.fetchSpecificFixture(fixture.id);
                  props.navigation.navigate('Inner');
              }
            }>

                    <View  width={itemWidth} flexDirection={'row'} style={{ justifyContent: 'space-around'}}>
                        <Text style={{flex:1,   textAlign:'center'}}>{fixture.homeTeam.team_name}</Text>
                        <Text style={{flex:1, alignSelf: 'center',  textAlign:'center'}}>{status}</Text>
                        <Text style={{flex:1,   textAlign:'center'}}>{fixture.awayTeam.team_name}</Text>
                    </View>
                </TouchableHighlight>
            );
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

    if(props.isFetching){
      return (
        <View style={{flex:1}}>
          <ActivityIndicator/>
        </View>
      );
    }else{
      return (
          <View style={{flex:props.screenFlex}}>
              <FlatList
              ItemSeparatorComponent={ItemSeparator}
              // showsVerticalScrollIndicator={false}
              // initialScrollIndex={4}
              ref={(ref) => { this.flatListRef = ref; }}
              initialNumToRender={3}
              data={props.leagueFixtures}
              renderItem={renderCards}
              keyExtractor={(item,index) => index.toString()}
              />
          </View>
      );
    }
};
