import React, { PureComponent } from 'react';
import { Button, BackHandler, AsyncStorage, ScrollView, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import SquareGrid from "react-native-square-grid";
import {FixturesTopBar} from '../screens/FixturesTopBar'

export default class FixturesTopBarContainer extends PureComponent {
    constructor(props){
        super(props);
    }

    state = {
        loading: true,
        days: [-5,-4,-3,-2,-1,0,1,2,3,4,5],
    }

    render(){
        collect = [];

        for (day in this.state.days) {
            const date = new Date();
            date.setDate(date.getDate() + day)
            var dd = String(date.getDate()).padStart(2, '0');
            var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
            collect.push(mm + '/' + dd);
        }
        console.log(collect);

        return (
            <FixturesTopBar TopBarFlex={this.props.TopBarFlex} dates={collect}/>
        );
    }
}
