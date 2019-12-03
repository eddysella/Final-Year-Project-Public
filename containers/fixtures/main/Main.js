import React from 'react';
import { fetchFixturesByDate } from '../../../redux/action/creators/creators'
import { connect } from 'react-redux'
import { Screen } from '../../../screens/fixtures/main/Index';

const mapStateToProps = state => {
  collectNames=[];
  collectFixtures=[];
  for (league in state.fixturesByDate) {
      collectNames.push(league);
      collectFixtures.push(collect[league]);
  }
  return {
    dates: state.fixturesTopbarDates,
    leagueNames: collectNames,
    leagueFixtures: collectFixtures,
  };
}

const mapDispatchToProps = dispatch => {
  return {setFixtures: date => {dispatch(fetchFixturesByDate(date))}};
}

export default connect(mapStateToProps,mapDispatchToProps)(Screen);
