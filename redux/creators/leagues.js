import {
  LEAGUE_REQUEST_BY_ID,
  LEAGUE_RECEIVE_BY_ID,
  REQUEST_FIXTURES_BY_LEAGUE,
  RECEIVE_FIXTURES_BY_LEAGUE,
  LEAGUE_REQUEST_TEAMS,
  LEAGUE_RECEIVE_TEAMS,
  LEAGUE_RECEIVE_MULTIPLE_LEAGUES,
} from '../types/leagues'
import { getAllSeasonsForLeague } from '../../fetch/League'
import { getFixturesByLeagueAndDate } from '../../fetch/Fixtures'
import { getTeamsByLeagueID } from '../../fetch/Team'
import { receiveMultipleTeams } from './teams'
import { initFixtures } from './fixtures'
/**
 * @module Redux Creators leagues
 */

/**
 * Sets the fetchingLeague property of the specified league in leaguesByID store to true.
 * @method requestLeagueByID
 * @param  {Integer} leagueID A league ID
 * @return {Action} type: LEAGUE_REQUEST_BY_ID
 */
export function requestLeagueByID(leagueID){
  return {
    type: LEAGUE_REQUEST_BY_ID,
    leagueID: leagueID,
  };
}

/**
 * Sets the fetchingLeague property of the specified league in leaguesByID store to false.
 * Stores a league name.
 * Stores a country code.
 * Stores a uri address for a logo.
 * @method receiveLeagueByID
 * @param  {Object} league (league : properties)
 * @return {Action} type: LEAGUE_RECEIVE_BY_ID
 */
export function receiveLeagueByID(league){
  return {
    type: LEAGUE_RECEIVE_BY_ID,
    leagueID: league.leagueID,
    name: league.name,
    countryCode: league.countryCode,
    logo: league.logo,
    seasonStart: league.seasonStart,
    seasonEnd: league.seasonEnd,
  };
}

/**
 * Should Fetch test for a league.
 * @method shouldFetchLeague
 * @param  {Object} league (league : properties)
 * @return {Boolean} True if !null false otherwise.
 */
function shouldFetchLeague(league){
  if(!league){
    return true;
  }else if(league.fetchingLeague){
    return false;
  }
}

/**
 * Fetch sequence for a league.
 * @method fetchLeagues
 * @param  {Array} leagueIDs A set of league IDs
 * @return {Function}
 */
export function fetchLeagues(leagueIDs){
  return (dispatch, getState) => {
    if(leagueIDs.length){
      let counter = leagueIDs.length
      leagueIDs.map( leagueID => {
        if(shouldFetchLeague(getState().leaguesByID[leagueID])){
          dispatch(requestLeagueByID(leagueID))
          return getAllSeasonsForLeague(leagueID)
            // get latest season
          .then( data => processLeague(data))
          .then( processedData => {
            dispatch( receiveLeagueByID(processedData));
            counter-=1;
            if(counter == 0){
              dispatch(initFixtures())
            }
          })
        }
      });
    }else{
        dispatch(initFixtures())
    }
  }
}

/**
 * Converts the received API date string to a ms timestamp.
 * @method dateToTimeStamp
 * @param  {String} date A date in dd-mm-yyyy format
 * @return {Integer} A ms timestamp
 */
function dateToTimeStamp(date){
  pieces = date.trim().split('-');
  timeStamp = Date.UTC(parseInt(pieces[0]), parseInt(pieces[1], 10)-1, parseInt(pieces[2], 10));
  return timeStamp
}

/**
 * Processes league data into a league Object.
 * @method processLeague
 * @param  {Object} data An formatted Object containing league data.
 * @return {Object} (propertyName : property)
 */
function processLeague(data){
  data = data.api;
  leagues = data.leagues;
  league = leagues[leagues.length-1]
  return {
      leagueID: league.league_id,
      name: league.country + " " + league.name,
      countryCode: league.country_code,
      logo: league.logo,
      seasonStart: dateToTimeStamp(league.season_start),
      seasonEnd: dateToTimeStamp(league.season_end),
  };
}

/**
 * Sets the fetchingTeams property in the leaguesByID store to true.
 * @method requestTeamsByID
 * @param  {Integer} leagueID A league ID
 * @return {Action} type: LEAGUE_REQUEST_TEAMS
 */
export function requestTeamsByID(leagueID){
  return {
    type: LEAGUE_REQUEST_TEAMS,
    leagueID: leagueID,
  };
}

/**
* Sets the fetchingTeams property in the leaguesByID store to false.
* Stores the passed teamIDs into the store for the specified league.
 * @method receiveTeamsByID
 * @param  {Array} teamIDs  A set of team IDs
 * @param  {Integer} leagueID A league ID
 * @return {Action} type: LEAGUE_RECEIVE_TEAMS
 */
export function receiveTeamsByID(teamIDs, leagueID){
  return {
    type: LEAGUE_RECEIVE_TEAMS,
    teamIDs: teamIDs,
    leagueID: leagueID,
  };
}

/**
 * Should fetch test for a team.
 * @method shouldFetchTeams
 * @param  {Object} league A league Object
 * @return {Boolean}
 */
function shouldFetchTeams(league){
  if(!league.teamIDs){
    return true;
  }else if(league.fetchingTeams){
    return false;
  }
}

/**
 * Fetch sequence for teams of a league.
 * Fetches all teams belonging to the specified league.
 * @method fetchTeams
 * @param  {Integer} leagueID A league ID
 * @return {Function}
 */
export function fetchTeams(leagueID){
  return (dispatch, getState) => {
    if(shouldFetchTeams(getState().leaguesByID[leagueID])){
      dispatch(requestTeamsByID(leagueID))
      return getTeamsByLeagueID(leagueID)
      .then( data => processTeams(data))
      .then( processedData => {
          dispatch(receiveMultipleTeams(processedData));
          dispatch(receiveTeamsByID(Object.keys(processedData), leagueID));
      })
    }
  }
}

/**
 * Since teams are grouped in a single object initialization parameters such as
 * fetch flags must be included as well.
 * @method processTeams
 * @param  {Object} data A parsed JSON Object
 * @return {Object} (teamID : data)
 */
export function processTeams(data){
  collect = {};
  ids = [];
  data = data.api;
  teams = data.teams;
  teams.forEach( team => {
    collect[team.team_id] = {
      fetchingTeam: false,
      fetchingLeagues: false,
      fetchingPast: false,
      fetchingPlayers: false,
      fetchingFuture: false,
      teamID: team.team_id,
      name: team.name,
      logo: team.logo,
      country: team.country,
    }
  })
  return collect;
}

/**
 * Processes a set of teams for a League.
 * @method processLeagues
 * @param  {Object} data A parsed JSON Object
 * @return {Array} [
 * 0 : [Array] A set of ids belonging to the processed teams.
 * 2 : [Object] (teamID : data)
 * ]
 */
export function processLeagues(data){
  collect = {};
  ids = [];
  data = data.api;
  leagues = data.leagues;
  count = 0
  for (leagueID in leagues){
    league = leagues[leagueID];
    if(league.is_current){
        count++;
        ids.push(league.league_id);
        collect[league.league_id] = {
          fetchingLeague: false,
          fetchingFixtures: false,
          fetchingTeams: false,
          leagueID: league.league_id,
          name: league.country + " " + league.name,
          countryCode: league.country_code,
          logo: league.logo,
          // returns timestamp of dates in UTC
          seasonStart: dateToTimeStamp(league.season_start),
          seasonEnd: dateToTimeStamp(league.season_end),
        };
    }
    if(count == 9){
      break;
    }
  }
  return [ids,collect];
}

/**
 * Adds a set of leagues into the leaguesByID store.
 * @method receiveMultipleLeagues
 * @param  {Object} leagues (leagueID : Object(propertyName : property))
 * @return {Action} type: LEAGUE_RECEIVE_MULTIPLE_LEAGUES
 */
export function receiveMultipleLeagues(leagues){
  return {
    type: LEAGUE_RECEIVE_MULTIPLE_LEAGUES,
    leagues: leagues,
  };
}
