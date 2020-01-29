import React,{ Component }from 'react';
import { removeLeagueFromFollowing, removeTeamFromFollowing  } from '../../redux/creators/following'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Main } from '../../screens/following/Following';

const mapStateToProps = state => ({
    teamIDs: state.followingTeamIDs,
    leagueIDs: state.followingLeagueIDs,
    teams: state.teamsByID,
    leagues: state.leaguesByID,
)};

const mapDispatchToProps = dispatch => ({
  removeTeam: input => dispatch(removeTeamFromFollowing(input)),
  removeLeague: input => dispatch(removeLeagueFromFollowing(input)),
})

const Screen = ({teamIDs, leagueIDs, teams, leagues, removeTeam,
  removeLeague, ...props}) => (
  <View style={{flex:1}}>
    <Main teamIDs={teamIDs} leagueIDs={leagueIDs}
    teams={teams} leagues={leagues} removeTeam={removeTeam}
    removeLeague={removeLeague} navigation={props.navigation}/>
  </View>
)


export default connect(mapStateToProps,mapDispatchToProps)(Screen);
