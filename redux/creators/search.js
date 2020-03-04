import {
  SEARCH_UPDATE_INPUT,
  SEARCH_CLEAR_LEAGUE,
  SEARCH_CLEAR_TEAM,
  SEARCH_REQUEST_LEAGUE_SEARCH,
  SEARCH_RECEIVE_LEAGUE_SEARCH,
  SEARCH_REQUEST_TEAM_SEARCH,
  SEARCH_RECEIVE_TEAM_SEARCH,
} from '../types/search'
import { searchLeagueByCodeOrName, searchTeamByCodeOrName } from '../../fetch/search'
import { receiveMultipleLeagues, processLeagues } from './leagues'
import { receiveMultipleTeams} from './teams'
/**
 * @module Redux Creators search
 */

/**
 * Top level dispatch:
 * 1) Search for a league specified by the input.
 * 2) Search for a team specified by the input.
 * @method search
 * @param  {String} input An input String to search for
 * @return {Function}
 */
export function search(input){
  return dispatch => {
    if(input.length > 2){
      Promise.all([
        dispatch( searchForLeague(input)),
        dispatch( searchForTeam(input)),
      ])
    }
  }
}

/**
 * Updates the value of the searchInput store with the passed input.
 * Called anytime the input in the search bar is modified.
 * @method updateSearchInput
 * @param  {String} input The new search bar input
 * @return {Action} type: SEARCH_UPDATE_INPUT
 */
export function updateSearchInput(input){
  return {
    type: SEARCH_UPDATE_INPUT,
    input: input,
  };
}

/**
 * UNUSED ATM
 * Top level dispatch:
 * 1) Clears the leagueID array in the search store
 * 2) Clears the teamID array in the search store
 * search store.
 * @method clear
 * @return {Function}
 */
export function clear(){
  return dispatch => Promise.all([
    dispatch( clearLeagueSearch()),
    dispatch( clearTeamSearch()),
  ])
}

/**
 * Clears the leagueIDs array in the search store
 * @method clearLeagueSearch
 * @return {Action} type: SEARCH_CLEAR_LEAGUE
 */
function clearLeagueSearch(){
  return {
    type: SEARCH_CLEAR_LEAGUE
  };
}

/**
 * Clears the teamIDs array in the search store
 * @method clearTeamSearch
 * @return {Action} type: SEARCH_CLEAR_TEAM
 */
function clearTeamSearch(){
  return {
    type: SEARCH_CLEAR_TEAM
  };
}

/**
 * Sets the leagueIsFetching property of the search store to true.
 * Clears the leagueIDs array.
 * @method requestLeagueSearch
 * @return {Action} type: SEARCH_REQUEST_LEAGUE_SEARCH
 */
function requestLeagueSearch(){
  return {
    type: SEARCH_REQUEST_LEAGUE_SEARCH
  };
}

/**
 * Sets the leagueIsFetching property of the search store to false.
 * Stores the passed league IDs into the leagueIDs array.
 * @method receiveLeagueIDs
 * @param  {Array} leagueIDs A set of league IDs
 * @return {Action} type: SEARCH_RECEIVE_LEAGUE_SEARCH
 */
function receiveLeagueIDs(leagueIDs){
  return {
    type: SEARCH_RECEIVE_LEAGUE_SEARCH,
    leagueIDs: leagueIDs,
  };
}

/**
 * Fetch sequence for searching for a league.
 * @method searchForLeague
 * @param  {String} input A potential league name to search for.
 * @return {Function}
 */
function searchForLeague(input){
  return dispatch => {
    dispatch(requestLeagueSearch());
    return searchLeagueByCodeOrName(input)
    .then( data => processLeagues(data))
    .then( result => {
      dispatch( receiveMultipleLeagues(result[1]));
      dispatch( receiveLeagueIDs(result[0]));
    })
  }
}

/**
 * Sets the teamIsFetching property of the search store to true.
 * Clears the teamIDs array.
 * @method requestTeamSearch
 * @return {Action} type: SEARCH_REQUEST_TEAM_SEARCH
 */
function requestTeamSearch(){
  return {
    type: SEARCH_REQUEST_TEAM_SEARCH
  };
}

/**
 * Sets the teamIsFetching property of the search store to false.
 * Stores the passed team IDs into the teamIDs array.
 * @method receiveTeamIDs
 * @param  {Array} teamIDs A set of team IDs
 * @return {Action} type: SEARCH_RECEIVE_TEAM_SEARCH
 */
function receiveTeamIDs(teamIDs){
  return {
    type: SEARCH_RECEIVE_TEAM_SEARCH,
    teamIDs: teamIDs,
  };
}

/**
 * A dedicated processTeams function which only processes the first 10 results.
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
  teams.length=10;
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
 * Fetch sequence for searching for a team.
 * @method searchForTeam
 * @param  {String} input A potential team name to search for.
 * @return {Function}
 */
function searchForTeam(input){
  return dispatch => {
    dispatch(requestTeamSearch());
    return searchTeamByCodeOrName(input)
    .then( data => processTeams(data))
    .then( result => {
      dispatch( receiveMultipleTeams(result));
      dispatch( receiveTeamIDs(Object.keys(result)));
    })
  }
}
