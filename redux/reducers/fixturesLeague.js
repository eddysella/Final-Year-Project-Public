import {
  FIXTURES_INIT_LEAGUE,
  FIXTURES_REQUEST_PAST_LEAGUE,
  FIXTURES_RECEIVE_PAST_LEAGUE,
  FIXTURES_RESET_PAST_LEAGUE_FETCH,
  FIXTURES_RECEIVE_TODAY_LEAGUE,
  FIXTURES_REQUEST_FUTURE_LEAGUE,
  FIXTURES_RECEIVE_FUTURE_LEAGUE,
  FIXTURES_RESET_FUTURE_LEAGUE_FETCH,
  FIXTURES_SET_SHOULD_FETCH_PAST_LEAGUE_TRUE,
  FIXTURES_SET_SHOULD_FETCH_FUTURE_LEAGUE_TRUE,
} from '../types/fixtures'
/**
 * @module Redux Reducers fixturesLeague
 */
const todayTime = getTime(true);
const yesterdayTime = getTime(false);
// const todayTime = 1000; // values for testing
// const yesterdayTime = 999; // values for testing

/**
 * Calculates the timeStamp of today or yesterday @ midnight.
 * @method getTodayTime
 * @return {Integer} A Millisecond timestamp
 */
function getTime(bool){
  today = new Date()
  today.setHours(0,0,0,0)
  if(bool){
    return today.getTime()
  }else{
    yesterday = new Date();
    yesterday.setDate(today.getDate() - 1)
    return yesterday.getTime();
  }
}

/**
 * An entity in the fixtureIDsByLeagueID store Holds all properties belonging to a single league.
 * There is a shouldFetch and a fetch for future and past. The fetch alternates
 * between true and false during the search for the next date. Should fetch
 * acts as a transaction flag for the search process and is used in the UI.
 * @method league
 * @param  {Object} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to
 * make to the store
 * @property {Object} state
 * @property {Boolean} state.fetchingFuture Default=false Set to true when fetching
 * future fixtures, false otherwise
 * @property {Boolean} state.shouldFetchFuture Default=false Set to true when fetching
 * future fixtures, false otherwise, used for UI
 * @property {Boolean} state.fetchingPast Default=false Set to true when fetching
 * past fixtures, false otherwise
 * @property {Boolean} state.shouldFetchPast Default=false Set to true when fetching
 * past fixtures, false otherwise, used for UI
 * @property {Array} state.pastDates [Integer] Contains all the timestamps of the received past fixtures.
 * @property {Array} state.futureDates [Integer] Contains all the timestamps of the received future fixtures.
 * @property {Array} state.pastFixtures [Integer] A set of fixture IDs
 * @property {Array} state.todayFixtures [Integer] A set of fixture IDs
 * @property {Array} state.futureFixtures [Integer] A set of fixture IDs
 * @property {Integer} state.lastPastDate A ms timeStamp of the last date fetched
 * in the past
 * @property {Integer} state.lastFutureDate A ms timeStamp of the last date fetched
 * in the past
 * @return {Object} The new state with the modification applied
 */
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
    lastPastDate: todayTime,
    lastFutureDate: yesterdayTime,
  },
  action
  ){
  switch(action.type){
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
          todayFixtures: [...state.todayFixtures, ...action.fixtureIDs],
          lastFutureDate: action.date,
        });  // TODO: turn this to two types of today
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

/**
 * The League Fixtures Store contains entities referenced by a league ID which hold
 * all the properties related to fixtures functionality for a league.
 * @method fixtureIDsByLeagueID
 * @param  {Object} state The current state of the store.
 * @param {Object} action (propertyName : property) The modification to
 * make to the store
 * @property {Object} state
 * @property {Object} state.leagueID An Object containing all fixture properties
 * belonging to a league where leagueID is a valid Integer league ID
 * @return {Object} The new state with the modification applied
 */
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
      return Object.assign({}, state, {
        [action.leagueID]: league(state[action.leagueID], action)
        });
    default:
      return state;
  }
}
