import React,{ Component }from 'react';
import { connect } from 'react-redux'
import { View } from 'react-native'
import { fetchLeaguesForTeam, fetchPastFixtures, fetchFutureFixtures, } from '../../redux/creators/teams'
import { fetchTeamStatistics, fetchPlayerStatistics} from '../../redux/creators/statistics'
import { Main } from '../../screens/following/Following';

const mapStateToProps = state => ({
    teams: state.teamsByID,
    teamStats: state.teamStatsByLeague,
    playerStats: state.playerStatsByID,
});

const mapDispatchToProps = dispatch => ({
  fetchLeagues: input => dispatch(fetchLeaguesForTeam(input)),
  fetchPastFixtures: input => dispatch(fetchPastFixtures(input)),
  fetchFutureFixtures: input => dispatch(fetchFutureFixtures(input)),
  fetchPlayers: input => dispatch(fetchPlayerStatistics(input)),
})

const Screen = ({teams, teamStats, playerStats, fetchLeagues, fetchPastFixtures,
  fetchFutureFixtures, fetchPlayers, ...props}) => (
  <View style={{flex:1}}>
    <Main screenFlex={9} topBarFlex={1} teams={teams} teamStats={teamStats}
    playerStats={playerStats} fetchLeagues={fetchLeagues} fetchPastFixtures={fetchPastFixtures}
    fetchFutureFixtures={fetchFutureFixtures} fetchPlayers={fetchPlayers} navigation={props.navigation}/>
  </View>
)


export default connect(mapStateToProps,mapDispatchToProps)(Screen);
