import {
  FIXTURES_REQUEST_PAST,
  FIXTURES_RECEIVE_PAST,
  FIXTURES_STORE_PAST_DATES,
  FIXTURES_REQUEST_PAST_TEAM,
  FIXTURES_RECEIVE_PAST_TEAM,
  FIXTURES_REQUEST_PAST_LEAGUE,
  FIXTURES_RECEIVE_PAST_LEAGUE,
  FIXTURES_RESET_PAST_LEAGUE_FETCH,
  FIXTURES_SET_SHOULD_FETCH_PAST_LEAGUE_TRUE,
} from '../types/fixtures'
import { getFixturesByLeagueAndDate, getPastTeamFixtures, } from '../../fetch/FixturesV2';
import { storeFixturesByID, storeFixtureIDsByDate, receivePastFixtures,
  requestPastFixtures, processTeamFixtures, processLeagueFixtures,
receiveTodayTeamFixtures, receiveTodayLeagueFixtures} from './fixtures'
/**
 * @module Redux Creators pastFixtures
 */

const todayTime = getTodayTime();
counter = null;

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
 * Sets the fetchingPast property of the specified league
 * in the fixtureIDsByLeagueID store to true.
 * @method resetLeagueFetch
 * @param {Integer} leagueID
 * @return {Action} type: FIXTURES_RESET_PAST_LEAGUE_FETCH
 */
export function resetLeagueFetch(leagueID){
  return {
    type: FIXTURES_RESET_PAST_LEAGUE_FETCH,
    leagueID: leagueID,
  }
}

/**
 * Sets the shouldFetchPast property of the specified league
 * in the fixtureIDsByLeagueID store to true.
 * @method setShouldFetchPastTrue
 * @param {Integer} leagueID
 * @return {Action} type: FIXTURES_SET_SHOULD_FETCH_PAST_LEAGUE_TRUE
 */
export function setShouldFetchPastTrue(leagueID){
  return {
    type: FIXTURES_SET_SHOULD_FETCH_PAST_LEAGUE_TRUE,
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
  }else if (new Date(parseInt(currentDate)).getTime() <= new Date(parseInt(lastDate)).getTime()) {
    return true;
  }else if(currentDate === undefined){
    return true;
  }else{
    return false;
  }
}

/**
 * Concatenates an Array of timestamps to the pastDates store.
 * @method storePastDates
 * @param  {Array} dates A set of ms timestamps
 * @return {Action} type: FIXTURES_STORE_PAST_DATES
 */
export function storePastDates(dates){
  return {
    type: FIXTURES_STORE_PAST_DATES,
    dates: dates,
  }
}

/**
 * Top level dispatch:
 * 1) Init counter of leagues+teams used for:
 *    1.1) Checking if there are any teams or leagues to fetch
 *    1.2) Signal to storePastDates that all entities have fetched and next
 *         date should be moved from dates array to displayed dates array.
 * 2) Sets the pastFetch property of the fixtureStatus store to true.
 * 3) Fetch past league fixtures
 * 4) Fetch past team fixtures
 * @method fetchFollowingPastFixtures
 * @return {Function}
 */
export function fetchFollowingPastFixtures(){
  return (dispatch, getState) => {
    teamIDs = getState().followingTeamIDs;
    leagueIDs = getState().followingLeagueIDs;
    counter = teamIDs.length + leagueIDs.length; // 1
    if(counter){
      dispatch( requestPastFixtures())  // 2
      dispatch( fetchPastLeagueFixtures(leagueIDs)) // 3
      dispatch( fetchPastTeamFixtures(teamIDs)) // 4
    }
  }
}

/**
 * Sets the fetchingPast property of the fixtureIDsByTeamID store to true.
 * @method requestPastTeamFixtures
 * @param  {Integer} teamID A Team ID
 * @return {Action} type: FIXTURES_REQUEST_PAST_TEAM
 */
export function requestPastTeamFixtures(teamID){
  return {
    type: FIXTURES_REQUEST_PAST_TEAM,
    teamID: teamID,
  }
}

/**
 * Sets the fetchingPast property of the fixtureIDsByTeamID store to false.
 * Adds the passed fixtures to the specified teamID.
 * Updates the lastPastDate property to lastDate.
 * @method receivePastTeamFixtures
 * @param  {Integer} teamID A Team ID
 * @param  {Object} fixtures fixtureID : Object fixture
 * @param  {Integer} timeStamp A UNIX timestamp in milliseconds
 * @return {Action} type: FIXTURES_RECEIVE_PAST_TEAM
 */
export function receivePastTeamFixtures(teamID, fixtures, timeStamp){
  return {
    type: FIXTURES_RECEIVE_PAST_TEAM,
    teamID: teamID,
    fixtures: fixtures,
    date: timeStamp,
  }
}

/**
 * If counter is zero => all entities have fetched =>
 * Adds the next date from the past dates store to the
 * displayed dates (currentPastDates) array in the fixtureStatus store.
 * A counter is required because all the fetches are async and therefore only
 * the last team/league to receive the fixtures must be allowed to update
 * the displayed dates.
 * @method storePastDate
 * @return {Function}
 */
function storePastDate(){
  return (dispatch, getState) => {
    if(counter == 0){
      current = getState().fixturesStatus['currentPastDates'].length
      date = getState().pastDates[current];
      dispatch( receivePastFixtures(date))
    }
  }
}

/**
 * Calls the fetchPastTeam method for every teamID in the teamIDs array.
 * @method fetchPastTeamFixtures
 * @param  {Array} teamIDs A set of teamIDs
 * @param  {Boolean} overrideCheck Used by the teams-fixtures screen to continue
 * fetching data past what the fixtures tab is currently at.
 * @return {Function}
 */
export function fetchPastTeamFixtures(teamIDs, overrideCheck = false){
  return (dispatch, getState) => {
    currentDate = getState().pastDates[getState().fixturesStatus['currentPastDates'].length];
    teamIDs.map( teamID => {
      team = getState().fixtureIDsByTeamID[teamID]
      if(shouldFetchFixtures(team.fetchingPast, team.lastPastDate, currentDate) || overrideCheck){
        dispatch(fetchTeamFixtures(teamID, team.nextPastPage));
      }else{
        counter -= 1;
        dispatch(storePastDate());
      }
    });
  }
}

/**
 * Fetch sequence for past team fixtures.
 * Team fixtures are fetched in sets of 20 fixtures.
 * @method fetchTeamFixtures
 * @param  {Integer} teamID Reference to a team
 * @param  {Integer} nextPage The index of the next set of fixtures to be fetched
 * @return {Function}
 */
function fetchTeamFixtures(teamID, nextPage){
  return (dispatch,getState) => {
    dispatch(requestPastTeamFixtures(teamID))
    return getPastTeamFixtures(teamID, nextPage)
    .then( data => processTeamFixtures(data, nextPage))
    .then( processedData => {
      if(processedData){
        dispatch( storeFixturesByID(processedData[0]));
        for (const date in processedData[1]){
          for (const league in processedData[1][date]){
              dispatch( storeFixtureIDsByDate(date, league, processedData[1][date][league]));
          }
        }
        dates = Object.keys(processedData[1])
        const index = dates.indexOf("" + todayTime);
        if (index >= 0) {
          dates.splice(index, 1);
        }
        // fixtures are in order, so last date in array = last date received
        lastDate = dates[dates.length-1]
        dispatch( storePastDates(dates))
        dispatch( receiveTodayTeamFixtures(teamID, processedData[2]))
        dispatch( receivePastTeamFixtures(teamID, Object.keys(processedData[0]), lastDate))
        counter -= 1;
        dispatch( storePastDate());
      }else{
        dispatch( receivePastTeamFixtures(teamID, [], 'STOP'));
      }
    })
  }
}

/**
 * Sets the fetchingPast property of the fixtureIDsByLeagueID store to true.
 * @method requestPastLeagueFixtures
 * @param  {Integer} leagueID A League ID
 * @return {Action} type: FIXTURES_REQUEST_PAST_LEAGUE
 */
export function requestPastLeagueFixtures(leagueID){
  return {
    type: FIXTURES_REQUEST_PAST_LEAGUE,
    leagueID: leagueID,
  }
}

/**
 * Sets the fetchingPast property of the fixtureIDsByLeagueID store to false.
 * Sets the shouldFetchPast property to false.
 * Adds the passed fixtures to the specified teamID.
 * Updates the lastPastDate property to timeStamp.
 * Adds the new timeStamp to the pastDates array.
 * @method receivePastLeagueFixtures
 * @param  {Integer} teamID A Team ID
 * @param  {Object} fixtures fixtureID : Object fixture
 * @param  {Integer} timeStamp A UNIX timestamp in milliseconds
 * @return {Action} type: FIXTURES_RECEIVE_PAST_LEAGUE
 */
export function receivePastLeagueFixtures(leagueID, fixtures,  timeStamp){
  return {
    type: FIXTURES_RECEIVE_PAST_LEAGUE,
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
  const yesterday = new Date(timeStamp);
  yesterday.setDate(new Date(timeStamp).getDate() - 1)
  yesterday.setHours(0,0,0,0)
  fetchDate = yesterday.toISOString().substring(0,10)
  return [fetchDate, yesterday.getTime()];
}

/**
 * Calls the fetchPastLeague method for every leagueID in the leagueIDs array.
 * @method fetchPastLeagueFixtures
 * @param  {Array} leagueIDs A set of leagueIDs
 * @param  {Boolean} overrideCheck Defaults to false, used by the
 * leagues fixtures screen to override the fetch test.
 * @return {Function}
 */
export function fetchPastLeagueFixtures(leagueIDs, overrideCheck=false){
  return (dispatch, getState) => {
    currentDate = getState().pastDates[getState().fixturesStatus['currentPastDates'].length];
    leagueIDs.map( leagueID => {
      lastDate = getState().fixtureIDsByLeagueID[leagueID]['lastPastDate']
      seasonStart = getState().leaguesByID[leagueID]['seasonStart']
      dispatch(fetchLeagueFixtures(leagueID, lastDate, currentDate, seasonStart, overrideCheck));
    });
  }
}

/**
 * Recursive fetch sequence for league fixtures.
 * League fixtures are fetched by date =>
 * If a date has no fixtures, the next date is checked until fixtures are found.
 * @method fetchLeagueFixtures
 * @param  {Integer} leagueID An ID referencing a league
 * @param  {Integer} lastDate Represents the date of the last received set of fixtures.
 * @param  {Integer} currentDate A ms timestamp of the last displayed date in the fixtures screen.
 * @param  {Integer} seasonEnd A ms timestamp
 * @param  {Boolean} overrideCheck Used by the league-fixtures screen to continue
 * fetching data past what the fixtures tab is currently at.
 * @return {Function}
 */
function fetchLeagueFixtures(leagueID, lastDate, currentDate, seasonStart, overrideCheck){
  return (dispatch, getState) => {
    fetching = getState().fixtureIDsByLeagueID[leagueID]['fetchingPast']
    // overrideCheck is for the league screen
    if(lastDate >= seasonStart){
      if(shouldFetchFixtures(fetching, lastDate, currentDate) || overrideCheck){
        dates = getNextDate(lastDate);
        fetchDate = dates[0] // yyyy-mm-dd
        storeDate = dates[1] // ms timestamp
        dispatch(requestPastLeagueFixtures(leagueID)) // read pastFixtures for more comments
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
              dispatch( storePastDates(Object.keys(processedData[2])))
              dispatch( receivePastLeagueFixtures(leagueID, processedData[4], storeDate));
              counter -= 1;
              dispatch( storePastDate());
              break;
            case "EMPTY":
              dispatch( resetLeagueFetch(leagueID)); // recursive call, new date is calculated at the top
              dispatch( fetchLeagueFixtures(leagueID, storeDate, currentDate, seasonStart, overrideCheck));
              break;
            case "INVALID":
            //self-destroy
              break;
          }
        });
      }else{
        counter -= 1;
        dispatch(storePastDate());
      }
    }
  }
}
