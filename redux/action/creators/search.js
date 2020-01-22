import {
  REQUEST_LEAGUE_SEARCH,
  RECEIVE_LEAGUE_SEARCH,
  REQUEST_TEAM_SEARCH,
  RECEIVE_TEAM_SEARCH,
} from '../action/types/types'
import { searchLeagueByCountryOrName, searchTeamByCountryOrName } from '../../../fetch/search'
import { receiveMultipleLeagues, processLeagues } from './leagues'
import { receiveMultipleTeams, processTeams } from './teams'

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

export function searchForLeague(input){
  return (dispatch, getState) => {
      dispatch(requestLeagueSearch());
      return searchLeagueByCountryOrName(input)
      .then( data => processLeagues(data));
      .then( processedData => receiveTeamSearchResult(processedData));
  }
}

function receiveLeagueSearchResult(result){
  return (dispatch,getState) => {
    dispatch( receiveLeagueIDs(request[0]))
    .then( dispatch( receiveMultipleLeagues(request[1])));
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

export function searchForTeam(input){
  return (dispatch, getState) => {
      dispatch(requestTeamSearch())
      return searchTeamByCountryOrName(input)
      .then( data => processTeams(data));
      .then( processedData => receiveTeamSearchResult(processedData));
  }
}

function receiveTeamSearchResult(result){
  return (dispatch,getState) => {
    dispatch( receiveTeamIDs(result[0]))
    .then( dispatch( receiveMultipleTeams(result[1])));
  }
}
