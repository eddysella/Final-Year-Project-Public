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

function receiveLeagueSearch(leaguesIDs){
  return {
    type: RECEIVE_LEAGUE_SEARCH,
    leagueIDs: leagueIDs,
  };
}

export function searchForLeague(input){
  return (dispatch, getState) => {
      request = searchLeagueByCountryOrName(input)
      .then( data => processLeagues(data));

      dispatch(requestLeagueSearch())
      .then( dispatch(receiveLeagueSearch(request[0])))
      .then( dispatch(receiveMultipleLeagues(request[1])));
  }
}

function requestTeamSearch(){
  return {
    type: REQUEST_TEAM_SEARCH
  };
}

function receiveTeamSearch(teamIDs){
  return {
    type: RECEIVE_TEAM_SEARCH,
    teamIDs: teamIDs,
  };
}

export function searchForTeam(input){
  request = searchTeamByCountryOrName(input)
  .then( data => processTeams(data));

  return (dispatch, getState) => {
      dispatch(requestTeamSearch())
      .then( dispatch(receiveTeamSearch(request[0])))
      .then( dispatch(receiveMultipleTeams(request[1])));
  }
}
