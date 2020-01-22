import React,{ Component }from 'react';
import { fetchFixturesByDate, } from '../../redux/creators/fixturesMain'
import { fetchSpecificFixture , } from '../../redux/creators/fixturesSpecific'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { TopBar } from '../../screens/fixtures/main/TopBar';
import { Main } from '../../screens/fixtures/main/Main';

const mapStateToProps = state => ({
    dates: state.fixturesTopbarDates,
    leagueNames: state.fixturesByDate[state.fixturesCurrentDate]['leagueNames'],
    fixturesInOrder: state.fixturesByDate[state.fixturesCurrentDate]['fixturesInOrder'],
})

const mapDispatchToProps = dispatch => ({
  setFixtures: date => dispatch(fetchFixturesByDate(date)),
  fetchSpecificFixture: id => dispatch(fetchSpecificFixture(id)),
})

const Screen = ({fetchSpecificFixture, setFixtures, dates, leagueNames, fixturesInOrder, ...props}) => (
  <View style={{flex:1}}>
    <TopBar topBarFlex={1} setFixtures={setFixtures} dates={dates} navigation={props.navigation}/>
    <Main screenFlex={8} fetchSpecificFixture={fetchSpecificFixture} leagueNames={leagueNames} leagueFixtures={fixturesInOrder} navigation={props.navigation}/>
  </View>
)


export default connect(mapStateToProps,mapDispatchToProps)(Screen);
