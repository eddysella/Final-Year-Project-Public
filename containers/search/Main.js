import React from 'react';
import { addLeagueToStandings, removeLeagueFromStandings } from '../../redux/creators/standings'
import { addLeagueToFollowing, removeLeagueFromFollowing,
  addTeamToFollowing, removeTeamFromFollowing  } from '../../redux/creators/following'
import { search, clear, updateSearchInput} from '../../redux/creators/search'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Main } from '../../screens/search/Main'
import { TopBar } from '../../screens/search/TopBar'
import header from '../../screens/styles/header';

const mapStateToProps = state => ({
  followingTeamIDs: state.followingTeamIDs,
  followingLeagueIDs: state.followingLeagueIDs,
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
  search: input => dispatch(search(input)),
  clear: () => dispatch(clear()),
  update: input => dispatch(updateSearchInput(input)),
})

const Screen = ({followingTeamIDs, followingLeagueIDs,teamIDs,
   leagueIDs, teams, leagues, teamStatus, leagueStatus, followingAddTeam,
   followingRemoveTeam, followingAddLeague, followingRemoveLeague,
   search, clear, update, input, ...props}) => (
  <View style={{flex:1}}>
    <TopBar topBarFlex={1} search={search} clear={clear} update={update} input={input} navigation={props.navigation}/>
    <Main screenFlex={6} followingTeamIDs={followingTeamIDs}
    followingLeagueIDs={followingLeagueIDs}
    teamIDs={teamIDs} leagueIDs={leagueIDs} teams={teams} leagues={leagues}
    teamStatus={teamStatus} leagueStatus={leagueStatus} followingAddTeam={followingAddTeam}
    followingRemoveTeam={followingRemoveTeam} followingAddLeague={followingAddLeague}
    followingRemoveLeague={followingRemoveLeague} navigation={props.navigation}/>
  </View>
)

Screen.navigationOptions = () => ({
  title: "Search",
  headerStyle: header.headerStyle,
  headerTitleStyle: header.headerTitleStyle,
  headerTitleContainerStyle: header.headerTitleContainerStyle,
})

export default connect(mapStateToProps,mapDispatchToProps)(Screen);
