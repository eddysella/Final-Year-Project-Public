import {
  FIXTURES_REQUEST_FUTURE,
  FIXTURES_RECEIVE_FUTURE,
  FIXTURES_STORE_FUTURE_DATES,
  FIXTURES_REQUEST_FUTURE_TEAM,
  FIXTURES_RECEIVE_FUTURE_TEAM,
  FIXTURES_REQUEST_FUTURE_LEAGUE,
  FIXTURES_RECEIVE_FUTURE_LEAGUE,
  FIXTURES_RESET_FUTURE_LEAGUE_FETCH,
  FIXTURES_SET_SHOULD_FETCH_FUTURE_LEAGUE_TRUE,
} from '../types/fixtures'
import { getFixturesByLeagueAndDate, getFutureTeamFixtures, } from '../../fetch/FixturesV2';
import { storeFixturesByID, storeFixtureIDsByDate, receiveFutureFixtures,
  requestFutureFixtures, processTeamFixtures, processLeagueFixtures,
receiveTodayTeamFixtures, receiveTodayLeagueFixtures} from './fixtures'
/**
 * @module Redux Creators futureFixtures
 */

const todayTime = getTodayTime();
let counter = 0;

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
 * Sets the fetchingFuture property of the specified league
 * in the fixtureIDsByLeagueID store to true.
 * @method resetLeagueFetch
 * @param {Integer} leagueID
 * @return {Action} type: FIXTURES_RESET_FUTURE_LEAGUE_FETCH
 */
export function resetLeagueFetch(leagueID){
  return {
    type: FIXTURES_RESET_FUTURE_LEAGUE_FETCH,
    leagueID: leagueID,
  }
}

/**
 * Sets the shouldFetchFuture property of the specified league
 * in the fixtureIDsByLeagueID store to true.
 * @method setShouldFetchFutureTrue
 * @param {Integer} leagueID
 * @return {Action} type: FIXTURES_SET_SHOULD_FETCH_FUTURE_LEAGUE_TRUE
 */
export function setShouldFetchFutureTrue(leagueID){
  return {
    type: FIXTURES_SET_SHOULD_FETCH_FUTURE_LEAGUE_TRUE,
    leagueID: leagueID,
  }
}

/**
 * Should fetch fixtures test for a league or team.
 * @method shouldFetchFixtures
 * @param  {Boolean} fetching True if entity is fetching already, False Otherwise
 * @param  {Integer} lastDate TimeStamp of an entity's last received fixture
 * @param  {Integer} currentDate TimeStamp of the last date the fixtures screen is displaying
 * @return {Boolean}
 */
function shouldFetchFixtures(fetching, lastDate, currentDate){
  if(lastDate == 'STOP'){
    return false;
  }else if(fetching){
    return false;
  // if the date the screen is currently at is older or equal to the last fetched date, return true
  }else if (new Date(parseInt(currentDate)).getTime() >= new Date(parseInt(lastDate)).getTime()) {
    return true;
  }else if(currentDate === undefined){
    return true;
  }else{
    return false;
  }
}

/**
 * Concatenates an Array of timestamps to the futureDates store.
 * @method storeFutureDates
 * @param  {Array} dates A set of ms timestamps
 * @return {Action} type: FIXTURES_STORE_FUTURE_DATES
 */
export function storeFutureDates(dates){
  return {
    type: FIXTURES_STORE_FUTURE_DATES,
    dates: dates
  }
}

/**
 * Top level dispatch:
 * 1) Init counter of leagues+teams used for:
 *    1.1) Checking if there are any teams or leagues to fetch
 *    1.2) Signal to storeFutureDates that all entities have fetched and next
 *         date should be moved from dates array to displayed dates array.
 * 2) Sets the futureFetch property of the fixtureStatus store to true.
 * 3) Fetch future league fixtures
 * 4) Fetch future team fixtures
 * @method fetchFollowingFutureFixtures
 * @return {Function}
 */
export function fetchFollowingFutureFixtures(){
  return (dispatch, getState) => {
    let teamIDs = [...getState().followingTeamIDs];
    let leagueIDs = [...getState().followingLeagueIDs];
    counter = teamIDs.length + leagueIDs.length; // 1
    if(counter){
      dispatch( requestFutureFixtures()) // 2
    }
    if(leagueIDs.length){
      dispatch( fetchFutureLeagueFixtures(leagueIDs)) // 3
    }
    if(teamIDs.length){
      dispatch( fetchFutureTeamFixtures(teamIDs)) // 4
    }
  }
}

/**
 * Sets the fetchingFuture property of the fixtureIDsByTeamID store to true.
 * @method requestFutureTeamFixtures
 * @param  {Integer} teamID A Team ID
 * @return {Action} type: FIXTURES_REQUEST_FUTURE_TEAM
 */
export function requestFutureTeamFixtures(teamID){
  return {
    type: FIXTURES_REQUEST_FUTURE_TEAM,
    teamID: teamID,
  }
}

/**
 * Sets the fetchingFuture property of the fixtureIDsByTeamID store to false.
 * Adds the passed fixtures to the specified teamID.
 * Updates the lastFutureDate property to lastDate.
 * @method receiveFutureTeamFixtures
 * @param  {Integer} teamID A Team ID
 * @param  {Object} fixtures fixtureID : Object fixture
 * @param  {Integer} timeStamp A UNIX timestamp in milliseconds
 * @return {Action} type: FIXTURES_RECEIVE_FUTURE_TEAM
 */
export function receiveFutureTeamFixtures(teamID, fixtures, timeStamp){
  return {
    type: FIXTURES_RECEIVE_FUTURE_TEAM,
    teamID: teamID,
    fixtures: fixtures,
    date: timeStamp,
  }
}

/**
 * If counter is zero => all entities have fetched =>
 * Adds the next date from the future dates store to the
 * displayed dates (currentFutureDates) array in the fixtureStatus store.
 * A counter is required because all the fetches are async and therefore only
 * the last team/league to receive the fixtures must be allowed to update
 * the displayed dates.
 * @method storeFutureDate
 * @return {Function}
 */
function storeFutureDate(){
  return (dispatch, getState) => {
    if(counter == 0){
        let current = getState().fixturesStatus['currentFutureDates'].length
        if(getState().futureDates.length >= current){
          let date = getState().futureDates[current];
          dispatch( receiveFutureFixtures(date));
        }else{
          dispatch( receiveFutureFixtures(null));
        }
    }
  }
}

/**
 * Calls the fetchFutureTeam method for every teamID in the teamIDs array.
 * @method fetchFutureTeamFixtures
 * @param  {Array}                teamIDs A set of teamIDs
 * @param  {Boolean} overrideCheck Used by the teams-fixtures screen to continue
 * fetching data future what the fixtures tab is currently at.
 * @return {Function}
 */
export function fetchFutureTeamFixtures(teamIDs, overrideCheck = false){
  return (dispatch, getState) => {
    if(overrideCheck){
      counter = -1
    }
    let currentDate = getState().futureDates[getState().fixturesStatus['currentFutureDates'].length];
    let teamID = teamIDs[0]
    let team = getState().fixtureIDsByTeamID[teamID];
    if(shouldFetchFixtures(team.fetchingFuture, team.lastFutureDate, currentDate) || overrideCheck){
      dispatch(fetchTeamFixtures(teamIDs, overrideCheck));
    }else if(teamIDs.length>1){
        counter -= 1;
        teamIDs.shift()
        dispatch(fetchFutureTeamFixtures(teamIDs))
    }else{
      counter -= 1;
      dispatch(storeFutureDate());
    }
  }
}

/**
 * Fetch sequence for future team fixtures.
 * Team fixtures are fetched in sets of 20 fixtures.
 * @method fetchTeamFixtures
 * @param  {Integer} teamID Reference to a team
 * @param  {Integer} nextPage The index of the next set of fixtures to be fetched
 * @return {Function}
 */
function fetchTeamFixtures(teamIDs, overrideCheck){
  return (dispatch, getState) => {
    let teamID = teamIDs[0];
    let nextPage = getState().fixtureIDsByTeamID[teamID].nextFuturePage
    dispatch(requestFutureTeamFixtures(teamID))
    return getFutureTeamFixtures(teamID, nextPage)
    .then( data => processTeamFixtures(data, nextPage))
    .then( processedData => {
      if(!processedData){
        dispatch( receiveFutureTeamFixtures(teamID, [], 'STOP'));
        counter -= 1;
        dispatch( storeFutureDate());
      }else{
        dispatch( storeFixturesByID(processedData[0]));
        for (const date in processedData[1]){
          for (const league in processedData[1][date]){
              dispatch( storeFixtureIDsByDate(date, league, processedData[1][date][league]));
          }
        }
        let dates = Object.keys(processedData[1])
        const index = dates.indexOf("" + todayTime);
        if (index >= 0) {
          dates.splice(index, 1);
        }
        // fixtures are in order, so last date in array = last date received
        let lastDate = dates[dates.length-1];
        dispatch( storeFutureDates(dates)) // store all dates received
        dispatch( receiveTodayTeamFixtures(teamID, processedData[2]))
        dispatch( receiveFutureTeamFixtures(teamID, Object.keys(processedData[0]), lastDate));
        counter -= 1;
        dispatch( storeFutureDate());
        if(teamIDs.length>1){
          teamIDs.shift()
          dispatch(fetchFutureTeamFixtures(teamIDs))
        }
      }
    })
  }
}

/**
 * Sets the fetchingFuture property of the fixtureIDsByLeagueID store to true.
 * @method requestFutureLeagueFixtures
 * @param  {Integer} leagueID A League ID
 * @return {Action} type: FIXTURES_REQUEST_FUTURE_LEAGUE
 */
export function requestFutureLeagueFixtures(leagueID){
  return {
    type: FIXTURES_REQUEST_FUTURE_LEAGUE,
    leagueID: leagueID,
  }
}

/**
 * Sets the fetchingFuture property of the fixtureIDsByLeagueID store to false.
 * Sets the shouldFetchFuture property to false.
 * Adds the passed fixtures to the specified teamID.
 * Updates the lastFutureDate property to timeStamp.
 * Adds the new timeStamp to the futureDates array.
 * @method receiveFutureLeagueFixtures
 * @param  {Integer} teamID A Team ID
 * @param  {Object} fixtures fixtureID : Object fixture
 * @param  {Integer} timeStamp A UNIX timestamp in milliseconds
 * @return {Action} type: FIXTURES_RECEIVE_FUTURE_LEAGUE
 */
export function receiveFutureLeagueFixtures(leagueID, fixtures, timeStamp){
  return {
    type: FIXTURES_RECEIVE_FUTURE_LEAGUE,
    leagueID: leagueID,
    fixtures: fixtures,
    date: timeStamp,
  }
}

/**
 * Calculates tomorrow @ midnight millisecond timestamp.
 * @method getNextDate
 * @param  {Integer} timeStamp An arbitrary timeStamp
 * @return {Array} [yyyy-mm-dd, ms timeStamp]
 */
function getNextDate(timeStamp){
  let tomorrow = new Date(timeStamp);
  tomorrow.setDate(new Date(timeStamp).getDate() + 1)
  tomorrow.setHours(0,0,0,0)
  let fetchDate = tomorrow.toISOString().substring(0,10)
  return [fetchDate, tomorrow.getTime()];
}

/**
 * Tests whether fixtures are required for every league leagueID in the leagueIDs array.
 * Dispatches fetchLeagueFixtures for every leagueID.
 * @method fetchFutureLeagueFixtures
 * @param  {Array} leagueIDs A set of leagueIDs
 * @param  {Boolean} overrideCheck Defaults to false, used by the
 * leagues fixtures screen to override the fetch test.
 * @return {Function}
 */
export function fetchFutureLeagueFixtures(leagueIDs, overrideCheck = false){
  return (dispatch, getState) => {
    if(overrideCheck){
      counter = -1
    }
    let currentDate = getState().futureDates[getState().fixturesStatus['currentFutureDates'].length];
    let leagueID = leagueIDs[0]
    let league = getState().fixtureIDsByLeagueID[leagueID];
    if(shouldFetchFixtures(league.fetchingFuture, league.lastFutureDate, currentDate) || overrideCheck){
      let lastDate = getState().fixtureIDsByLeagueID[leagueID]['lastFutureDate']
      let seasonEnd = getState().leaguesByID[leagueID]['seasonEnd']
      if(lastDate <= seasonEnd){
        dispatch(fetchLeagueFixtures(leagueIDs, leagueID, lastDate));
      }
    }else if(leagueIDs.length>1){
      counter -= 1;
      leagueIDs.shift()
      dispatch(fetchFutureLeagueFixtures(leagueIDs))
    }else{
      counter -= 1;
      dispatch(storeFutureDate());
    }
  }
}

/**
 * Recursive fetch sequence for league fixtures.
 * League fixtures are fetched by date =>
 * If a date has no fixtures, the next date is checked until fixtures are found.
 * @method fetchLeagueFixtures
 * @param  {Array} leagueIDs An array containing a set of league IDs
 * @param  {Integer} lastDate Represents the date of the last received set of fixtures.
 * fetching data future what the fixtures tab is currently at.
 * @return {Function}
 */
function fetchLeagueFixtures(leagueIDs, leagueID, lastDate){
  return (dispatch, getState) => {
    let dates = getNextDate(lastDate);
    let fetchDate = dates[0] // yyyy-mm-dd
    let storeDate = dates[1] // ms timestamp
    dispatch(requestFutureLeagueFixtures(leagueID)) // read futureFixtures for more comments
    return getFixturesByLeagueAndDate(leagueID, fetchDate)
    .then( data => processLeagueFixtures(data))
    .then( processedData => {
      switch(processedData[0]){
        case "VALID":
          dispatch( storeFixturesByID(processedData[1])); // (id: Object fixture)
          for (const date in processedData[2]){
            for (const league in processedData[2][date]){
                dispatch( storeFixtureIDsByDate(date, league, processedData[2][date][league]));
            }   // Array of fixtureIDS
          }
          if(storeDate == todayTime){           // Array of fixtureIDs
            dispatch( receiveTodayLeagueFixtures(leagueID, processedData[3], storeDate))
            dispatch( resetLeagueFetch(leagueID));
            dispatch( fetchFutureLeagueFixtures(leagueIDs));
          }else{
            dispatch( storeFutureDates(Object.keys(processedData[2])))
            dispatch( receiveFutureLeagueFixtures(leagueID, processedData[4], storeDate));
          }
          counter -= 1;
          dispatch( storeFutureDate());
          if(leagueIDs.length>1){
            leagueIDs.shift()
            dispatch(fetchFutureLeagueFixtures(leagueIDs))
          }
          break;
        case "EMPTY":
          dispatch( resetLeagueFetch(leagueID)); // recursive call, new date is calculated at the top
          dispatch( fetchLeagueFixtures(leagueIDs, leagueID, storeDate));
          break;
        case "INVALID":
        //self-destroy
          break;
      }
    });
  }
}
