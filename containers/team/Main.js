import React from 'react';
import { connect } from 'react-redux'
import { fetchLeaguesForTeam, fetchPastFixtures, fetchFutureFixtures, fetchPlayers } from '../../redux/creators/teams'
import { fetchTeamStatistics, fetchPlayerStatistics} from '../../redux/creators/statistics'
import { initTeam } from '../../redux/creators/fixtures'
import { Main } from '../../screens/team/Main';

const mapStateToProps = state => ({
  teams: state.teamsByID,
  teamStats: state.teamStatsByLeague,
  players: state.playersByID,
  leagues: state.leaguesByID,
  standings: state.standingsSpecific,
  fetching: state.teamsByID['fetching'],
});

const mapDispatchToProps = dispatch => ({
  fetchLeagues: input => dispatch(fetchLeaguesForTeam(input)),
  fetchPastFixtures: input => dispatch(fetchPastFixtures(input)),
  fetchFutureFixtures: input => dispatch(fetchFutureFixtures(input)),
  fetchPlayers: input => dispatch(fetchPlayers(input)),
  initFixtures: (input) => dispatch(initTeam(input)),
})

const Screen = ({teams, teamStats, players, fetchLeagues, fetchPastFixtures,
  fetchFutureFixtures, fetchPlayers, leagues,initFixtures, standings, fetching, ...props}) => (
  <Main screenFlex={7} topBarFlex={1} teams={teams} teamStats={teamStats}
  players={players} fetchLeagues={fetchLeagues} fetchPastFixtures={fetchPastFixtures}
  fetchFutureFixtures={fetchFutureFixtures} fetchPlayers={fetchPlayers} leagues={leagues}
  standings={standings} fetching={fetching} initFixtures={initFixtures} navigation={props.navigation}/>
)

Screen.navigationOptions = (props) => ({
  title: props.navigation.getParam('name')
})

export default connect(mapStateToProps,mapDispatchToProps)(Screen);
