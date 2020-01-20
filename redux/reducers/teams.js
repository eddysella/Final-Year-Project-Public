import {
  REQUEST_TEAM_BY_ID,
  RECEIVE_TEAM_BY_ID,
  ADD_PLAYER_IDS_TO_TEAM,
  ADD_LEAGUE_IDS_TO_TEAM,
} from '../action/types/types'

- statistics:
  - add types for add team statistics for key:leagueID+teamID
    - fetch:getStatisticsForTeamInLeague
  - add types for add player statistics for key:playerID
    - fetch:getPlayerStatisticsByTeamID

function team(
  state = {
    isFetching: false,
    teamID: '',
    teamName: '',
    leagueIDs: [],
    playerIDs: [],
    logo: '',
  },
  action
  ){
  switch(action.type){
    case REQUEST_TEAM_BY_ID:
      return Object.assign({}, state, {
        teamID: action.teamID,
        isFetching: true,
      })
    case RECEIVE_TEAM_BY_ID:
    return Object.assign({
      isFetching: false,
      teamName: action.teamName,
      logo: action.logo,
    });
    case ADD_PLAYER_IDS_TO_TEAM:
    return Object.assign({
      playerIDs: action.playerIDs,
    });
    case ADD_LEAGUE_IDS_TO_TEAM:
    return Object.assign({
      leagueIDs: action.leagueIDs,
    });
    default:
      return state;
  }
}

export function teamsByID(state={}, action){
  switch(action.type){
    case REQUEST_TEAM_BY_ID:
    case RECEIVE_TEAM_BY_ID:
    case ADD_PLAYER_IDS_TO_TEAM:
    case ADD_LEAGUE_IDS_TO_TEAM:
      return Object.assign({}, state, {
        [action.teamID]: team(state[action.teamID], action)
        });
    default:
      return state;
  }
}
