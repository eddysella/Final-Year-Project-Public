import React, { PureComponent } from 'react';
import { Button, BackHandler, AsyncStorage, ScrollView, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import SquareGrid from "react-native-square-grid";
import { Avatar } from 'react-native-elements';
import { getFixtureByID } from '../../../fetch/Fixtures';
import { Screen }  from '../../../screens/fixtures/details/Details';
import { TopBar } from '../../../screens/fixtures/details/TopBar';

export default class Container extends PureComponent {
    constructor(props){
        super(props);
    }

    state = {
        loading: true,
        fixtureID:this.props.navigation.state.params.fixtureID,
        fixture:[],
        tabDisplayed:0,
        emptyStats:[],
    }

    createStats(passedStats){
        emptyStats=[]
        stats = [
            'Shots on Goal',
            'Shots off Goal',
            'Total Shots',
            'Blocked Shots',
            'Shots insidebox',
            'Shots outsidebox',
            'Fouls',
            'Corner Kicks',
            'Offsides',
            'Ball Possession',
            'Yellow Cards',
            'Red Cards',
            'Goalkeeper Saves',
            'Total passes',
            'Passes accurate',
            'Passes %',
        ]

        if(!passedStats){
            stats.forEach( stat => {
                emptyStats.push({stat:stat,home:0,away:0});
            });
        }else{
            for (stat in passedStats){
                emptyStats.push({stat:stat,home:passedStats[stat]['home'],away:passedStats[stat]['away']});
            }
        }
        return emptyStats
    }

    createLineups(passedLineups){

        if(!passedLineups){
            return;
        }
        lineups=[]
        passedLineups.forEach(team => {
            collect=[team];
            team.forEach(item => {
                if(item == 'startXI'){
                    collect.push(item);
                }if(item == 'substitutes'){
                    collect.push(item);
                }
            });
            lineups.push(collect);
        });
        return lineups;
    }

    componentDidMount() {
        this.setState({
            fixtureID:this.props.navigation.state.params.fixtureID,
            emptyStats:this.createStats(),
        });

        collect={topBar:[],screen:[]};

        getFixtureByID( String(this.state.fixtureID) ).then( data => {
            status='';
            data = data.api;
            fixtures = data.fixtures;
            fixtures.forEach( fixture => {
                league = fixture.league;
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
                }else if (['1H','2H','ET','P'].includes(fixture.status)){
                    status = String(fixture.goalsHomeTeam + "  " + fixture.elapsed + "'  " + fixture.goalsAwayTeam);
                }
                collect['topBar'].push({
                    leagueName:league.name,
                    id:fixture.fixture_id,
                    timeStamp:fixture.event_timestamp,
                    status:status,
                    elapsed:fixture.elapsed,
                    homeTeam:fixture.homeTeam,
                    awayTeam:fixture.awayTeam,
                    goalsHome:String(fixture.goalsHomeTeam),
                    goalsAway:String(fixture.goalsAwayTeam),
                });
                collect['screen'].push({
                    homeTeam:fixture.homeTeam,
                    awayTeam:fixture.awayTeam,
                    stats:this.createStats(fixture.statistics),
                    events:fixture.events,
                    lineups:this.createLineups(fixture.lineups),
                });
                this.setState({
                    fixture: collect,
                    loading: false,
                });
            });
        });
    }

    setTab(index){
        if (!(index == this.state.tabDisplayed)){
            this.setState({tabDisplayed:index});
        }
    }


    render(){
        if (this.state.loading) {
            return (
                <View style={{ flex: 1}}>
                    <ActivityIndicator />
                </View>
            );
        }
        topBarData=this.state.fixture['topBar'];
        screenData=this.state.fixture['screen'];
        return (
            <View style={{ flex: 1}}>
                <TopBar TopBarFlex={1} currentTab={this.state.tabDisplayed} setTab={this.setTab.bind(this)} data={topBarData} navigation={this.props.navigation}/>
                <Screen ScreenFlex={3} emptyStats={this.state.emptyStats} currentTab={this.state.tabDisplayed} data={screenData} navigation={this.props.navigation} />
            </View>
        );
    }
}
