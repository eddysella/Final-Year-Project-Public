import React, { PureComponent } from 'react';
import { Button, BackHandler, AsyncStorage, ScrollView, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import SquareGrid from "react-native-square-grid";
import { Avatar } from 'react-native-elements';
import { getLeagueByID } from '../fetch/League';
import { FixturesScreen } from '../screens/Fixtures';
import FixturesTopBarContainer from '../containers/FixturesTopBarContainer';

export default class FixturesContainer extends PureComponent {
    constructor(props){
        super(props);
    }

    state = {
        loading: true,
    }

    static navigationOptions = {
        title: 'Fixtures',
    };

    render(){
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1}}>
                    <ActivityIndicator />
                </View>
            );
        }else{
            return (
                <View style={{ flex: 1}}>
                    <FixturesTopBarContainer TopBarFlex={1}/>
                    <FixturesScreen ScreenFlex={8}/>
                </View>
            );
        }
    }
}
