import {
  REQUEST_STANDINGS,
  RECEIVE_STANDINGS,
} from '../types'

function standings(
  state = {
    fetching: false,
    lastUpdated: '',
    data: [],
  },
  action
  ){
  switch(action.type){
    case REQUEST_STANDINGS:
      return Object.assign({}, state, {
        fetching: true,
      });
    case RECEIVE_STANDINGS:
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
    case REQUEST_STANDINGS:
      return Object.assign({}, state, {
        fetching: true,
        [action.leagueID]: standings(state[action.leagueID], action),
      });
    case RECEIVE_STANDINGS:
      return Object.assign({}, state, {
        fetching: false,
        [action.leagueID]: standings(state[action.leagueID], action),
      });
    default:
      return state;
  }
}
