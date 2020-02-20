import {
  SEARCH_UPDATE_INPUT,
  SEARCH_CLEAR_LEAGUE,
  SEARCH_CLEAR_TEAM,
  SEARCH_REQUEST_LEAGUE_SEARCH,
  SEARCH_RECEIVE_LEAGUE_SEARCH,
  SEARCH_REQUEST_TEAM_SEARCH,
  SEARCH_RECEIVE_TEAM_SEARCH,
} from '../types/search'

export function searchInput( state = "", action ){
  switch(action.type){
    case SEARCH_UPDATE_INPUT:
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
    case SEARCH_REQUEST_LEAGUE_SEARCH:
      return Object.assign({}, state, {
        leagueIsFetching: true,
        leagueIDs: [],
      })
    case SEARCH_RECEIVE_LEAGUE_SEARCH:
      return Object.assign({}, state, {
        leagueIsFetching: false,
        leagueIDs: action.leagueIDs,
    });
    case SEARCH_CLEAR_LEAGUE:
      return Object.assign({}, state, {
        leagueIDs: [],
    });
    case SEARCH_REQUEST_TEAM_SEARCH:
      return Object.assign({}, state, {
        teamIsFetching: true,
        teamIDs: [],
      })
    case SEARCH_RECEIVE_TEAM_SEARCH:
      return Object.assign({}, state, {
        teamIsFetching: false,
        teamIDs: action.teamIDs,
    });
    case SEARCH_CLEAR_TEAM:
      return Object.assign({}, state, {
        teamIDs: [],
    });
    default:
      return state;
  }
}
