import React, { PureComponent } from 'react';
import { Button, BackHandler, AsyncStorage, ScrollView, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import SquareGrid from "react-native-square-grid";
import { TopBar } from '../../screens/fixtures/FixturesTopBar'

export default class Container extends PureComponent {
    constructor(props){
        super(props);
    }

    state = {
        loading: true,
        dates:[],
    }

    setDates() {
        collect=[];
        start = new Date();
        start.setDate(start.getDate() - 5);
        end = new Date();
        end.setDate(end.getDate() + 5);

        date = new Date(start);

        while (date <= end) {
            var dd = String(date.getDate()).padStart(2, '0');
            var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
            collect.push(mm + '/' + dd);

            date.setDate(date.getDate() + 1);
        }

        this.setState({dates:collect});
    }

    componentDidMount(){
        this.setDates();
    }


    render(){

        return (
            <TopBar TopBarFlex={this.props.TopBarFlex} setFixtures={this.props.setFixtures.bind(this)} dates={this.state.dates}/>
        );
    }
}
