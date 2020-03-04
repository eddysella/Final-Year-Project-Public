import {
  FOLLOWING_ADD_LEAGUE,
  FOLLOWING_REMOVE_LEAGUE,
  FOLLOWING_ADD_TEAM,
  FOLLOWING_REMOVE_TEAM,
} from '../types/following'
import { AsyncStorage } from 'react-native';
import { fetchTeams, } from './teams'
import { fetchLeagues, } from './leagues'
/**
 * @module Redux Creators following
 */

/**
 * Replaces the following leagues array in async storage with the
 * array from the followingLeagueIDs store.
 * @method updateLeagueStorage
 * @return {Function}
 */
function updateLeagueStorage(){
  return async (dispatch,getState) => {
    try {
      await AsyncStorage.setItem( 'FOLLOWINGLEAGUES', JSON.stringify(getState().followingLeagueIDs) );
    } catch ( e ) {}
  }
}

/**
 * Replaces the following teams array in async storage with the
 * array from the followingTeamIDs store.
 * @method updateTeamStorage
 * @return {Function}
 */
function updateTeamStorage(){
  return async (dispatch,getState) => {
    try {
      await AsyncStorage.setItem( 'FOLLOWINGTEAMS', JSON.stringify(getState().followingTeamIDs) );
    } catch ( e ) {}
  }
}

/**
 * Used at startup to fetch data for followed leagues.
 * Top level dispatch:
 * 1) Add all leagues to the followingLeagueIDs store
 * 2) Fetch data for the leagues
 * @method initFollowedLeagues
 * @param  {Array} leagueIDs A set of league IDs
 * @return {Function}
 */
export function initFollowedLeagues(leagueIDs){
  return dispatch => {
    leagueIDs.map( leagueID => dispatch(addLeague(leagueID)))
    dispatch(fetchLeagues(leagueIDs))
  }
}

/**
 * Used at startup to fetch data for followed teams.
 * Top level dispatch:
 * 1) Add all teams to the followingTeamIDs store
 * 2) Fetch data for the teams
 * @method initFollowedTeams
 * @param  {Array} teamIDs A set of team IDs
 * @return {Function}
 */
export function initFollowedTeams(teamIDs){
  return dispatch => {
    teamIDs.map( teamID => dispatch(addTeam(teamID)))
    dispatch(fetchTeams(teamIDs))
  }
}

/**
 * Top level dispatch:
 * 1) Add League ID to followingLeagueIDs store.
 * 2) Initialization sequence for league fixture functionality.
 * @method addLeagueToFollowing
 * @param {Integer} leagueID
 */
export function addLeagueToFollowing(leagueID){
  return (dispatch,getState) => {
    dispatch(addLeague(leagueID))
    dispatch(updateLeagueStorage())
    dispatch(fetchLeagues([leagueID]))
  }
}

/**
 * Stores a single League ID in the followingLeagueIDs store.
 * @method addLeague
 * @param  {Integer} leagueID A league ID
 * @return {Action} type: FOLLOWING_ADD_LEAGUE
 */
function addLeague(leagueID){
  return {
    type: FOLLOWING_ADD_LEAGUE,
    leagueID: leagueID,
  };
}

/**
 * Top level dispatch:
 * 1) Remove the specified leagueID from the followingLeagueIDs store
 * 2) Update the followed league IDs array in storage.
 * @method removeLeagueFromFollowing
 * @param  {Integer} leagueID A league ID
 * @return {Function}
 */
export function removeLeagueFromFollowing(leagueID){
  return (dispatch, getState) => {
    dispatch(removeLeague(leagueID))
    dispatch(updateLeagueStorage())
  }
}

/**
 *  Removes the specified leagueID from the followingLeagueIDs store.
 * @method removeLeague
 * @param  {Integer} leagueID A league ID
 * @return {Action} type: FOLLOWING_REMOVE_LEAGUE
 */
function removeLeague(leagueID){
  return {
    type: FOLLOWING_REMOVE_LEAGUE,
    leagueID: leagueID,
  };
}

/**
 * Top level dispatch:
 * 1) Add Team ID to followingTeamIDs store.
 * 2) Initialization sequence for team, requires more background info.
 * @method addTeamToFollowing
 * @param  {Integer}  teamID
 */
export function addTeamToFollowing(teamID){
  return dispatch => {
    teamArray = [];
    dispatch(addTeam(teamID)) // 1
    dispatch(updateTeamStorage())
    dispatch(fetchTeams([teamID])) // 2
  }
}

/**
 * Stores a single League ID in the followingTeamIDs store.
 * @method addTeam
 * @param  {Integer} teamID A team ID
 * @return {Action} type: FOLLOWING_ADD_TEAM
 */
function addTeam(teamID){
  return {
    type: FOLLOWING_ADD_TEAM,
    teamID: teamID,
  };
}

/**
 * Top level dispatch:
 * 1) Remove the specified teamID from the followingTeamIDs store
 * 2) Update the followed team IDs array in storage.
 * @method removeTeamFromFollowing
 * @param  {Integer} teamID A team ID
 * @return {Function}
 */
export function removeTeamFromFollowing(teamID){
  return (dispatch, getState) => {
    dispatch(removeTeam(teamID))
    dispatch(updateTeamStorage())
  }
}

/**
 *  Removes the specified teamID from the followingTeamIDs store.
 * @method removeTeam
 * @param  {Integer} teamID A team ID
 * @return {Action} type: FOLLOWING_REMOVE_TEAM
 */
function removeTeam(teamID){
  return {
    type: FOLLOWING_REMOVE_TEAM,
    teamID: teamID,
  };
}
