import {
  FIXTURES_INIT_TEAM,
  FIXTURES_REQUEST_PAST_TEAM,
  FIXTURES_RECEIVE_PAST_TEAM,
  FIXTURES_RECEIVE_TODAY_TEAM,
  FIXTURES_REQUEST_FUTURE_TEAM,
  FIXTURES_RECEIVE_FUTURE_TEAM,
} from '../types/fixtures'
/**
 * @module Redux Reducers fixturesTeam
 */
// Source: https://github.com/jherax/array-sort-by
import sortBy from 'array-sort-by';
const todayTime = getTodayTime();
// const todayTime = 1000; // values for testing

/**
 * Calculates the timeStamp of today @ midnight.
 * @method getTodayTime
 * @return {Integer} A Millisecond timestamp
 */
function getTodayTime(){
  today = new Date()
  today.setHours(0,0,0,0)
  return today.getTime()
}

/**
 * Decides if the needle is in the haystack.
 * Needle can be any type.
 * Source: //https://stackoverflow.com/questions/40346773/unique-array-for-dates-javascript/44906207
 * @method isDateInArray
 * @param  {Polymorphic}      needle A thing
 * @param  {Array}      haystack A set of things
 * @return {Boolean}              [description]
 */
function isDateInArray(needle, haystack) {
  for (var i = 0; i < haystack.length; i++) {
    if (needle === haystack[i]) {
      return true;
    }
  }
  return false;
}

/**
 * Returns a new array of unique items.
 * Source: //https://stackoverflow.com/questions/40346773/unique-array-for-dates-javascript/44906207
 * @method filterArray
 * @param  {Array} array A set of items
 * @return {Array} A new array of unique items
 */
function filterArray(array){
  var uniqueDates = [];
  for (var i = 0; i < array.length; i++) {
    if (!isDateInArray(array[i], uniqueDates)) {
      uniqueDates.push(array[i]);
    }
  }
  return uniqueDates
}

/**
 * An entity in the fixturesIDsByTeamID store, holds all properties belonging to a single team.
 * @method team
 * @param {Object} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to make to the store
 * @property {Object} state
 * @property {Boolean} state.fetchingFuture Default=false Set to true when fetching
 * future fixtures, false otherwise
 * @property {Boolean} state.fetchingPast Default=false Set to true when fetching
 * past fixtures, false otherwise
 * @property {Array} state.pastFixtures [Integer] A set of fixture IDs
 * @property {Array} state.todayFixtures [Integer] A set of fixture IDs
 * @property {Array} state.futureFixtures [Integer] A set of fixture IDs
 * @property {Integer} state.lastPastDate A ms timeStamp of the last date fetched
 * in the past
 * @property {Integer} state.lastFutureDate A ms timeStamp of the last date fetched
 * in the past
 * @property {Integer} state.nextPastPage The pagination value of the fixtures fetched
 * @property {Integer} state.nextFuturePage The pagination value of the fixtures fetched
 * make to the store
 * @return {Object} The new state with the modification applied
 */
function team(
  state = {
    fetchingFuture: false,
    fetchingPast: false,
    pastFixtures:[],
    todayFixtures: [],
    futureFixtures:[],
    lastPastDate: todayTime,
    lastFutureDate: todayTime,
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
        todayFixtures: [...state.todayFixtures, ...action.fixtureIDs],
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

/**
 * The Team Fixtures Store contains entities referenced by a team ID which hold
 * all the properties related to fixtures functionality for a team.
 * @method fixtureIDsByTeamID
 * @param  {Object} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to
 * make to the store
 * @property {Object} state
 * @property {Object} state.teamID An Object containing all fixture properties
 * belonging to a team where teamID is a valid Integer team ID
 * @return {Object} The new state with the modification applied
 */
export function fixtureIDsByTeamID(state={}, action){
  switch(action.type){
    case FIXTURES_INIT_TEAM:
    case FIXTURES_REQUEST_PAST_TEAM:
    case FIXTURES_REQUEST_FUTURE_TEAM:
    case FIXTURES_RECEIVE_PAST_TEAM:
    case FIXTURES_RECEIVE_TODAY_TEAM:
    case FIXTURES_RECEIVE_FUTURE_TEAM:
      return Object.assign({}, state, {
        [action.teamID]: team(state[action.teamID], action)
        });
    default:
      return state;
  }
}
