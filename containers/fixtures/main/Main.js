import React from 'react';
import { setFixturesByDate } from '../../../redux/action/creators/creators'
import { connect } from 'react-redux'
import { Screen } from '../../../screens/fixtures/main/Index';

const mapStateToProps = state => {



  return {fixtures: state.fixturesDisplayed};
}

const mapDispatchToProps = dispatch => {
  return {setFixtures: date => {dispatch(setFixturesByDate(date))}};
}

export default connect(mapStateToProps,mapDispatchToProps)(Screen);
