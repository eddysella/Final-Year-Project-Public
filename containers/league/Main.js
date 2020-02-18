import React,{ Component }from 'react';
import { connect } from 'react-redux'
import { View } from 'react-native'
import { fetchTeams } from '../../redux/creators/leagues'
import { fetchStandings, } from '../../redux/creators/standings'
import { fetchFutureLeagueFixtures } from '../../redux/creators/futureFixtures'
import { fetchPastLeagueFixtures } from '../../redux/creators/pastFixtures'
import { Main } from '../../screens/league/Main';

const mapStateToProps = state => ({
    leagues: state.leaguesByID,
    teams: state.teamsByID,
    standings: state.standingsSpecific,
    fetchingExtraLeagueData: state.leaguesByID['fetching'],
    fetchingStandings: state.standingsSpecific['isFetching'],
});

const mapDispatchToProps = dispatch => ({
  fetchTeams: input => dispatch(fetchTeams(input)),
  fetchStandings: input => dispatch(fetchStandings(input)),
})

const Screen = ({leagues, teams, standings, fetchingExtraLeagueData, fetchingStandings,
  fetchStandings, fetchTeams, ...props}) => (
  <Main screenFlex={7} topBarFlex={1} leagues={leagues} teams={teams}
  fetchingExtraLeagueData={fetchingExtraLeagueData} fetchingStandings={fetchingStandings}
  standings={standings} fetchStandings={fetchStandings} fetchTeams={fetchTeams}
  navigation={props.navigation}/>
)

export default connect(mapStateToProps,mapDispatchToProps)(Screen);
