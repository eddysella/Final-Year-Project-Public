import { combineReducers } from 'redux'
import { fixturesStatus, fixturesByID} from './fixturesV2'
import { followingLeagueIDs, followingTeamIDs, } from './following'
import { leaguesByID, } from './leagues'
import { playersByID, } from './players'
import { search, searchInput} from './search'
import { standingsLeagueIDs, standingsSpecific, } from './standings'
import { playerStatsByID, } from './statistics'
import { teamsByID, } from './teams'

export default combineReducers({
  fixturesStatus,
  fixturesByID,
  // fixturesSpecific,
  followingLeagueIDs,
  followingTeamIDs,
  leaguesByID,
  playersByID,
  searchInput,
  search,
  standingsLeagueIDs,
  standingsSpecific,
  // teamStatsByLeague,
  playerStatsByID,
  teamsByID,
})
