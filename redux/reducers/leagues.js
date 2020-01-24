import {
  REQUEST_LEAGUE_BY_ID,
  RECEIVE_LEAGUE_BY_ID,
  REQUEST_FIXTURES_BY_LEAGUE,
  RECEIVE_FIXTURES_BY_LEAGUE,
  RECEIVE_MULTIPLE_LEAGUES,
} from '../types'

function league(
  state = {
    fetchingLeague: false,
    fetchingFixtures: false,
    leagueID: '',
    leagueName: '',
    countryCode: '',
    logo: '',
    fixtures:{}
  },
  action
  ){
  switch(action.type){
    case REQUEST_LEAGUE_BY_ID:
      return Object.assign({}, state, {
        leagueID: action.leagueID,
        fetchingLeague: true,
      })
    case RECEIVE_LEAGUE_BY_ID:
    return Object.assign({}, state, {
      fetchingLeague: false,
      leagueName: action.leagueName,
      countryCode: action.countryCode,
      logo: action.logo,
    });
    case REQUEST_FIXTURES_BY_LEAGUE:
      return Object.assign({}, state, {
        fetchingFixtures: true,
      })
    case RECEIVE_FIXTURES_BY_LEAGUE:
      return Object.assign({}, state, {
        fetchingFixtures: false,
        fixtures: action.fixtures,
      })
    default:
      return state;
  }
}

export function leaguesByID(state={}, action){
  switch(action.type){
    case REQUEST_LEAGUE_BY_ID:
    case RECEIVE_LEAGUE_BY_ID:
    case REQUEST_FIXTURES_BY_LEAGUE:
    case RECEIVE_FIXTURES_BY_LEAGUE:
      return Object.assign({}, state, {
        [action.leagueID]: league(state[action.leagueID], action)
        });
    case RECEIVE_MULTIPLE_LEAGUES:
      return Object.assign({}, state, action.leagues);
    default:
      return state;
  }
}
