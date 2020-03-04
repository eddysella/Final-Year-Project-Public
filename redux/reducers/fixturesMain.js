import {
FIXTURES_RESET,
FIXTURES_STORE_BY_ID,
FIXTURES_STORE_BY_DATE,
FIXTURES_STORE_PAST_DATES,
FIXTURES_STORE_FUTURE_DATES,
FIXTURES_REQUEST_PAST,
FIXTURES_RECEIVE_PAST,
FIXTURES_REQUEST_FUTURE,
FIXTURES_RECEIVE_FUTURE,
FIXTURES_REQUEST_STATS,
FIXTURES_RECEIVE_STATS,
} from '../types/fixtures'
/**
 * @module Redux Reducers fixturesMain
 */
// Source: https://github.com/jherax/array-sort-by
import sortBy from 'array-sort-by';

/**
 * All properties regarding the functionality of fixtures tab.
 * @method fixturesStatus
 * @param {Object} state Holds all properties regarding the current state of the
 * fixtures tab.
 * @param {Object} action (propertyName : property) The modification to make to the store.
 * @property {Object} state
 * @property {Array} state.pastDates [Integer] Contains all the timestamps of
 * of the dates currently displayed.
 * @property {Array} state.futureDates [Integer] Contains all the timestamps of
 * of the dates currently displayed.
 * @property {Boolean} state.pastFetch Default=false Set to true when fetching
 * past fixtures, false otherwise
 * @property {Boolean} state.futureFetch Default=false Set to true when fetching
 * future fixtures, false otherwise
 * @return {Object} The new state with the modification applied
 */
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
        currentPastDates: [...state.currentPastDates, action.timeStamp]
      });
    case FIXTURES_REQUEST_FUTURE:
      return Object.assign({}, state, { futureFetch: true, });
    case FIXTURES_RECEIVE_FUTURE:
      return Object.assign({}, state, {
        futureFetch: false,
        currentFutureDates: [...state.currentFutureDates, action.timeStamp]
      });
    default:
      return state;
  }
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
 * An array containing a unique set of all the past timestamps in order that
 * fixtures have been fetched so far.
 * @method team
 * @param {Array} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to make to the store
 * @return {Array} A new set with additional timestamps
 */
export function pastDates(state=[], action){
  switch(action.type){
    case FIXTURES_STORE_PAST_DATES:
      return sortBy(filterArray([...state, ...action.dates]), s => -s);
    default:
      return state;
  }
}

/**
 * An array containing a unique set of all the future timestamps in order that
 * fixtures have been fetched so far.
 * @method team
 * @param {Array} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to make to the store
 * @return {Array} A new set with additional timestamps
 */
export function futureDates(state=[], action){
  switch(action.type){
    case FIXTURES_STORE_FUTURE_DATES:
      return sortBy(filterArray([...state, ...action.dates]));
    default:
      return state;
  }
}

/**
 * An entity in the fixtureIDsByDateLeague store, holds all fixtures referenced
 * by league which belong to a specific date.
 * @method date
 * @param {Object} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to make to the store
 * @property {Object} state
 * @property {Array} state.leagueID An array of unique fixtureIDs.
 * @return {Object} The new state with the modification applied
 */
function date(state={}, action){
  switch(action.type){
    case FIXTURES_STORE_BY_DATE:
    if(state[action.leagueID]){
      return Object.assign({}, state, {
          [action.leagueID]: sortBy(filterArray([...state[action.leagueID], ...action.fixtures])),
        });
    }else{
      return Object.assign({}, state, {
          [action.leagueID]: action.fixtures,
        });
    }
    default:
      return state;
  }
}

/**
 * The fixtures by Date and League store contains (leagueID : [Array] fixtureID)
 * entities referenced by timestamps representing a specific date.
 * @method fixtureIDsByDateLeague
 * @param {Object} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to make to the store
 * @property {Object} state
 * @property {Object} state.date An Object containing 0-* Objects referenced by league ID
 * @return {Object} The new state with the modification applied
 */
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

/**
 * An entity in the fixturesByID store, holds all properties belonging a single
 * fixture.
 * @method fixture
 * @param {Object} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to make to the store
 * @return {Object} The new state with the modification applied
 */
function fixture(state={}, action){
  switch(action.type){
    case FIXTURES_RECEIVE_STATS:
    return Object.assign({}, state, action.stats);
    default:
      return state;
  }
}

/**
 * The fixtures by ID store contains entities referenced by a fixture ID which
 * holds all the poperties related to a single fixture.
 * @method fixturesByID
 * @param {Object} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to make to the store
 * @property {Object} state
 * @property {Boolean} state.fetching Default=false Set to true when fetching
 * more data for a specific fixture, false otherwise
 * @property {Object} state.fixtureID An Object containing all fixture properties
 * belonging to a fixture where fixtureID is a valid Integer fixture ID
 * @return {Object} The new state with the modification applied
 */
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
