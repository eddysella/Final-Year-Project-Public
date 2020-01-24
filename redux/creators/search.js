import {
  CLEAR_LEAGUE_SEARCH,
  CLEAR_TEAM_SEARCH,
  REQUEST_LEAGUE_SEARCH,
  RECEIVE_LEAGUE_SEARCH,
  REQUEST_TEAM_SEARCH,
  RECEIVE_TEAM_SEARCH,
} from '../types'
import { searchLeagueByCountryOrName, searchTeamByCountryOrName } from '../../fetch/search'
import { receiveMultipleLeagues, processLeagues } from './leagues'
import { receiveMultipleTeams, processTeams } from './teams'

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

function receiveLeagueIDs(leaguesIDs){
  return {
    type: RECEIVE_LEAGUE_SEARCH,
    leagueIDs: leagueIDs,
  };
}

function searchForLeague(input){
  return dispatch => {
      dispatch(requestLeagueSearch())
      return searchLeagueByCountryOrName(input)
      .then( data => processLeagues(data))
      .then( processedData => receiveLeagueSearchResult(processedData));
  }
}

function receiveLeagueSearchResult(result){
  return dispatch => Promise.all([
    dispatch( receiveLeagueIDs(request[0])),
    dispatch( receiveMultipleLeagues(request[1])),
  ])
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

function searchForTeam(input){
  return dispatch => {
      dispatch(requestTeamSearch())
      return searchTeamByCountryOrName(input)
      .then( data => processTeams(data))
      .then( processedData => receiveTeamSearchResult(processedData));
  }
}

function receiveTeamSearchResult(result){
  return dispatch => Promise.all([
    dispatch( receiveTeamIDs(result[0])),
    dispatch( receiveMultipleTeams(result[1])),
  ])
}
