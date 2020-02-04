import {
  STORE_FIXTURES,
  REQUEST_PAST_FIXTURES,
  RECEIVE_PAST_FIXTURES,
  REQUEST_FUTURE_FIXTURES,
  RECEIVE_FUTURE_FIXTURES,
  RESET_FIXTURES,
} from '../types'

export function fixturesStatus(state={
  futureNextPage: 1,
  pastNextPage: 1,
  pastFetch: false,
  futureFetch: false,
}, action){
  switch(action.type){
    case INCREASE_PAST_PAGE:
      return Object.assign({}, state, { pastNextPage: (state.pastNextPage+1) });
    case INCREASE_FUTURE_PAGE:
      return Object.assign({}, state, { futureNextPage: (state.futureNextPage+1) });
    case RESET_FIXTURES:
      return Object.assign({}, state, { futureNextPage: 1, pastNextPage: 1, });
    case REQUEST_PAST_FIXTURES:
      return Object.assign({}, state, { pastFetch: true, });
    case RECEIVE_PAST_FIXTURES:
      return Object.assign({}, state, { pastFetch: false, });
    case REQUEST_FUTURE_FIXTURES:
      return Object.assign({}, state, { futureFetch: true, });
    case RECEIVE_FUTURE_FIXTURES:
      return Object.assign({}, state, { futureFetch: false, });
    default:
      return state;
  }
}

export function fixturesByID(state={}, action){
  switch(action.type){
    case STORE_FIXTURES:
      return Object.assign({}, state, action.fixtures);
    default:
      return state;
  }
}



// REQUEST_PAST_LEAGUE_FIXTURES,
// RECEIVE_PAST_LEAGUE_FIXTURES,
// REQUEST_PAST_TEAM_FIXTURES,
// RECEIVE_PAST_TEAM_FIXTURES,
// REQUEST_FUTURE_LEAGUE_FIXTURES,
// RECEIVE_FUTURE_LEAGUE_FIXTURES,
// REQUEST_FUTURE_TEAM_FIXTURES,
// RECEIVE_FUTURE_TEAM_FIXTURES,
//
// export function fixturesPastLeague(state={
//   fetching: false
//   }, action){
//   switch(action.type){
//     case REQUEST_PAST_LEAGUE_FIXTURES:
//       return Object.assign({}, state, { fetching: true });
//     case RECEIVE_PAST_LEAGUE_FIXTURES:
//       return Object.assign({}, state, action.fixtures, { fetching: false });
//     default:
//       return state;
//   }
// }
//
// export function fixturesFuture(state={
//   fetchingLeagueFixtures: false,
//   fetchingTeamFixtures: false,
//   }, action){
//   switch(action.type){
//     case REQUEST_FUTURE_FIXTURES:
//       return Object.assign({}, state,
//         {
//           fetchingLeagueFixtures: true,
//           fetchingTeamFixtures: true,
//         });
//     case RECEIVE_FUTURE_LEAGUE_FIXTURES:
//       return Object.assign({}, state,
//         {
//           fetchingLeagueFixtures: false,
//           [action.timeStamp]: [...state[action.timeStamp], ...action.fixtureIDs]
//         }
//       );
//     case RECEIVE_FUTURE_TEAM_FIXTURES:
//       return Object.assign({}, state,
//         {
//           fetchingTeamFixtures: false,
//           [action.timeStamp]: [...state[action.timeStamp], ...action.fixtureIDs]
//         }
//       );
//     default:
//       return state;
//   }
// }
//
