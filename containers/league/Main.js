import React from 'react';
import { connect } from 'react-redux'
import { fetchTeams } from '../../redux/creators/leagues'
import { fetchStandings, } from '../../redux/creators/standings'
import { initLeague } from '../../redux/creators/fixtures'
import { Main } from '../../screens/league/Main';

const mapStateToProps = state => ({
    leagues: state.leaguesByID,
    teams: state.teamsByID,
    standings: state.standingsByLeagueID,
    fetchingExtraLeagueData: state.leaguesByID['fetching'],
    fetchingStandings: state.standingsByLeagueID['fetching'],
});

const mapDispatchToProps = dispatch => ({
  fetchTeams: input => dispatch(fetchTeams(input)),
  fetchStandings: input => dispatch(fetchStandings(input)),
  initFixtures: (input) => dispatch(initLeague(input)),
})

const Screen = ({leagues, teams, standings, fetchingExtraLeagueData, fetchingStandings,
  fetchStandings, fetchTeams,initFixtures, ...props}) => (
  <Main screenFlex={7} topBarFlex={1} leagues={leagues} teams={teams}
  fetchingExtraLeagueData={fetchingExtraLeagueData} fetchingStandings={fetchingStandings}
  standings={standings} fetchStandings={fetchStandings} fetchTeams={fetchTeams}
  initFixtures={initFixtures} navigation={props.navigation}/>
)

Screen.navigationOptions = (props) => ({
  title: props.navigation.getParam('name')
})

export default connect(mapStateToProps,mapDispatchToProps)(Screen);
