import { combineReducers } from 'redux'
import { fixturesByDate, fixturesTopbarDates, fixturesCurrentDate, fixturesSpecific, fixturesNextTenByTeam} from './fixtures'
import { followingLeagueIDs, followingTeamIDs, } from './following'
import { leaguesByID, } from './leagues'
import { searchTeam, searchLeague, searchStatus} from './standings'
import { standingsByLeague, standingsSpecific, } from './standings'
import { teamStatsByLeague, playerStatsByPlayerID, } from './statistics'
import { teamsByID, } from './teams'

export default combineReducers({
  fixturesTopbarDates,
  fixturesByDate,
  fixturesCurrentDate,
  fixturesSpecific,
  fixturesNextTenByTeam,
  followingLeagueIDs,
  followingTeamIDs,
  leaguesByID,
  searchTeam,
  searchLeague,
  searchStatus,
  standingsByLeague,
  standingsSpecific,
  teamStatsByLeague,
  playerStatsByPlayerID,
  teamsByID,
})
