import React, { PureComponent } from 'react';
import { Button, BackHandler, AsyncStorage, ScrollView, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import SquareGrid from "react-native-square-grid";
import { Avatar } from 'react-native-elements';
import { getAllFixturesByDate } from '../fetch/Fixtures';
import { FixturesScreen } from '../screens/Fixtures';
import FixturesTopBarContainer from '../containers/FixturesTopBarContainer';

export default class FixturesContainer extends PureComponent {
    constructor(props){
        super(props);
    }

    state = {
        loading: true,
        leagueNames: undefined,
        leagueFixtures: undefined,
    }

    static navigationOptions = {
        title: 'Fixtures',
    };

    componentDidMount() {
        this.setFixtures();
    }

    setFixtures(passedDate){
        dateString=undefined;
        const date = new Date();
        date.setDate(date.getDate());
        if(!passedDate){
            var dd = String(date.getDate()).padStart(2, '0');
            var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
            var year = String(date.getFullYear());
            dateString = year + '-' + mm + '-' + dd;
        }else{
            var year = String(date.getFullYear());
            dateString = year + '-' + passedDate.split('/').join('-');
        }

        console.log(dateString);

        collect={};

        getAllFixturesByDate( dateString ).then( data => {
            data = data.api;
            fixtures = data.fixtures;
            fixtures.forEach( fixture => {
                league = fixture.league;
                leagueName = league.name;
                if (!(leagueName in collect)) {
                    collect[leagueName] = [];
                }
                collect[leagueName].push({
                    flag:league.logo,
                    id:fixture.fixture_id,
                    status:fixture.statusShort,
                    elapsed:fixture.elapsed,
                    homeTeam:fixture.homeTeam,
                    awayTeam:fixture.awayTeam,
                    goalsHome:fixture.goalsHomeTeam,
                    goalsAway:fixture.goalsAwayTeam,
                });
            });

            collectNames=[];
            collectFixtures=[];
            for (league in collect) {
                collectNames.push(league);
                collectFixtures.push(collect[league]);
            }

            this.setState({
                leagueNames: collectNames,
                leagueFixtures: collectFixtures,
                loading: false,
            });
        });
    }

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
                    <FixturesTopBarContainer TopBarFlex={1} setFixtures={this.setFixtures.bind(this)}/>
                    <FixturesScreen ScreenFlex={8} navigation={this.props.navigation} leagueNames={this.state.leagueNames} leagueFixtures={this.state.leagueFixtures}/>
                </View>
            );
        }
    }
}
