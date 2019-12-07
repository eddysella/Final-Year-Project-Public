import React,{Component}from 'react';
import { fetchFixturesByDate,fetchSpecificFixture } from '../../../redux/action/creators/creators'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { TopBar } from '../../../screens/fixtures/main/TopBar';
import {Main} from '../../../screens/fixtures/main/Main';

const mapStateToProps = state => ({
    dates: state.fixturesTopbarDates,
    leagueNames: state.fixturesByDate[state.fixturesCurrentDate]['leagueNames'],
    fixturesInOrder: state.fixturesByDate[state.fixturesCurrentDate]['fixturesInOrder'],
})

const mapDispatchToProps = dispatch => ({
  setFixtures: date => dispatch(fetchFixturesByDate(date)),
  fetchSpecificFixture: id => dispatch(fetchSpecificFixture(id)),
})

const Screen = ({setFixtures, dates, leagueNames, fixturesInOrder}) => (
  <View style={{flex:1}}>
    <TopBar topBarFlex={1} setFixtures={setFixtures} dates={dates}/>
    <Main screenFlex={8} leagueNames={leagueNames} leagueFixtures={fixturesInOrder}/>
  </View>
)


export default connect(mapStateToProps,mapDispatchToProps)(Screen);
