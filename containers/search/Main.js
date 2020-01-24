import React,{ Component }from 'react';
import { addLeagueToStandings, removeLeagueFromStandings } from '../../redux/creators/standings'
import { addLeagueToFollowing, removeLeagueFromFollowing,
  addTeamToFollowing, removeTeamFromFollowing  } from '../../redux/creators/following'
import { search, clear} from '../../redux/creators/search'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Main } from '../../screens/search/Search';

const mapStateToProps = state => ({
    followingTeamIDs: state.followingTeamIDs,
    followingLeagueIDs: state.followingLeagueIDs,
    standingsLeagueIDs: state.standingsLeagueIDs,
    teamIDs: state.searchTeam,
    leagueIDs: state.searchLeague,
    teams: state.teamsByID,
    leagues: state.leaguesByID,
    teamStatus: state.searchStatus['teamIsFetching'],
    leagueStatus: state.searchStatus['leagueIsFetching'],
})

const mapDispatchToProps = dispatch => ({
  followingAddTeam: input => dispatch(addTeamToFollowing(input)),
  followingRemoveTeam: input => dispatch(removeTeamFromFollowing(input)),
  followingAddLeague: input => dispatch(addLeagueToFollowing(input)),
  followingRemoveLeague: input => dispatch(removeLeagueFromFollowing(input)),
  standingsAddLeague: input => dispatch(addLeagueToStandings(input)),
  standingsRemoveLeague: input => dispatch(removeLeagueFromStandings(input)),
  search: input => dispatch(search(input)),
  clear: () => dispatch(clear()),
})

const Screen = ({followingTeamIDs, followingLeagueIDs, standingsLeagueIDs, teamIDs,
   leagueIDs, teams, leagues, teamStatus, leagueStatus, followingAddTeam,
   followingRemoveTeam, followingAddLeague, followingRemoveLeague,
   standingsAddLeague, standingsRemoveLeague, search, clear, ...props}) => (
  <View style={{flex:1}}>
    <Main screenFlex={9} topBarFlex={1} followingTeamIDs={followingTeamIDs}
    followingLeagueIDs={followingLeagueIDs} standingsLeagueIDs={standingsLeagueIDs}
    teamIDs={teamIDs} leagueIDs={leagueIDs} teams={teams} leagues={leagues}
    teamStatus={teamStatus} leagueStatus={leagueStatus} followingAddTeam={followingAddTeam}
    followingRemoveTeam={followingRemoveTeam} followingAddLeague={followingAddLeague}
    followingRemoveLeague={followingRemoveLeague} standingsAddLeague={standingsAddLeague}
    standingsRemoveLeague={standingsRemoveLeague} search={search} clear={clear}
    navigation={props.navigation}/>
  </View>
)


export default connect(mapStateToProps,mapDispatchToProps)(Screen);
