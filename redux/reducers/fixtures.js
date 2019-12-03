import {
  REQUEST_FIXTURES_BY_DATE,
  RECEIVE_FIXTURES_BY_DATE,
  SET_FIXTURE_DATES,
} from '../action/types/types'

export const fixturesTopbarDates = (state = [], action) => {
  switch(action.type){
    case SET_FIXTURE_DATES:
      return [...state, action.dates]
    default:
      return state;
  }
}

function fixtures(
  state = {
    isFetching: false,
    fixtures:[]
  },
  action
  ){
  switch(action.type){
    case REQUEST_FIXTURES_BY_DATE:
      return Object.assign({}, state, {
        isFetching:true,
      })
    case RECEIVE_FIXTURES_BY_DATE:
    return Object.assign({
      isFetching:false,
      fixtures: action.fixtures,
      lastUpdated: action.receivedAt,
    });
    default:
      return state;
  }
}

export const fixturesByDate = (state={}, action) =>{
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
