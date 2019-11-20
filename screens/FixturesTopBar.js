import React, {Component} from 'react';
import { Button, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import SquareGrid from "react-native-square-grid";

export const FixturesTopBar = props => {

    function renderItem(item) {
        return (
            <View style={{flex: 1, borderWidth: 3, paddingHorizontal:20, paddingVertical: 10 , alignItems: 'center'}}>
                <Text>
                    {item.item}
                </Text>
            </View>
        );
    };


    return (

        <View style={{flex: 1}}>
            <FlatList
                initialScrollIndex={4}
                horizontal
                // style={{flex:1}}
                data={props.dates}
                renderItem={renderItem}
                keyExtractor={(item,index) => index.toString()}
            />
        </View>
    );

}
