import {
  ADD_LEAGUE,
  REMOVE_LEAGUE,
  ADD_TEAM,
  REMOVE_TEAM,
} from '../action/types/types'

function league(
  state = {
    isFetching: false,
    league: '',
    teams: [],
  },
  action
  ){
  switch(action.type){
    case REQUEST_STANDINGS_BY_LEAGUE:
      return Object.assign({}, state, {
        league: action.league,
        isFetching:true,
      })
    break;
    case RECEIVE_STANDINGS_BY_LEAGUE:
    return Object.assign({
      league: action.league,
      isFetching: false,
      teamNames: action.leagueNames,
      standingsInOrder: action.standingsInOrder,
      lastUpdated: action.receivedAt,
    });
    break;
    default:
      return state;
  }
}

function team(
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
    break;
    case RECEIVE_STANDINGS_BY_LEAGUE:
    return Object.assign({
      league: action.league,
      isFetching: false,
      teamNames: action.leagueNames,
      standingsInOrder: action.standingsInOrder,
      lastUpdated: action.receivedAt,
    });
    break;
    default:
      return state;
  }
}

export function following(state={}, action){
  switch(action.type){
    case ADD_LEAGUE:
    return Object.assign({}, state, {
      [action.league]: league(state[action.league], action)
      });
    break;
    case REMOVE_LEAGUE:
    delete state[action.league]
    break;
    case ADD_TEAM:
    return Object.assign({}, state, {
      [action.team]: team(state[action.team], action)
      });
    break;
    case REMOVE_TEAM:
    delete state[action.team]
    break;
    default:
      return state;
  }
}
