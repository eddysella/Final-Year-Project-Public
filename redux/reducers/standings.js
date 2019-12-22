import {
  SAVED_STANDINGS,
  REQUEST_STANDINGS_BY_LEAGUE,
  RECEIVE_STANDINGS_BY_LEAGUE,
} from '../action/types/types'

export function standingsByLeague(state={}, action){
  switch(action.type){
    case RECEIVE_STANDINGS_BY_LEAGUE:
    case REQUEST_STANDINGS_BY_LEAGUE:
      return Object.assign({}, state, {
        [action.league]: standings(state[action.league], action)
        });
    default:
      return state;
  }
}

function standings(
  state = {
    isFetching: false,
    league: '',
    teamNames: [],
    standingsInOrder: [],
  },
  action
  ){
  switch(action.type){
    case REQUEST_STANDINGS_BY_LEAGUE:
      return Object.assign({}, state, {
        league: action.league,
        isFetching:true,
      })
    case RECEIVE_STANDINGS_BY_LEAGUE:
    return Object.assign({
      league: action.league,
      isFetching: false,
      teamNames: action.leagueNames,
      standingsInOrder: action.standingsInOrder,
      lastUpdated: action.receivedAt,
    });
    default:
      return state;
  }
}
