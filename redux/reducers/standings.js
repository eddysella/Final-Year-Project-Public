import {
  REQUEST_STANDINGS,
  RECEIVE_STANDINGS,
  REQUEST_LEAGUE_BY_ID,
  RECEIVE_LEAGUE_BY_ID,
  ADD_LEAGUE_STANDINGS,
  REMOVE_LEAGUE_STANDINGS,
} from '../action/types/types'

export function standingsLeagues(state = [], action){
  switch(action.type){
    case ADD_LEAGUE_STANDINGS:
      return [...state, action.leagueID]
    case REMOVE_LEAGUE_STANDINGS:
      return state.filter(function(value, index, arr){
        return value != action.leagueID;
      });
      return
    default:
      return state;
  }
}

function leagues(
  state = {
    isFetching: false,
    leagueName: '',
    leagueID: '',
    logo: '',
  },
  action
  s){

}

function fixtures(
  state = {
    isFetching: false,
    date: '',
    leagueNames: [],
    fixturesInOrder: [],
  },
  action
  ){
  switch(action.type){
    case REQUEST_FIXTURES_BY_DATE:
      return Object.assign({}, state, {
        date: action.date,
        isFetching:true,
      })
    case RECEIVE_FIXTURES_BY_DATE:
    return Object.assign({
      date: action.date,
      isFetching: false,
      leagueNames: action.leagueNames,
      fixturesInOrder: action.fixturesInOrder,
      lastUpdated: action.receivedAt,
    });
    default:
      return state;
  }
}

export function fixturesByDate(state={}, action){
  switch(action.type){
    case RECEIVE_FIXTURES_BY_DATE:
    case REQUEST_FIXTURES_BY_DATE:
      return Object.assign({}, state, {
        [action.date]: fixtures(state[action.date], action)
        });
    default:
      return state;
  }
}

export function specificStandings(
  state = {
    isFetching: false,
    teamNames: [],
    standingsInOrder: [],
  },
  action
  ){
  switch(action.type){
    case REQUEST_STANDINGS:
      return Object.assign({}, state, {
        leagueID: action.leagueID,
        leagueName: action.leagueName,
        isFetching:true,
      })
    case RECEIVE_STANDINGS:
    return Object.assign({
      isFetching: false,
      teamNames: action.teamNames,
      standingsInOrder: action.standingsInOrder,
      lastUpdated: action.receivedAt,
    });
    default:
      return state;
  }
}
