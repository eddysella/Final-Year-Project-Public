import {
  REQUEST_LEAGUE_SEARCH,
  RECEIVE_LEAGUE_SEARCH,
  REQUEST_TEAM_SEARCH,
  RECEIVE_TEAM_SEARCH,
} from '../action/types/types'
import { searchLeagueByCountryOrName, searchTeamByCountryOrName } from '../../../fetch/search'
import { receiveMultipleLeagues } from './leagues'
import { receiveMultipleTeams } from './teams'

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

export function searchForLeague(input){
  request = searchLeagueByCountryOrName(input)
  .then( data => processLeagueSearch(data));

  return (dispatch, getState) => {
      dispatch(requestLeagueSearch())
      .then( dispatch(receiveLeagueSearch(request[0])))
      .then( dispatch(receiveMultipleLeagues(request[1])));
  }
}

function processLeagueSearch(data){
  collect = {};
  ids = [];
  data = data.api;
  leagues = data.leagues;
  leagues.forEach( league => {
    if(league.is_current == 1){
        ids.push(league.league_id);
        collect[league.league_id] = {
          leagueName: league.country + league.name,
          leagueName: leagueName,
          countryCode: league.country_code,
          logo: league.logo,
        };
    }
  })
  return [ids,collect];
}

export function searchForTeam(input){
  request = searchTeamByCountryOrName(input)
  .then( data => processTeamSearch(data));

  return (dispatch, getState) => {
      dispatch(requestTeamSearch())
      .then( dispatch(receiveTeamSearch(request[0])))
      .then( dispatch(receiveMultipleTeams(request[1])));
  }
}

function processLeagueSearch(data){
  collect = {};
  ids = [];
  data = data.api;
  teams = data.teams;
  teams.forEach( team => {
      ids.push(team.team_id);
      collect[team.team_id] = {
        teamName: team.name,
        logo: team.logo,
      };
  })
  return [ids,collect];
}
