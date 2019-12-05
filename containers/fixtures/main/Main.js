import React, { PureComponent } from 'react';
import { Button, BackHandler, AsyncStorage, ScrollView, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import SquareGrid from "react-native-square-grid";
import { Avatar } from 'react-native-elements';
import { getAllFixturesByDateV1 } from '../../../fetch/Fixtures';
import { Screen } from '../../../screens/fixtures/main/Main';
import TopBarContainer from './TopBar';

export default class Container extends PureComponent {
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
            formatedDate = passedDate.split('/').join('-');
            dateString = year + '-' + formatedDate;
        }

        getAllFixturesByDateV1( dateString ).then( data => {
            collect={};
            data = data.api;
            fixtures = data.fixtures;
            fixtures.forEach( fixture => {
                status='';
                if(fixture.statusShort == 'NS'){
                    var date = new Date(fixture.event_timestamp*1000);
                    // Hours part from the timestamp
                    var hours = date.getHours();
                    // Minutes part from the timestamp
                    var minutes = "0" + date.getMinutes();
                    // Will display time in 10:30:23 format
                    status = hours + ':' + minutes.substr(-2);
                }else if (['HT', 'FT'].includes(fixture.statusShort)){
                    status = String(fixture.goalsHomeTeam + "  " + fixture.statusShort + "  " + fixture.goalsAwayTeam);
                }else if (['1H','2H','ET','P'].includes(fixture.statusShort)){
                    status = String(fixture.goalsHomeTeam + "  " + fixture.elapsed + "'  " + fixture.goalsAwayTeam);
                }else{
                  status = fixture.status;
                }
                league = fixture.league;
                leagueName = league.country + " " + league.name;
                if (!(leagueName in collect)) {
                    collect[leagueName] = [];
                }
                collect[leagueName].push({
                    flag:league.logo,
                    id:fixture.fixture_id,
                    timeStamp:fixture.event_timestamp,
                    status:status,
                    elapsed:fixture.elapsed,
                    homeTeam:fixture.homeTeam,
                    awayTeam:fixture.awayTeam,
                    goalsHome:String(fixture.goalsHomeTeam),
                    goalsAway:String(fixture.goalsAwayTeam),
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
        if (this.state.loading) {
            return (
                <View style={{ flex: 1}}>
                    <ActivityIndicator />
                </View>
            );
        }else{
            return (
                <View style={{ flex: 1}}>
                    <TopBarContainer TopBarFlex={1} setFixtures={this.setFixtures.bind(this)}/>
                    <Screen ScreenFlex={8} navigation={this.props.navigation} leagueNames={this.state.leagueNames} leagueFixtures={this.state.leagueFixtures}/>
                </View>
            );
        }
    }
}
