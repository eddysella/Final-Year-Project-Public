import React from 'react';
import { removeLeagueFromFollowing, removeTeamFromFollowing  } from '../../redux/creators/following'
import { connect } from 'react-redux'
import { Main } from '../../screens/following/Following';
import header from '../../screens/styles/header';

const mapStateToProps = state => ({
  teamIDs: state.followingTeamIDs,
  leagueIDs: state.followingLeagueIDs,
  teams: state.teamsByID,
  leagues: state.leaguesByID,
})

const mapDispatchToProps = dispatch => ({
  removeTeam: input => dispatch(removeTeamFromFollowing(input)),
  removeLeague: input => dispatch(removeLeagueFromFollowing(input)),
})

const Screen = ({teamIDs, leagueIDs, teams, leagues, removeTeam, removeLeague, ...props}) => (
  <Main screenFlex={7} topBarFlex={1} teamIDs={teamIDs} leagueIDs={leagueIDs}
  teams={teams} leagues={leagues} removeTeam={removeTeam}
  removeLeague={removeLeague} navigation={props.navigation}/>
)

Screen.navigationOptions = () => ({
  title: "Following",
  headerStyle: header.headerStyle,
  headerTitleStyle: header.headerTitleStyle,
  headerTitleContainerStyle: header.headerTitleContainerStyle,
})

export default connect(mapStateToProps,mapDispatchToProps)(Screen);
