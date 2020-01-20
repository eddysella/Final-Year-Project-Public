import {
  REQUEST_LEAGUE_SEARCH,
  RECEIVE_LEAGUE_SEARCH,
  REQUEST_TEAM_SEARCH,
  RECEIVE_TEAM_SEARCH,
} from '../action/types/types'

export function teamSearch( state = {}, action ){
  switch(action.type){
    case REQUEST_TEAM_SEARCH:
      return [];
    case RECEIVE_TEAM_SEARCH:
      return state.filter(function(value, index, arr){
        return [...state, action.teamIDs];
      });
      return
    default:
      return state;
  }
}

export function teamSearch( state = {}, action ){
  switch(action.type){
    case REQUEST_LEAGUE_SEARCH:
      return [];
    case RECEIVE_LEAGUE_SEARCH:
      return state.filter(function(value, index, arr){
        return [...state, action.leagueIDs];
      });
      return
    default:
      return state;
  }
}

export function search(
  state = {
    teamIsFetching: false,
    leagueIsFetching: false,
  },
  action
  ){
  switch(action.type){
    case REQUEST_LEAGUE_SEARCH:
      return Object.assign({}, state, {
        leagueIsFetching: true,
      })
    case RECEIVE_LEAGUE_SEARCH:
      return Object.assign({
        leagueIsFetching: false,
    });
    case REQUEST_TEAM_SEARCH:
      return Object.assign({}, state, {
        teamIsFetching: true,
      })
    case RECEIVE_TEAM_SEARCH:
      return Object.assign({
        teamIsFetching: false,
    });
    default:
      return state;
  }
}
