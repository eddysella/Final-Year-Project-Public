import {
  UPDATE_SEARCH_INPUT,
  CLEAR_LEAGUE_SEARCH,
  CLEAR_TEAM_SEARCH,
  REQUEST_LEAGUE_SEARCH,
  RECEIVE_LEAGUE_SEARCH,
  REQUEST_TEAM_SEARCH,
  RECEIVE_TEAM_SEARCH,
} from '../types'

export function searchInput( state = "", action ){
  switch(action.type){
    case UPDATE_SEARCH_INPUT:
      return action.input;
    default:
      return state;
  }
}

export function search(
  state = {
    teamIsFetching: false,
    teamIDs: [],
    leagueIsFetching: false,
    leagueIDs: [],
  },
  action
  ){
  switch(action.type){
    case REQUEST_LEAGUE_SEARCH:
      return Object.assign({}, state, {
        leagueIsFetching: true,
        leagueIDs: [],
      })
    case RECEIVE_LEAGUE_SEARCH:
      return Object.assign({}, state, {
        leagueIsFetching: false,
        leagueIDs: action.leagueIDs,
    });
    case CLEAR_LEAGUE_SEARCH:
      return Object.assign({}, state, {
        leagueIDs: [],
    });
    case REQUEST_TEAM_SEARCH:
      return Object.assign({}, state, {
        teamIsFetching: true,
        teamIDs: [],
      })
    case RECEIVE_TEAM_SEARCH:
      return Object.assign({}, state, {
        teamIsFetching: false,
        teamIDs: action.teamIDs,
    });
    case CLEAR_TEAM_SEARCH:
      return Object.assign({}, state, {
        teamIDs: [],
    });
    default:
      return state;
  }
}
