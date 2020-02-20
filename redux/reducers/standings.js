import {
  STANDINGS_REQUEST_BY_LEAGUE_ID,
  STANDINGS_RECEIVE_BY_LEAGUE_ID,
} from '../types/standings'

function standings(
  state = {
    fetching: false,
    lastUpdated: '',
    data: [],
  },
  action
  ){
  switch(action.type){
    case STANDINGS_REQUEST_BY_LEAGUE_ID:
      return Object.assign({}, state, {
        fetching: true,
      });
    case STANDINGS_RECEIVE_BY_LEAGUE_ID:
      return Object.assign({}, state, {
        fetching: false,
        data: action.data,
        lastUpdated: action.lastUpdated,
      });
    default:
      return state;
  }
}

export function standingsByLeagueID(state={
  fetching: false,
}, action){
  switch(action.type){
    case STANDINGS_REQUEST_BY_LEAGUE_ID:
      return Object.assign({}, state, {
        fetching: true,
        [action.leagueID]: standings(state[action.leagueID], action),
      });
    case STANDINGS_RECEIVE_BY_LEAGUE_ID:
      return Object.assign({}, state, {
        fetching: false,
        [action.leagueID]: standings(state[action.leagueID], action),
      });
    default:
      return state;
  }
}
