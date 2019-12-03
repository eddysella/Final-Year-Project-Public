import React, { PureComponent } from 'react';
import { Button, BackHandler, AsyncStorage, ScrollView, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import SquareGrid from "react-native-square-grid";
import { TopBar } from '../../../screens/fixtures/main/TopBar';

import { setFixturesByDate } from '../../../redux/action/creators/creators'
import { connect } from 'react-redux'

const mapStateToProps = state => {
  return {
    dates: state.fixturesDates,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setFixtures: date => {dispatch(setFixturesByDate(date))},
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(TopBar);

export default class Container extends PureComponent {
    constructor(props){
        super(props);
    }

    const visibileDates =

    state = {
        loading: true,
        dates:[],
    }

    setDates() {


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
