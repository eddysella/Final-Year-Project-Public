import {
  TEAM_REQUEST_BY_ID,
  TEAM_RECEIVE_BY_ID,
  TEAM_REQUEST_PLAYERS,
  TEAM_RECEIVE_PLAYERS,
  TEAM_REQUEST_LEAGUES,
  TEAM_RECEIVE_LEAGUES,
  FIXTURES_REQUEST_PAST_TEAM,
  FIXTURES_RECEIVE_PAST_TEAM,
  FIXTURES_REQUEST_FUTURE_TEAM,
  FIXTURES_RECEIVE_FUTURE_TEAM,
  TEAM_RECEIVE_MULTIPLE_TEAMS,
  TEAM_SET_STATS_FETCHED_TRUE,
} from '../types/team'
import { getTeamByID, getLastTwentyFixtures, getNextTenFixtures,
  getAllLeaguesForTeam, getStatisticsForTeamInLeague,
  getPlayersByTeamID } from '../../fetch/Team'
import { processLeagues, receiveMultipleLeagues } from './leagues'
import { processPlayers, receivePlayer } from './players'
import { initTeam,} from './fixtures'
/**
 * @module Redux Creators Teams
 */

/**
 * Sets the fetching property of the teamsByID store to true.
 * @method requestTeamByID
 * @param  {Integer} teamID A team ID
 * @return {Action} type: TEAM_REQUEST_BY_ID
 */
function requestTeamByID(teamID){
  return {
    type: TEAM_REQUEST_BY_ID,
    teamID: teamID,
  };
}

/**
 * Sets the fetching property of the teamsByID store to false.
 * @method receiveTeamByID
 * @param  {Object} team (propertyName : property)
 * @return {Action} type: TEAM_RECEIVE_BY_ID
 */
function receiveTeamByID(team){
  return {
    type: TEAM_RECEIVE_BY_ID,
    teamID: team.teamID,
    country: team.country,
    name: team.name,
    logo: team.logo
  };
}

/**
 * Processes a team.
 * @method processTeam
 * @param  {Object} data A parsed JSON Object
 * @return {Object} (propertName : property)
 */
function processTeam(data){
  data = data.api;
  teams = data.teams;
  team = teams[0]
  return {
      teamID: "" + team.team_id,
      name: team.name,
      country: team.country,
      logo: team.logo,
  };
}

/**
 * Should fetch test for a team.
 * @method shouldFetchTeam
 * @param  {Integer} team A team Object
 * @return {Boolean}
 */
function shouldFetchTeam(team){
  if(!team){
    return true;
  }else if(team.fetchingTeam){
    return false;
  }
}

/**
 * Fetch sequence for a set of teams.
 * @method fetchTeams
 * @param  {Array}   teamIDs A set of team IDs.
 * @return {Function}
 */
export function fetchTeams(teamIDs){
  return (dispatch, getState) => {
    teamIDs.map( teamID => {
      team = getState().teamsByID[teamID]
      if(shouldFetchTeam(team)){
        dispatch(requestTeamByID(teamID))
        getTeamByID(teamID)
          // get latest season
        .then( data => processTeam(data))
        .then( processedData => dispatch( receiveTeamByID(processedData)))
        .then(() => dispatch(fetchLeaguesForTeam(teamID)))
      }else if(!(team.leagueIDs)){
        dispatch(fetchLeaguesForTeam(teamID))
      }
    });
  }
}

/**
 * Sets the fetching property of the teamsByID store to true.
 * @method requestLeagues
 * @param  {Integer} teamID A team ID
 * @return {Action} type: TEAM_REQUEST_LEAGUES
 */
function requestLeagues(teamID){
  return {
    type: TEAM_REQUEST_LEAGUES,
    teamID: teamID,
  };
}

/**
 * Sets the fetching property of the teamsByID store to false.
 * Stores a set of league IDs into the store for the specified teamID.
 * @method receiveLeagueIDs
 * @param  {Integer} teamID A team ID
 * @param  {Array} leagueIDs A set of league IDs
 * @return {Action} type: TEAM_RECEIVE_LEAGUES
 */
export function receiveLeagueIDs(teamID, leagueIDs){
  return {
    type: TEAM_RECEIVE_LEAGUES,
    teamID: teamID,
    leagueIDs: leagueIDs,
  };
}

/**
 * Should fetch test for a league
 * @method shouldFetchLeagues
 * @param  {Object} team A team
 * @return {Boolean}
 */
function shouldFetchLeagues(team){
  if("leagueIDs" in team){
    return false;
  }else if(team.fetchingLeagues){
    return false;
  }else{
    return true;
  }
}

/**
 * Fetch sequence for the leagues of a team.
 * @method fetchLeaguesForTeam
 * @param  {Integer} teamID A team ID
 * @return {Function}
 */
export function fetchLeaguesForTeam(teamID){
  return (dispatch, getState) => {
    if(shouldFetchLeagues(getState().teamsByID[teamID])){
      dispatch(requestLeagues())
      return getAllLeaguesForTeam(teamID)
      .then( data => processLeagues(data))
      .then( processedData => {
        dispatch( receiveMultipleLeagues(processedData[1]));
        dispatch( receiveLeagueIDs(teamID, processedData[0]));
        // initteam is from fixtures this is as far down the chain as I could put it
        dispatch(initTeam(teamID));
      })
    }
  }
}

/**
 * Sets the fetching property of the teamsByID store to true.
 * @method requestPlayersForTeam
 * @param  {Integer} teamID A team ID
 * @return {Action} type: TEAM_REQUEST_PLAYERS
 */
export function requestPlayersForTeam(teamID){
  return {
    type: TEAM_REQUEST_PLAYERS,
    teamID: teamID,
  };
}

/**
 * Fetch sequence for the players of a team.
 * @method fetchPlayers
 * @param  {Integer} teamID A team ID
 * @return {Function}
 */
export function fetchPlayers(teamID){
  return (dispatch, getState) => {
    dispatch( requestPlayersForTeam(teamID))
    return getPlayersByTeamID(teamID)
      .then( data => processPlayers(data))
      .then( processedData => {
          processedData[1].map( player => {
            dispatch( receivePlayer(player))
          })
          dispatch( receivePlayerIDsForTeam(teamID, processedData[0]))
      });
  }
}

/**
 * Sets the fetching property of the teamsByID store to false.
 * @method receivePlayerIDsForTeam
 * @param  {Integer} teamID A team ID
 * @param  {Array} playerIDs A set of player IDs
 * @return {Action} type: TEAM_RECEIVE_PLAYERS
 */
export function receivePlayerIDsForTeam(teamID, playerIDs){
  return {
    type: TEAM_RECEIVE_PLAYERS,
    teamID: teamID,
    playerIDs: playerIDs,
  };
}

/**
 * Sets the fetching property of the teamsByID store to false.
 * @method receiveMultipleTeams
 * @param  {Object} teams (teamID : team)
 * @return {Action} type: TEAM_RECEIVE_BY_ID
 */
export function receiveMultipleTeams(teams){
  return {
    type: TEAM_RECEIVE_MULTIPLE_TEAMS,
    teams: teams,
  };
}

/**
 * Sets the statsFetched property of the a specific team in the teamsByID store
 * to true.
 * @method confirmStatsFetched
 * @param  {Integer} teamID A team ID
 * @return {Action} type: TEAM_SET_STATS_FETCHED_TRUE
 */
export function confirmStatsFetched(teamID){
  return {
    type: TEAM_SET_STATS_FETCHED_TRUE,
    teamID: teamID,
  };
}
