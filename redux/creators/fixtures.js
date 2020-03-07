import {
  FIXTURES_STORE_BY_ID,
  FIXTURES_STORE_BY_DATE,
  FIXTURES_REQUEST_PAST,
  FIXTURES_RECEIVE_PAST,
  FIXTURES_RECEIVE_TODAY_LEAGUE,
  FIXTURES_RECEIVE_TODAY_TEAM,
  FIXTURES_REQUEST_FUTURE,
  FIXTURES_RECEIVE_FUTURE,
  FIXTURES_INIT_LEAGUE,
  FIXTURES_INIT_TEAM,
  FIXTURES_RESET,
} from '../types/fixtures'
import { fetchPastTeamFixtures, fetchPastLeagueFixtures } from './pastFixtures';
import { fetchFutureTeamFixtures, fetchFutureLeagueFixtures, receiveFutureLeagueFixtures } from './futureFixtures';
/**
 * @module Redux Creators fixtures
 */

const todayTime = getTodayTime();

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
 * Clears the currentPastDates and currentFutureDates arrays in the fixturesStatus store.
 * @method resetFixtures
 * @return {Action} type: FIXTURES_RESET
 */
export function resetFixtures(){
  return {
    type: FIXTURES_RESET,
  }
}

/**
 * Stores an Object with (fixtureID:data) properties into the fixturesByID store.
 * @method storeFixturesByID
 * @param  {Object} fixtures id : Object
 * @return {Action} type: FIXTURES_STORE_BY_ID
 */
export function storeFixturesByID(fixtures){
  return {
    type: FIXTURES_STORE_BY_ID,
    fixtures: fixtures,
  }
}

/**
 * Stores an Object with (date:fixtureIDs) properties into the fixtureIDsByDateLeagueID store.
 * @method storeFixtureIDsByDate
 * @param  {Integer} date A UNIX timestamp in milliseconds
 * @param  {Integer} leagueID A league ID
 * @param  {Object} fixtures date : fixtureIDs
 * @return {Action} type: FIXTURES_STORE_BY_DATE
 */
export function storeFixtureIDsByDate(date, leagueID, fixtures){
  return {
    type: FIXTURES_STORE_BY_DATE,
    date: date,
    leagueID: leagueID,
    fixtures: fixtures,
  }
}

/**
 * Sets the pastFetch property of the fixturesStatus store to true.
 * @method requestPastFixtures
 * @return {Action} type: FIXTURES_REQUEST_PAST
 */
export function requestPastFixtures(){
  return {
    type: FIXTURES_REQUEST_PAST,
  }
}

/**
 * Sets the pastFetch property of the fixturesStatus store to false.
 * Adds the passed timeStamp to the currentPastDates array in the fixturesStatus store.
 * @method receivePastFixtures
 * @param {Integer} timeStamp UNIX timeStamp ms
 * @return {Action} type: FIXTURES_RECEIVE_PAST
 */
export function receivePastFixtures(timeStamp){
  return {
    type: FIXTURES_RECEIVE_PAST,
    timeStamp: timeStamp,
  }
}

/**
 * Sets the futureFetch property of the fixturesStatus store to true.
 * @method requestFutureFixtures
 * @return {Action} type: FIXTURES_REQUEST_FUTURE
 */
export function requestFutureFixtures(){
  return {
    type: FIXTURES_REQUEST_FUTURE,
  }
}

/**
 * Sets the futureFetch property of the fixturesStatus store to false.
 * Adds the passed timeStamp to the currentFutureDates array in the fixturesStatus store.
 * @method receiveFutureFixtures
 * @param {Integer} timeStamp UNIX timeStamp ms
 * @return {Action} type: FIXTURES_RECEIVE_FUTURE
 */
export function receiveFutureFixtures(timeStamp){
  return {
    type: FIXTURES_RECEIVE_FUTURE,
    timeStamp: timeStamp,
  }
}

/**
 * Adds a set of fixtureIDs for the specified league for today into fixtureIDsByLeagueID store.
 * @method receiveTodayLeagueFixtures
 * @param  {Integer} leagueID A League ID
 * @param  {Array} fixtureIDs A set of fixture IDs
 * @return {Action} type: FIXTURES_RECEIVE_TODAY_LEAGUE
 */
export function receiveTodayLeagueFixtures(leagueID, fixtureIDs, date){
  return {
    type: FIXTURES_RECEIVE_TODAY_LEAGUE,
    leagueID: leagueID,
    fixtureIDs: fixtureIDs,
    date: date,
  }
}

/**
 * Adds a set of fixtureIDs for the specified team for today into the fixtureIDsByTeamID store.
 * @method receiveTodayLeagueFixtures
 * @param  {Integer} teamID A Team ID
 * @param  {Array} fixtureIDs A set of fixture IDs
 * @return {Action} type: FIXTURES_RECEIVE_TODAY_TEAM
 */
export function receiveTodayTeamFixtures(teamID, fixtureIDs){
  return {
    type: FIXTURES_RECEIVE_TODAY_TEAM,
    teamID: teamID,
    fixtureIDs: fixtureIDs,
  }
}

/**
 * Initializes properties for the passed leagueID in the fixtureIDsByLeagueID store.
 * @method initFixturesForLeague
 * @param  {Integer} leagueID A League ID
 * @return {Action} type: FIXTURES_INIT_LEAGUE
 */
export function initFixturesForLeague(leagueID){
  return {
    type: FIXTURES_INIT_LEAGUE,
    leagueID: leagueID,
  }
}

/**
 * Initializes properties for the passed teamID in the fixtureIDsByTeamID store.
 * @method initFixturesForTeam
 * @param  {Integer} teamID A Team ID
 * @return {Action} type: FIXTURES_INIT_TEAM
 */
export function initFixturesForTeam(teamID){
  return {
    type: FIXTURES_INIT_TEAM,
    teamID: teamID,
  }
}

/**
 * Top level dispatch:
 * 1) Initialization of fixtures stores
 * 2) Initial fetch for followed entities
 * @method initFixtures
 * @return Function
 */
export function initFixtures(){
  return (dispatch, getState) => {
    dispatch(initLeagues()) // 1
    dispatch(initTeams()) // 2
  }
}

/**
 * Dispatches the initialization procedure for each followed league.
 * @method initLeagues
 * @return {Function}
 */
function initLeagues(){
  return (dispatch, getState) => {
    leagueIDs = getState().followingLeagueIDs;
    leagueIDs.map( leagueID => {
      dispatch(initLeague(leagueID))
    })
  }
}

/**
 * Tests for existence of the league in fixtureIDsByLeagueID.
 * Initializes properties, referenced by leagueID, in the fixtureIDsByLeagueID store.
 * Dispatches a fetch Future fixtures for the league to shift the initial date to fetch
 * from today to tomorrow.
 * @method initLeague
 * @param  {Integer}   leagueID A League ID
 * @return {Function}
 */
export function initLeague(leagueID){
  return (dispatch, getState) => {
    if(getState().fixtureIDsByLeagueID[leagueID] === undefined){
      dispatch(initFixturesForLeague(leagueID))
      dispatch(fetchFutureLeagueFixtures([leagueID]))
    }
  }
}

/**
 * Dispatches the initialization procedure for each followed team.
 * @method initTeams
 * @return {Function}
 */
function initTeams(){
  return (dispatch, getState) => {
    teamIDs = getState().followingTeamIDs;
    teamIDs.map( teamID => {
      dispatch(initTeam(teamID))
    })
  }
}

/**
 * Tests for existence of the team in fixtureIDsByTeamID.
 * Initializes properties, referenced by teamID, in the fixtureIDsByTeamID store.
 * Dispatches a fetch Past fixtures for the team.
 * Dispatches a fetch Future fixtures for the team.
 * @method initTeam
 * @param  {Integer}   teamID A Team ID
 * @return {Function}
 */
export function initTeam(teamID){
  return (dispatch, getState) => {
    if(getState().fixtureIDsByTeamID[teamID] === undefined){
      dispatch(initFixturesForTeam(teamID))
      dispatch(fetchPastTeamFixtures([teamID]))
      dispatch(fetchFutureTeamFixtures([teamID]))
    }
  }
}

/**
 * Processes a fixtures status information into a single status String
 * according to the status type.
 * @method processFixtureStatus
 * @param  {Array} data [
 *  0 : [String] Status type
 *  1 : [Integer] Fixture timestamp
 *  2 : [Integer] Home team goals
 *  3 : [Integer] Away team goals
 *  4 : [Integer] Time elapsed
 * ]
 * @return {String}                  [Composed status]
 */
export function processFixtureStatus(data){
  status='';
  if(data[0] == 'NS'){
      var date = new Date(data[1]*1000);
      // Hours part from the timestamp
      var hours = date.getHours();
      // Minutes part from the timestamp
      var minutes = "0" + date.getMinutes();
      // Will display time in 10:30:23 format
      status = hours + ':' + minutes.substr(-2);
  }else if (['HT', 'FT'].includes(data[0])){
      status = String(data[2] + "  " + data[0] + "  " + data[3]);
  }else if (['1H','2H','ET','P'].includes(data[0])){
      status = String(data[2] + "  " + data[4] + "'  " + data[3]);
  }else{
    status = data[0];
  }
  return status
}

/**
 * Processes a set of fixtures for a Team.
 * @method processTeamFixtures
 * @param  {Object} data A parsed JSON Object
 * @param  {Integer}            page The current pagination value for a team
 * @return {Array} [
 * 0 : [Object] (fixtureID:data)
 * 1 : [Object] (Date: [Object] (League:fixtureIDs))
 * 2 : [Array] A set of fixture IDs for today
 * ]
 */
export function processTeamFixtures(data, page){
  if(data === undefined || data.api.results == 0){
    return null;
  }
  todayIDs=[];
  fixByDateLeague={};
  fixByID={};
  data = data.api;
  fixtures = data.fixtures;

  if(page > 1){
    fixtures.splice(0, (20*(page-1)))
  }
  fixtures.forEach( fixture => {
    date = new Date(fixture.event_timestamp*1000)
    date.setHours(0,0,0,0)
    timeStamp = date.getTime()
    leagueID = "" + fixture.league_id;
    fixtureID = fixture.fixture_id;

    if(!(timeStamp in fixByDateLeague)){
      fixByDateLeague[timeStamp] = {}
    }
    if(!(leagueID in fixByDateLeague[timeStamp])){
      fixByDateLeague[timeStamp][leagueID] = []
    }
    if(timeStamp == todayTime){
      todayIDs.push(fixtureID);
    }
    fixByDateLeague[timeStamp][leagueID].push(fixtureID);
    status = processFixtureStatus([
      fixture.statusShort,
      fixture.event_timestamp,
      fixture.goalsHomeTeam,
      fixture.goalsAwayTeam,
      fixture.elapsed
    ])
    fixByID[fixtureID] = {
      id: fixtureID,
      date: timeStamp,
      status: status,
      elapsed:fixture.elapsed,
      league: fixture.league,
      homeTeam:fixture.homeTeam,
      awayTeam:fixture.awayTeam,
      goalsHome:String(fixture.goalsHomeTeam),
      goalsAway:String(fixture.goalsAwayTeam),
      statusShort: fixture.statusShort,
    };
  });
  return [fixByID, fixByDateLeague, todayIDs];
}

/**
 * Processes a set of fixtures for a League.
 * @method processLeagueFixtures
 * @param  {Object} data A parsed JSON Object
 * @return {Array} [
 * 0 : [Object] (fixtureID:data)
 * 1 : [Object] (Date: [Object] (League:fixtureIDs))
 * 2 : [Array] A set of fixture IDs for today
 * 3 : [Object] (Date: [Array] fixtureIDs)
 * ]
 */
export function processLeagueFixtures(data){
  if(data === undefined){
    return ["INVALID"];
  }else if(data.api.results == 0){
    return ["EMPTY"];
  }
  todayIDs=[];
  fixByDateLeague={};
  fixByID={};
  fixByDate={};
  data = data.api;
  fixtures = data.fixtures;

  fixtures.forEach( fixture => {
    date = new Date(fixture.event_timestamp*1000)
    date.setHours(0,0,0,0)
    timeStamp = date.getTime()
    leagueID = fixture.league_id;
    fixtureID = fixture.fixture_id;

    if(!(timeStamp in fixByDateLeague)){
      fixByDate[timeStamp] = []
      fixByDateLeague[timeStamp] = {}
    }
    if(!(leagueID in fixByDateLeague[timeStamp])){
      fixByDateLeague[timeStamp][leagueID] = []
    }
    if(timeStamp == todayTime){
      todayIDs.push(fixtureID);
    }
    fixByDate[timeStamp].push(fixtureID)
    fixByDateLeague[timeStamp][leagueID].push(fixtureID);
    status = processFixtureStatus([
      fixture.statusShort,
      fixture.event_timestamp,
      fixture.goalsHomeTeam,
      fixture.goalsAwayTeam,
      fixture.elapsed
    ])
    fixByID[fixtureID] = {
      id: fixtureID,
      date: timeStamp,
      status: status,
      elapsed:fixture.elapsed,
      league: fixture.league,
      homeTeam:fixture.homeTeam,
      awayTeam:fixture.awayTeam,
      goalsHome:String(fixture.goalsHomeTeam),
      goalsAway:String(fixture.goalsAwayTeam),
      statusShort: fixture.statusShort,
    };
  });
  return ["VALID", fixByID, fixByDateLeague, todayIDs, fixByDate];
}
