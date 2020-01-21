import {
  REQUEST_LEAGUE_BY_ID,
  RECEIVE_LEAGUE_BY_ID,
  RECEIVE_MULTIPLE_LEAGUES,
} from '../action/types/types'

function league(
  state = {
    isFetching: false,
    leagueID: '',
    leagueName: '',
    countryCode: '',
    logo: '',
  },
  action
  ){
  switch(action.type){
    case REQUEST_LEAGUE_BY_ID:
      return Object.assign({}, state, {
        leagueID: action.leagueID,
        isFetching: true,
      })
    case RECEIVE_LEAGUE_BY_ID:
    return Object.assign({}, state, {
      isFetching: false,
      leagueName: action.leagueName,
      countryCode: action.countryCode,
      logo: action.logo,
    });
    default:
      return state;
  }
}

export function leaguesByID(state={}, action){
  switch(action.type){
    case REQUEST_LEAGUE_BY_ID:
    case RECEIVE_LEAGUE_BY_ID:
      return Object.assign({}, state, {
        [action.leagueID]: league(state[action.leagueID], action)
        });
    case RECEIVE_MULTIPLE_LEAGUES:
      return Object.assign({}, state, action.leagues);
    default:
      return state;
  }
}
