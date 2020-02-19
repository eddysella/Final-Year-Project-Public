import {
  UPDATE_SEARCH_INPUT,
  CLEAR_LEAGUE_SEARCH,
  CLEAR_TEAM_SEARCH,
  REQUEST_LEAGUE_SEARCH,
  RECEIVE_LEAGUE_SEARCH,
  REQUEST_TEAM_SEARCH,
  RECEIVE_TEAM_SEARCH,
} from '../types'
import { searchLeagueByCodeOrName, searchTeamByCodeOrName } from '../../fetch/search'
import { receiveMultipleLeagues, processLeagues } from './leagues'
import { receiveMultipleTeams} from './teams'

export function search(input){
  return dispatch => {
    if(input.length > 3){
      Promise.all([
        dispatch( searchForLeague(input)),
        dispatch( searchForTeam(input)),
      ])
    }
  }
}

export function updateSearchInput(input){
  return {
    type: UPDATE_SEARCH_INPUT,
    input: input,
  };
}

export function clear(){
  return dispatch => Promise.all([
    dispatch( clearLeagueSearch()),
    dispatch( clearTeamSearch()),
  ])
}

function clearLeagueSearch(){
  return {
    type: CLEAR_LEAGUE_SEARCH
  };
}

function clearTeamSearch(){
  return {
    type: CLEAR_TEAM_SEARCH
  };
}

function requestLeagueSearch(){
  return {
    type: REQUEST_LEAGUE_SEARCH
  };
}

function receiveLeagueIDs(leagueIDs){
  return {
    type: RECEIVE_LEAGUE_SEARCH,
    leagueIDs: leagueIDs,
  };
}

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

function requestTeamSearch(){
  return {
    type: REQUEST_TEAM_SEARCH
  };
}

function receiveTeamIDs(teamIDs){
  return {
    type: RECEIVE_TEAM_SEARCH,
    teamIDs: teamIDs,
  };
}

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
