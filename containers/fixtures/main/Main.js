import React,{Component}from 'react';
import { fetchFixturesByDate } from '../../../redux/action/creators/creators'
import { connect } from 'react-redux'
import { Screen } from '../../../screens/fixtures/main/Index'

const mapStateToProps = state => ({
    dates: state.fixturesTopbarDates,
    leagueNames: state.fixturesByDate[state.currentDate]['leagueNames'],
    leagueFixtures: state.fixturesByDate[state.currentDate]['leagueFixtures'],
})

const mapDispatchToProps = dispatch => ({
  setFixtures: date => dispatch(fetchFixturesByDate(date)),
})

export default connect(mapStateToProps,mapDispatchToProps)(Screen);
