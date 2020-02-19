import {
  STORE_FIXTURES_BY_ID,
  STORE_FIXTURES_BY_DATE,
  STORE_PAST_DATES,
  STORE_FUTURE_DATES,
  RESET_FIXTURES,
  RESET_PAST_LEAGUE_FETCH,
  RESET_FUTURE_LEAGUE_FETCH,
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
  INIT_LEAGUE_FIXTURES,
  INIT_TEAM_FIXTURES,
  REQUEST_FIXTURE_STATS,
  RECEIVE_FIXTURE_STATS,
  LEAGUE_SHOULD_FETCH_PAST_TRUE,
  LEAGUE_SHOULD_FETCH_FUTURE_TRUE,
  LEAGUE_SET_CURRENT_ROUND,
} from '../types'
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
    case STORE_PAST_DATES:
      return sortBy(filterArray([...state, ...action.dates]), s => -s);
    default:
      return state;
  }
}

export function futureDates(state=[], action){
  switch(action.type){
    case STORE_FUTURE_DATES:
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
    lastPastDate: today.getTime(),
    lastFutureDate: today.getTime(),
  },
  action
  ){
  switch(action.type){
    case LEAGUE_SET_CURRENT_ROUND:
      return Object.assign({}, state, {
        currentRound: action.round,
      })
    case LEAGUE_SHOULD_FETCH_PAST_TRUE:
      return Object.assign({}, state, {
        shouldFetchPast: true,
      })
    case LEAGUE_SHOULD_FETCH_FUTURE_TRUE:
      return Object.assign({}, state, {
        shouldFetchFuture: true,
      })
    case RESET_FUTURE_LEAGUE_FETCH:
      return Object.assign({}, state, {
        fetchingFuture: false,
      })
    case RESET_PAST_LEAGUE_FETCH:
      return Object.assign({}, state, {
        fetchingPast: false,
      })
    case INIT_LEAGUE_FIXTURES:
      return Object.assign({}, state)
    case REQUEST_PAST_LEAGUE_FIXTURES:
      return Object.assign({}, state, {
        fetchingPast: true,
      })
    case RECEIVE_PAST_LEAGUE_FIXTURES:
      return Object.assign({}, state, {
        fetchingPast: false,
        fixturesByDate: Object.assign({}, state.fixturesByDate, action.fixtures),
        lastPastDate: action.date,
        pastDates: [...state.pastDates, action.date],
        shouldFetchPast: false,
      })
    case RECEIVE_TODAY_LEAGUE_FIXTURES:
      return Object.assign({}, state, {
        todayFixtures: [...state.todayFixtures, ...action.fixtures],
      });
    case REQUEST_FUTURE_LEAGUE_FIXTURES:
      return Object.assign({}, state, {
        fetchingFuture: true,
      })
    case RECEIVE_FUTURE_LEAGUE_FIXTURES:
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
    case RESET_FUTURE_LEAGUE_FETCH:
    case RESET_PAST_LEAGUE_FETCH:
    case INIT_LEAGUE_FIXTURES:
    case REQUEST_PAST_LEAGUE_FIXTURES:
    case REQUEST_FUTURE_LEAGUE_FIXTURES:
    case RECEIVE_TODAY_LEAGUE_FIXTURES:
    case RECEIVE_PAST_LEAGUE_FIXTURES:
    case RECEIVE_FUTURE_LEAGUE_FIXTURES:
    case LEAGUE_SHOULD_FETCH_PAST_TRUE:
    case LEAGUE_SHOULD_FETCH_FUTURE_TRUE:
    case LEAGUE_SET_CURRENT_ROUND:
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
    case INIT_TEAM_FIXTURES:
      return Object.assign({}, state)
    case REQUEST_PAST_TEAM_FIXTURES:
      return Object.assign({}, state, {
        fetchingPast: true,
      })
    case RECEIVE_PAST_TEAM_FIXTURES:
      return Object.assign({}, state, {
        fetchingPast: false,
        pastFixtures: [...state.pastFixtures, ...action.fixtures],
        lastPastDate: action.date,
        nextPastPage: (state.nextPastPage+1),
      })
    case RECEIVE_TODAY_TEAM_FIXTURES:
      return Object.assign({}, state, {
        todayFixtures: [...state.todayFixtures, ...action.fixtures],
      });
    case REQUEST_FUTURE_TEAM_FIXTURES:
      return Object.assign({}, state, {
        fetchingFuture: true,
      })
    case RECEIVE_FUTURE_TEAM_FIXTURES:
      return Object.assign({}, state, {
        fetchingFuture: false,
        futureFixtures: [...state.futureFixtures, ...action.fixtures],
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
    case INIT_TEAM_FIXTURES:
    return Object.assign({}, state, {
      [action.teamID]: team(state[action.teamID], action)
      });
    case REQUEST_PAST_TEAM_FIXTURES:
    case REQUEST_FUTURE_TEAM_FIXTURES:
    return Object.assign({}, state, {
      fetching: true,
      [action.teamID]: team(state[action.teamID], action)
      });
    case RECEIVE_PAST_TEAM_FIXTURES:
    case RECEIVE_TODAY_TEAM_FIXTURES:
    case RECEIVE_FUTURE_TEAM_FIXTURES:
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
    case STORE_FIXTURES_BY_DATE:
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
    case STORE_FIXTURES_BY_DATE:
      return Object.assign({}, state, {
          [action.date]: date(state[action.date], action)
        });
    default:
      return state;
  }
}

export function fixture(state={}, action){
  switch(action.type){
    case RECEIVE_FIXTURE_STATS:
    return Object.assign({}, state, action.stats);
    default:
      return state;
  }
}

export function fixturesByID(state={
  fetching: false,
}, action){
  switch(action.type){
    case REQUEST_FIXTURE_STATS:
      return Object.assign({}, state, {
        fetching: true,
      });
    case RECEIVE_FIXTURE_STATS:
      return Object.assign({}, state, {
        fetching: false,
        [action.fixtureID]: fixture(state[action.fixtureID], action)
      });
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
