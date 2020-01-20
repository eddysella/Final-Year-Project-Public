import {
  REQUEST_FIXTURES_BY_DATE,
  RECEIVE_FIXTURES_BY_DATE,
  SET_FIXTURE_DATES,
  SET_CURRENT_DATE,
  RECEIVE_FIXTURE_BY_ID,
  REQUEST_FIXTURE_BY_ID,
  REQUEST_FIXTURES_BY_TEAM_ID,
  RECEIVE_FIXTURES_BY_TEAM_ID,
  SET_TAB,
} from '../action/types/types'

export function fixturesSpecific(
  state = {
    fixtureID:'',
    tabDisplayed:0,
    fetching: false,
    topBar: [],
    screen: [],
  },
  action
  ){
    switch(action.type){
      case SET_TAB:
      return Object.assign({}, state,{
        tabDisplayed: action.tabDisplayed,
      })
      case REQUEST_FIXTURE_BY_ID:
        return Object.assign({}, state, {
          fixtureID: action.fixtureID,
          fetching: true,
        })
      case RECEIVE_FIXTURE_BY_ID:
        return Object.assign({}, state,{
          receivedAt: action.receivedAt,
          topBar: action.topBar,
          screen: action.screen,
          fetching: false,
        })
      default:
        return state;
    }
}

export function fixturesTopbarDates(state=[], action){
  switch(action.type){
    case SET_FIXTURE_DATES:
      return action.dates
    default:
      return state;
  }
}

export function fixturesCurrentDate(state=[], action){
  switch(action.type){
    case SET_CURRENT_DATE:
      return action.date
    default:
      return state;
  }
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
    case REQUEST_FIXTURES_BY_TEAM_ID:
    case REQUEST_FIXTURES_BY_DATE:
      return Object.assign({}, state, {
        date: action.date,
        isFetching:true,
      })
    case RECEIVE_FIXTURES_BY_TEAM_ID:
    case RECEIVE_FIXTURES_BY_DATE:
    return Object.assign({}, state, {
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

export function fixturesNextTenByTeam(state={}, action){
  switch(action.type){
    case RECEIVE_FIXTURES_BY_TEAM_ID:
    case REQUEST_FIXTURES_BY_TEAM_ID:
      return Object.assign({}, state, {
        [action.teamID]: fixtures(state[action.teamID], action)
        });
    default:
      return state;
  }
}
