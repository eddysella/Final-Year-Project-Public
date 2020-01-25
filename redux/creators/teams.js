import {
  REQUEST_TEAM_BY_ID,
  RECEIVE_TEAM_BY_ID,
  REQUEST_PLAYERS_FOR_TEAM,
  RECEIVE_PLAYERS_FOR_TEAM,
  REQUEST_LEAGUES_FOR_TEAM,
  RECEIVE_LEAGUES_FOR_TEAM,
  REQUEST_PAST_TEAM_FIXTURES,
  RECEIVE_PAST_TEAM_FIXTURES,
  REQUEST_FUTURE_TEAM_FIXTURES,
  RECEIVE_FUTURE_TEAM_FIXTURES,
  RECEIVE_MULTIPLE_TEAMS,
} from '../types'
import { getTeamByID, getLastTenFixtures, getNextTenFixtures,
  getAllLeaguesForTeam, getStatisticsForTeamInLeague,
  getPlayerStatisticsByTeamIDandSeason } from '../../fetch/Team'
import { processFixtures } from './fixturesMain'
import { processLeagues, receiveMultipleLeagues } from './leagues'

function requestTeamByID(teamID){
  return {
    type: REQUEST_TEAM_BY_ID,
    teamID: teamID,
  };
}

function receiveTeamByID(team){
  return {
    type: RECEIVE_TEAM_BY_ID,
    teamID: team.teamID,
    teamName: team.teamName,
    logo: team.logo
  };
}

function processTeam(data){
  data = data.api;
  teams = data.teams;
  team = teams[0]
  return {
      teamID: team.team_id,
      name: team.name,
      country: team.country,
      logo: team.logo,
  };
}

function shouldFetchTeam(team){
  if(!team){
    return true;
  }else if(team.fetchingTeam){
    return false;
  }else{
    return false;
  }
}

export function fetchTeam(teamID){
  return (dispatch, getState) => {
    if(shouldFetchTeam(getState().teamsByID[teamID])){
      dispatch(requestTeamByID(teamID))
      return getTeamByID(teamID)
        // get latest season
      .then( data => processTeam(data))
      .then( processedData => dispatch(receiveTeamByID(processedData)));
    }
  }
}

export function processTeams(data){
  collect = {};
  ids = [];
  data = data.api;
  teams = data.teams;
  teams.forEach( team => {
    ids.push(team.team_id);
    collect[team.team_id] = {
      fetchingTeam: false,
      fetchingLeagues: false,
      fetchingPastFixtures: false,
      fetchingPlayers: false,
      fetchingFutureFixtures: false,
      teamID: team.team_id,
      name: team.name,
      logo: team.logo,
      country: team.country,
    }
  })
  return [ids,collect];
}

function requestLeaguesForTeam(teamID){
  return {
    type: REQUEST_LEAGUE_FOR_TEAM,
    teamID: teamID,
  };
}

export function receiveLeagueIDsForTeam(teamID, leagueIDs){
  return {
    type: RECEIVE_LEAGUE_FOR_TEAM,
    teamID: teamID,
    leagueIDs: leagueIDs,
  };
}

function shouldFetchLeagues(team){
  if("leagueIDs" in team){
    return false;
  }else if(team.fetchingLeagues){
    return false;
  }else{
    return true;
  }
}

export function fetchLeaguesForTeam(teamID){
  return (dispatch, getState) => {
    if(shouldFetchLeagues(getState().teamsByID[teamID])){
      dispatch(requestLeaguesForTeam())
      return getAllLeaguesForTeam(teamID)
      .then( data => processLeagues(data))
      .then( processedData => receiveLeaguesForTeam(teamID, processedData));
    }
  }
}

function receiveLeaguesForTeam(teamID, result){
  return dispatch => Promise.all([
    dispatch( receiveLeagueIDs(teamID, result[0])),
    dispatch( receiveMultipleLeagues(result[1]))
  ])
}

function requestPastFixtures(teamID){
  return {
    type: REQUEST_PAST_TEAM_FIXTURES,
    teamID: teamID,
  };
}

function receivePastFixtures(teamID, fixtures){
  return {
    type: RECEIVE_PAST_TEAM_FIXTURES,
    teamID: teamID,
    leagueNames: fixtures[0],
    fixturesInOrder: fixtures[1],
    receivedAt: Date.now(),
  };
}

export function fetchPastFixtures(teamID){
  return (dispatch, getState) => {
    dispatch(requestPastFixtures(teamID))
    return getLastTenFixtures(teamID)
      // get latest season
    .then( data => processFixtures(data))
    .then( processedData => dispatch(receivePastFixtures(teamID, processedData)));
  }
}

function requestFutureFixtures(teamID){
  return {
    type: REQUEST_FUTURE_TEAM_FIXTURES,
    teamID: teamID,
  };
}

function receiveFutureFixtures(teamID, fixtures){
  return {
    type: RECEIVE_FUTURE_TEAM_FIXTURES,
    teamID: teamID,
    leagueNames: fixtures[0],
    fixturesInOrder: fixtures[1],
    receivedAt: Date.now(),
  };
}

export function fetchFutureFixtures(teamID){
  return (dispatch, getState) => {
    dispatch(requestFutureFixtures(teamID))
    return getNextTenFixtures(teamID)
      // get latest season
    .then( data => processFixtures(data))
    .then( processedData => dispatch(receiveFutureFixtures(teamID, processedData)));
  }
}

function requestPlayersForTeam(teamID){
  return {
    type: REQUEST_LEAGUE_FOR_TEAM,
    teamID: teamID,
  };
}

export function receivePlayerIDsForTeam(teamID, playerIDs){
  return {
    type: RECEIVE_LEAGUE_FOR_TEAM,
    teamID: teamID,
    playerIDs: playerIDs,
  };
}

export function receiveMultipleTeams(teams){
  return {
    type: RECEIVE_MULTIPLE_TEAMS,
    teams: teams,
  };
}
