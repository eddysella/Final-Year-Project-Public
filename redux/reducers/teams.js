import {
  REQUEST_TEAM_BY_ID,
  RECEIVE_TEAM_BY_ID,
  ADD_PLAYER_IDS_TO_TEAM,
  ADD_LEAGUE_IDS_TO_TEAM,
  RECEIVE_MULTIPLE_TEAMS,
} from '../action/types/types'

function team(
  state = {
    isFetching: false,
    teamName: '',
    logo: '',
    leagueIDs: [],
    playerIDs: [],
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
    case RECEIVE_MULTIPLE_TEAMS:
      return Object.assign({}, state, action.teams);
    default:
      return state;
  }
}
