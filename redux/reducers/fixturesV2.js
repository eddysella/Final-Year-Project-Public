import {
  STORE_FIXTURES_BY_ID,
  STORE_FIXTURES_BY_DATE,
  STORE_PAST_DATES,
  STORE_FUTURE_DATES,
  RESET_FIXTURES,
  REQUEST_PAST_FIXTURES,
  RECEIVE_PAST_FIXTURES,
  REQUEST_PAST_LEAGUE_FIXTURES,
  RECEIVE_PAST_LEAGUE_FIXTURES,
  REQUEST_PAST_TEAM_FIXTURES,
  RECEIVE_PAST_TEAM_FIXTURES,
  RECEIVE_TODAY_LEAGUE_FIXTURES,
  RECEIVE_TODAY_TEAM_FIXTURES,
  REQUEST_FUTURE_FIXTURES,
  RECEIVE_FUTURE_FIXTURES,
  REQUEST_FUTURE_LEAGUE_FIXTURES,
  RECEIVE_FUTURE_LEAGUE_FIXTURES,
  REQUEST_FUTURE_TEAM_FIXTURES,
  RECEIVE_FUTURE_TEAM_FIXTURES,
} from '../types'

const deepMerge = require('deepmerge')
import sortBy from 'array-sort-by';

export function fixturesStatus(state={
  currentFutureDates: [],
  currentPastDates: [],
  pastFetch: false,
  futureFetch: false,
}, action){
  switch(action.type){
    case RESET_FIXTURES:
      return Object.assign({}, state, {
         currentPastDates: [],
         currentFutureDates: [],
       });
    case REQUEST_PAST_FIXTURES:
      return Object.assign({}, state, { pastFetch: true, });
    case RECEIVE_PAST_FIXTURES:
      return Object.assign({}, state, {
        pastFetch: false,
        currentPastDates: [...state.currentPastDates, action.date]
      });
    case REQUEST_FUTURE_FIXTURES:
      return Object.assign({}, state, { futureFetch: true, });
    case RECEIVE_FUTURE_FIXTURES:
      return Object.assign({}, state, {
        futureFetch: false,
        currentFutureDates: [...state.currentFutureDates, action.date]
      });
    default:
      return state;
  }
}

//https://stackoverflow.com/questions/40346773/unique-array-for-dates-javascript/44906207
function isDateInArray(needle, haystack) {
  for (var i = 0; i < haystack.length; i++) {
    if (new Date(needle).getTime() === new Date(haystack[i]).getTime()) {
      return true;
    }
  }
  return false;
}

//https://stackoverflow.com/questions/10123953/how-to-sort-an-array-by-a-date-property
function filterArray(array){
  var uniqueDates = [];
  for (var i = 0; i < array.length; i++) {
    if (!isDateInArray(array[i], uniqueDates)) {
      uniqueDates.push(array[i]);
    }
  }
  return uniqueDates
}

export function pastDates(state=[], action){
  switch(action.type){
    case STORE_PAST_DATES:
      return sortBy(filterArray([...state, ...action.dates]), (s) => -new Date(s));
    default:
      return state;
  }
}

export function futureDates(state=[], action){
  switch(action.type){
    case STORE_FUTURE_DATES:
      return sortBy(filterArray([...state, ...action.dates]), (s) => new Date(s));
    default:
      return state;
  }
}

// export function today(state=new Set(), action){
//   switch(action.type){
//     case STORE_TODAY_DATE:
//       return [...state, ...action.dates]
//     default:
//       return state;
//   }
// }

function league(
  state = {
    fetchingFutureFixtures: false,
    fetchingPastFixtures: false,
    pastFixtures:{},
    todayFixtures: [],
    futureFixtures:{},
    lastPastDateFetched: '',
    lastFutureDateFetched: '',
  },
  action
  ){
  switch(action.type){
    case REQUEST_PAST_LEAGUE_FIXTURES:
      return Object.assign({}, state, {
        fetchingPastFixtures: true,
      })
    case RECEIVE_PAST_LEAGUE_FIXTURES:
      return Object.assign({}, state, {
        fetchingPastFixtures: false,
        pastFixtures: Object.assign({}, state.pastFixtures, action.fixtures),
        lastPastDateFetched: action.date,
      })
    case RECEIVE_TODAY_LEAGUE_FIXTURES:
      return Object.assign({}, state, {
        todayFixtures: [...state.todayFixtures, ...action.fixtures],
      });
    case REQUEST_FUTURE_LEAGUE_FIXTURES:
      return Object.assign({}, state, {
        fetchingFutureFixtures: true,
      })
    case RECEIVE_FUTURE_LEAGUE_FIXTURES:
      return Object.assign({}, state, {
        fetchingFutureFixtures: false,
        futureFixtures: Object.assign({}, state.futureFixtures, action.fixtures),
        lastFutureDateFetched: action.date,
      })
    default:
      return state;
  }
}

export function fixtureIDsByLeagueDate(state={
  fetching: false,
}, action){
  switch(action.type){
    case REQUEST_PAST_LEAGUE_FIXTURES:
    case REQUEST_FUTURE_LEAGUE_FIXTURES:
    return Object.assign({}, state, {
      fetching: true,
      [action.leagueID]: league(state[action.leagueID], action)
      });
    case RECEIVE_TODAY_LEAGUE_FIXTURES:
    case RECEIVE_TEAMS_FOR_LEAGUE:
    case RECEIVE_PAST_LEAGUE_FIXTURES:
      return Object.assign({}, state, {
        fetching: false,
        [action.leagueID]: league(state[action.leagueID], action)
        });
    default:
      return state;
  }
}

function team(
  state = {
    fetchingFutureFixtures: false,
    fetchingPastFixtures: false,
    pastFixtures:{},
    todayFixtures: [],
    futureFixtures:{},
    lastPastDateReceived: '',
    lastFutureDateReceived: '',
    nextPastPage: 1,
    nextFuturePage: 1,
  },
  action
  ){
  switch(action.type){
    case REQUEST_PAST_TEAM_FIXTURES:
      return Object.assign({}, state, {
        fetchingPastFixtures: true,
      })
    case RECEIVE_PAST_TEAM_FIXTURES:
      return Object.assign({}, state, {
        fetchingPastFixtures: false,
        pastFixtures: [...state.pastFixtures, ...action.fixtures],
        lastPastDateReceived: action.date,
        nextPastPage: (state.nextPastPage+1);
      })
    case RECEIVE_TODAY_TEAM_FIXTURES:
      return Object.assign({}, state, {
        todayFixtures: [...state.todayFixtures, ...action.fixtures],
      });
    case REQUEST_FUTURE_TEAM_FIXTURES:
      return Object.assign({}, state, {
        fetchingFutureFixtures: true,
      })
    case RECEIVE_FUTURE_TEAM_FIXTURES:
      return Object.assign({}, state, {
        fetchingFutureFixtures: false,
        futureFixtures: [...state.futureFixtures, ...action.fixtures],
        lastFutureDateReceived: action.date,
        nextFuturePage: (state.nextFuturePage+1);
      })
    default:
      return state;
  }
}

export function fixtureIDsByTeamID(state={
  fetching: false,
}, action){
  switch(action.type){
    case REQUEST_PAST_TEAM_FIXTURES:
    case REQUEST_FUTURE_TEAM_FIXTURES:
    return Object.assign({}, state, {
      fetching: true,
      [action.teamID]: league(state[action.teamID], action)
      });
    case RECEIVE_TODAY_TEAM_FIXTURES:
    case RECEIVE_PAST_TEAM_FIXTURES:
    case RECEIVE_FUTURE_TEAM_FIXTURES:
      return Object.assign({}, state, {
        fetching: false,
        [action.teamID]: league(state[action.teamID], action)
        });
    default:
      return state;
  }
}

// this is to avoid duplicates inside League
const combineMerge = (target, source, options) => {
  const destination = target.slice()

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
    } else if (options.isMergeableObject(item)) {
      destination[index] = merge(target[index], item, options)
    } else if (target.indexOf(item) === -1) {
      destination.push(item)
    }
  })
  return destination
}

export function fixtureIDsByDateLeague(state={}, action){
  switch(action.type){
    case STORE_FIXTURES_BY_DATE:
      return Object.assign({}, state, {
          [action.date]: deepMerge(state[action.date], action.fixtures, { arrayMerge: combineMerge });
        });
    default:
      return state;
  }
}


export function fixturesByID(state={}, action){
  switch(action.type){
    case STORE_FIXTURES_BY_ID:
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
