import { combineReducers } from 'redux'
import { fixturesStatus, pastDates, futureDates, fixtureIDsByDateLeague,
fixturesByID, } from './fixturesMain'
import { fixtureIDsByLeagueID } from './fixturesLeague'
import { fixtureIDsByTeamID } from './fixturesTeam'
import { followingLeagueIDs, followingTeamIDs, } from './following'
import { leaguesByID, } from './leagues'
import { playersByID, } from './players'
import { search, searchInput} from './search'
import { standingsByLeagueID, } from './standings'
import { playerStatsByID, } from './statistics'
import { teamsByID, } from './teams'

export default combineReducers({
  fixturesStatus,
  fixturesByID,
  fixtureIDsByTeamID,
  fixtureIDsByLeagueID,
  fixtureIDsByDateLeague,
  pastDates,
  futureDates,
  followingLeagueIDs,
  followingTeamIDs,
  leaguesByID,
  playersByID,
  searchInput,
  search,
  standingsByLeagueID,
  playerStatsByID,
  teamsByID,
})
