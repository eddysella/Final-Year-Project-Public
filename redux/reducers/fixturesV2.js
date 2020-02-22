import {
  FIXTURES_STORE_BY_ID,
  FIXTURES_STORE_BY_DATE,
  FIXTURES_STORE_PAST_DATES,
  FIXTURES_STORE_FUTURE_DATES,
  FIXTURES_RESET,
  FIXTURES_RESET_PAST_LEAGUE_FETCH,
  FIXTURES_RESET_FUTURE_LEAGUE_FETCH,
  FIXTURES_REQUEST_PAST,
  FIXTURES_RECEIVE_PAST,
  FIXTURES_REQUEST_PAST_LEAGUE,
  FIXTURES_RECEIVE_PAST_LEAGUE,
  FIXTURES_REQUEST_PAST_TEAM,
  FIXTURES_RECEIVE_PAST_TEAM,
  FIXTURES_RECEIVE_TODAY_LEAGUE,
  FIXTURES_RECEIVE_TODAY_TEAM,
  FIXTURES_REQUEST_FUTURE,
  FIXTURES_RECEIVE_FUTURE,
  FIXTURES_REQUEST_FUTURE_LEAGUE,
  FIXTURES_RECEIVE_FUTURE_LEAGUE,
  FIXTURES_REQUEST_FUTURE_TEAM,
  FIXTURES_RECEIVE_FUTURE_TEAM,
  FIXTURES_INIT_LEAGUE,
  FIXTURES_INIT_TEAM,
  FIXTURES_REQUEST_STATS,
  FIXTURES_RECEIVE_STATS,
  FIXTURES_SET_SHOULD_FETCH_PAST_LEAGUE_TRUE,
  FIXTURES_SET_SHOULD_FETCH_FUTURE_LEAGUE_TRUE,
  FIXTURES_SET_LEAGUE_CURRENT_ROUND,
} from '../types/fixtures'
import sortBy from 'array-sort-by';

export function fixturesStatus(state={
  currentFutureDates: [],
  currentPastDates: [],
  pastFetch: false,
  futureFetch: false,
}, action){
  switch(action.type){
    case FIXTURES_RESET:
      return Object.assign({}, state, {
         currentPastDates: [],
         currentFutureDates: [],
       });
    case FIXTURES_REQUEST_PAST:
      return Object.assign({}, state, { pastFetch: true, });
    case FIXTURES_RECEIVE_PAST:
      return Object.assign({}, state, {
        pastFetch: false,
        currentPastDates: [...state.currentPastDates, action.date]
      });
    case FIXTURES_REQUEST_FUTURE:
      return Object.assign({}, state, { futureFetch: true, });
    case FIXTURES_RECEIVE_FUTURE:
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
    if (needle === haystack[i]) {
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
    case FIXTURES_STORE_PAST_DATES:
      return sortBy(filterArray([...state, ...action.dates]), s => -s);
    default:
      return state;
  }
}

export function futureDates(state=[], action){
  switch(action.type){
    case FIXTURES_STORE_FUTURE_DATES:
      return sortBy(filterArray([...state, ...action.dates]));
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


today = new Date()
today.setHours(0,0,0,0)
yesterday = new Date();
yesterday.setDate(today.getDate() - 1)
yesterday = yesterday.getTime();
tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1)
tomorrow = tomorrow.getTime();

function league(
  state = {
    fetchingFuture: false,
    fetchingPast: false,
    shouldFetchPast: false,
    shouldFetchFuture: false,
    pastDates:[],
    todayFixtures: [],
    futureDates:[],
    fixturesByDate:{},
    lastPastDate: tomorrow,
    lastFutureDate: yesterday,
  },
  action
  ){
  switch(action.type){
    case FIXTURES_SET_LEAGUE_CURRENT_ROUND:
      return Object.assign({}, state, {
        currentRound: action.round,
      })
    case FIXTURES_SET_SHOULD_FETCH_PAST_LEAGUE_TRUE:
      return Object.assign({}, state, {
        shouldFetchPast: true,
      })
    case FIXTURES_SET_SHOULD_FETCH_FUTURE_LEAGUE_TRUE:
      return Object.assign({}, state, {
        shouldFetchFuture: true,
      })
    case FIXTURES_RESET_FUTURE_LEAGUE_FETCH:
      return Object.assign({}, state, {
        fetchingFuture: false,
      })
    case FIXTURES_RESET_PAST_LEAGUE_FETCH:
      return Object.assign({}, state, {
        fetchingPast: false,
      })
    case FIXTURES_INIT_LEAGUE:
      return Object.assign({}, state)
    case FIXTURES_REQUEST_PAST_LEAGUE:
      return Object.assign({}, state, {
        fetchingPast: true,
      })
    case FIXTURES_RECEIVE_PAST_LEAGUE:
      return Object.assign({}, state, {
        fetchingPast: false,
        fixturesByDate: Object.assign({}, state.fixturesByDate, action.fixtures),
        lastPastDate: action.date,
        pastDates: [...state.pastDates, action.date],
        shouldFetchPast: false,
      })
    case FIXTURES_RECEIVE_TODAY_LEAGUE:
      return Object.assign({}, state, {
        todayFixtures: [...state.todayFixtures, ...action.fixtures],
      });
    case FIXTURES_REQUEST_FUTURE_LEAGUE:
      return Object.assign({}, state, {
        fetchingFuture: true,
      })
    case FIXTURES_RECEIVE_FUTURE_LEAGUE:
      return Object.assign({}, state, {
        fetchingFuture: false,
        fixturesByDate: Object.assign({}, state.fixturesByDate, action.fixtures),
        lastFutureDate: action.date,
        futureDates: [...state.futureDates, action.date],
        shouldFetchFuture: false,
      })
    default:
      return state;
  }
}

export function fixtureIDsByLeagueID(state={}, action){
  switch(action.type){
    case FIXTURES_RESET_FUTURE_LEAGUE_FETCH:
    case FIXTURES_RESET_PAST_LEAGUE_FETCH:
    case FIXTURES_INIT_LEAGUE:
    case FIXTURES_REQUEST_PAST_LEAGUE:
    case FIXTURES_REQUEST_FUTURE_LEAGUE:
    case FIXTURES_RECEIVE_TODAY_LEAGUE:
    case FIXTURES_RECEIVE_PAST_LEAGUE:
    case FIXTURES_RECEIVE_FUTURE_LEAGUE:
    case FIXTURES_SET_SHOULD_FETCH_PAST_LEAGUE_TRUE:
    case FIXTURES_SET_SHOULD_FETCH_FUTURE_LEAGUE_TRUE:
    case FIXTURES_SET_LEAGUE_CURRENT_ROUND:
      return Object.assign({}, state, {
        [action.leagueID]: league(state[action.leagueID], action)
        });
    default:
      return state;
  }
}

function team(
  state = {
    fetchingFuture: false,
    fetchingPast: false,
    pastFixtures:[],
    todayFixtures: [],
    futureFixtures:[],
    lastPastDate: tomorrow,
    lastFutureDate: yesterday,
    nextPastPage: 1,
    nextFuturePage: 1,
  },
  action
  ){
  switch(action.type){
    case FIXTURES_INIT_TEAM:
      return Object.assign({}, state)
    case FIXTURES_REQUEST_PAST_TEAM:
      return Object.assign({}, state, {
        fetchingPast: true,
      })
    case FIXTURES_RECEIVE_PAST_TEAM:
      return Object.assign({}, state, {
        fetchingPast: false,
        pastFixtures: sortBy(filterArray([...state.pastFixtures, ...action.fixtures]), s => -s),
        lastPastDate: action.date,
        nextPastPage: (state.nextPastPage+1),
      })
    case FIXTURES_RECEIVE_TODAY_TEAM:
      return Object.assign({}, state, {
        todayFixtures: [...state.todayFixtures, ...action.fixtures],
      });
    case FIXTURES_REQUEST_FUTURE_TEAM:
      return Object.assign({}, state, {
        fetchingFuture: true,
      })
    case FIXTURES_RECEIVE_FUTURE_TEAM:
      return Object.assign({}, state, {
        fetchingFuture: false,
        futureFixtures: sortBy(filterArray([...state.futureFixtures, ...action.fixtures])),
        lastFutureDate: action.date,
        nextFuturePage: (state.nextFuturePage+1),
      })
    default:
      return state;
  }
}

export function fixtureIDsByTeamID(state={
  fetching: false,
}, action){
  switch(action.type){
    case FIXTURES_INIT_TEAM:
    return Object.assign({}, state, {
      [action.teamID]: team(state[action.teamID], action)
      });
    case FIXTURES_REQUEST_PAST_TEAM:
    case FIXTURES_REQUEST_FUTURE_TEAM:
    return Object.assign({}, state, {
      fetching: true,
      [action.teamID]: team(state[action.teamID], action)
      });
    case FIXTURES_RECEIVE_PAST_TEAM:
    case FIXTURES_RECEIVE_TODAY_TEAM:
    case FIXTURES_RECEIVE_FUTURE_TEAM:
      return Object.assign({}, state, {
        fetching: false,
        [action.teamID]: team(state[action.teamID], action)
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

export function date(state={}, action){
  switch(action.type){
    case FIXTURES_STORE_BY_DATE:
    if(state[action.league]){
      return Object.assign({}, state, {
          [action.league]: sortBy(filterArray([...state[action.league], ...action.fixtures])),
        });
    }else{
      return Object.assign({}, state, {
          [action.league]: action.fixtures,
        });
    }
    default:
      return state;
  }
}

export function fixtureIDsByDateLeague(state={}, action){
  switch(action.type){
    case FIXTURES_STORE_BY_DATE:
      return Object.assign({}, state, {
          [action.date]: date(state[action.date], action)
        });
    default:
      return state;
  }
}

function fixture(state={}, action){
  switch(action.type){
    case FIXTURES_RECEIVE_STATS:
    return Object.assign({}, state, action.stats);
    default:
      return state;
  }
}

export function fixturesByID(state={
  fetching: false,
}, action){
  switch(action.type){
    case FIXTURES_REQUEST_STATS:
      return Object.assign({}, state, {
        fetching: true,
      });
    case FIXTURES_RECEIVE_STATS:
      return Object.assign({}, state, {
        fetching: false,
        [action.fixtureID]: fixture(state[action.fixtureID], action)
      });
    case FIXTURES_STORE_BY_ID:
      return Object.assign({}, state, action.fixtures);
    default:
      return state;
  }
}



// FIXTURES_REQUEST_PAST_LEAGUE,
// FIXTURES_RECEIVE_PAST_LEAGUE,
// FIXTURES_REQUEST_PAST_TEAM,
// FIXTURES_RECEIVE_PAST_TEAM,
// FIXTURES_REQUEST_FUTURE_LEAGUE,
// FIXTURES_RECEIVE_FUTURE_LEAGUE,
// FIXTURES_REQUEST_FUTURE_TEAM,
// FIXTURES_RECEIVE_FUTURE_TEAM,
//
// export function fixturesPastLeague(state={
//   fetching: false
//   }, action){
//   switch(action.type){
//     case FIXTURES_REQUEST_PAST_LEAGUE:
//       return Object.assign({}, state, { fetching: true });
//     case FIXTURES_RECEIVE_PAST_LEAGUE:
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
//     case FIXTURES_REQUEST_FUTURE:
//       return Object.assign({}, state,
//         {
//           fetchingLeagueFixtures: true,
//           fetchingTeamFixtures: true,
//         });
//     case FIXTURES_RECEIVE_FUTURE_LEAGUE:
//       return Object.assign({}, state,
//         {
//           fetchingLeagueFixtures: false,
//           [action.timeStamp]: [...state[action.timeStamp], ...action.fixtureIDs]
//         }
//       );
//     case FIXTURES_RECEIVE_FUTURE_TEAM:
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
