import React,{ Component }from 'react';
import { addLeagueToStandings, removeLeagueFromStandings } from '../../redux/creators/standings'
import { addLeagueToFollowing, removeLeagueFromFollowing,
  addTeamToFollowing, removeTeamFromFollowing  } from '../../redux/creators/following'
import { search, clear, updateSearchInput} from '../../redux/creators/search'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Main } from '../../screens/search/Main'
import { TopBar } from '../../screens/search/TopBar'

const mapStateToProps = state => ({
  followingTeamIDs: state.followingTeamIDs,
  followingLeagueIDs: state.followingLeagueIDs,
  standingsLeagueIDs: state.standingsLeagueIDs,
  teamIDs: state.search['teamIDs'],
  leagueIDs: state.search['leagueIDs'],
  teams: state.teamsByID,
  leagues: state.leaguesByID,
  input: state.searchInput,
  teamStatus: state.search['teamIsFetching'],
  leagueStatus: state.search['leagueIsFetching'],
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
  update: input => dispatch(updateSearchInput(input)),
})

const Screen = ({followingTeamIDs, followingLeagueIDs, standingsLeagueIDs, teamIDs,
   leagueIDs, teams, leagues, teamStatus, leagueStatus, followingAddTeam,
   followingRemoveTeam, followingAddLeague, followingRemoveLeague,
   standingsAddLeague, standingsRemoveLeague, search, clear, update, input, ...props}) => (
  <View style={{flex:1}}>
    <TopBar topBarFlex={1} search={search} clear={clear} update={update} input={input} navigation={props.navigation}/>
    <Main screenFlex={6} followingTeamIDs={followingTeamIDs}
    followingLeagueIDs={followingLeagueIDs} standingsLeagueIDs={standingsLeagueIDs}
    teamIDs={teamIDs} leagueIDs={leagueIDs} teams={teams} leagues={leagues}
    teamStatus={teamStatus} leagueStatus={leagueStatus} followingAddTeam={followingAddTeam}
    followingRemoveTeam={followingRemoveTeam} followingAddLeague={followingAddLeague}
    followingRemoveLeague={followingRemoveLeague} standingsAddLeague={standingsAddLeague}
    standingsRemoveLeague={standingsRemoveLeague} navigation={props.navigation}/>
  </View>
)


export default connect(mapStateToProps,mapDispatchToProps)(Screen);
