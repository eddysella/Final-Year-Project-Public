import {
  REQUEST_FIXTURES_BY_DATE,
  RECEIVE_FIXTURES_BY_DATE,
  SET_FIXTURE_DATES,
  SET_CURRENT_DATE,
  SET_FIXTURES,
} from '../action/types/types'

export function fixturesTopbarDates(state=[], action){
  switch(action.type){
    case SET_FIXTURE_DATES:
      return action.dates
    default:
      return state;
  }
}

export function currentDate(state = '', action){
  switch(action.type){
    case SET_CURRENT_DATE:
      return action.date;
    default:
      return state;
  }

}

function fixtures(
  state = {
    isFetching: false,
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

//
// function fixturesMain(state, action){
//   switch(action.type){
//     case SET_FIXTURE_DATES:
//       return Object.assign({}, state, {
//         fixtures_all_dates: action.dates
//       });
//     case GET_FIXTURES_BY_DATE:
//       return Object.assign({}, state, {
//         fixtures_current_date: action.date
//       });
//     case SET_FIXTURES_BY_DATE:
//       return Object.assign({}, state, {
//         fixtures_displayed: action.fixtures
//       });
//     case GET_FIXTURE_BY_ID:
//     case SET_FIXTURE_BY_ID:
//     case SELECT_FIXTURE_TAB:
//       return this.fixturesSpecific(state, action);
//     default:
//       return state;
//   }
//   return state;
// }
//
// function fixturesSpecific(state, action){
//   switch(action.type){
//     case GET_FIXTURE_BY_ID:
//       return Object.assign({}, state, {
//         fixture_by_id: action.id
//       });
//     case SET_FIXTURE_BY_ID:
//       return Object.assign({}, state, {
//         fixture: action.fixture
//       });
//     case SELECT_FIXTURE_TAB:
//       return Object.assign({}, state, {
//         tab: action.tab
//       });
//     default:
//       return state;
//   }
//   return state;
// }
