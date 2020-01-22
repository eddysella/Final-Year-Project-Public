import {
  REQUEST_LEAGUE_SEARCH,
  RECEIVE_LEAGUE_SEARCH,
  REQUEST_TEAM_SEARCH,
  RECEIVE_TEAM_SEARCH,
} from '../types'

export function searchTeam( state = {}, action ){
  switch(action.type){
    case REQUEST_TEAM_SEARCH:
      return [];
    case RECEIVE_TEAM_SEARCH:
      return [...state, ...action.teamIDs]
    default:
      return state;
  }
}

export function searchLeague( state = {}, action ){
  switch(action.type){
    case REQUEST_LEAGUE_SEARCH:
      return [];
    case RECEIVE_LEAGUE_SEARCH:
      return [...state, ...action.leagueIDs];
    default:
      return state;
  }
}

export function searchStatus(
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
      return Object.assign({}, state, {
        leagueIsFetching: false,
    });
    case REQUEST_TEAM_SEARCH:
      return Object.assign({}, state, {
        teamIsFetching: true,
      })
    case RECEIVE_TEAM_SEARCH:
      return Object.assign({}, state, {
        teamIsFetching: false,
    });
    default:
      return state;
  }
}
