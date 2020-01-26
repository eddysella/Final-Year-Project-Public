import {
  REQUEST_LEAGUE_BY_ID,
  RECEIVE_LEAGUE_BY_ID,
  REQUEST_FIXTURES_BY_LEAGUE,
  RECEIVE_FIXTURES_BY_LEAGUE,
  REQUEST_TEAMS_FOR_LEAGUE,
  RECEIVE_TEAMS_FOR_LEAGUE,
  RECEIVE_MULTIPLE_LEAGUES,
} from '../types'
import { getAllSeasonsForLeague } from '../../fetch/League'
import { getFixturesByLeagueAndDate } from '../../fetch/Fixtures'
import { getTeamsByLeagueID } from '../../fetch/Team'
import { processFixtures } from './fixturesMain'
import { processTeams } from './teams'

function calculateToday(){
  start = new Date();
  start.setDate(start.getDate());
  date = new Date(start);
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var year = String(date.getFullYear());
  return String(year + '-' + mm + '-' + dd);
}

const today = calculateToday();

export function requestLeagueByID(leagueID){
  return {
    type: REQUEST_LEAGUE_BY_ID,
    leagueID: leagueID,
  };
}

export function receiveLeagueByID(league){
  return {
    type: RECEIVE_LEAGUE_BY_ID,
    leagueID: league.leagueID,
    leagueName: league.leagueName,
    countryCode: league.countryCode,
    logo: league.logo,
  };
}

function shouldFetchLeague(league){
  if(!league){
    return true;
  }else if(league.fetchingLeague){
    return false;
  }
}

export function fetchLeagues(leagueIDs){
  promises = leagueIDs.map( leagueID => {
    if(shouldFetchLeague(getState().leaguesByID[leagueID])){
      dispatch(requestLeagueByID(leagueID))
      return getAllSeasonsForLeague(leagueID)
        // get latest season
      .then( data => processLeague(data))
      .then( processedData => dispatch(receiveLeagueByID(processedData)));
    }
  });
  return (dispatch, getState) => {
    Promise.all(promises);
  }
}

function processLeague(data){
  data = data.api;
  leagues = data.leagues;
  league = leagues[leagues.length-1]
  return {
      leagueID: league.league_id,
      leagueName: league.country + " " + league.name,
      countryCode: league.country_code,
      logo: league.logo,
  };
}

export function requestFixtures(leagueID){
  return {
    type: REQUEST_FIXTURES_BY_LEAGUE,
    leagueID: leagueID,
  };
}

export function receiveFixtures(fixtures){
  return {
    type: RECEIVE_FIXTURES_BY_LEAGUE,
    fixtures: fixtures[1],
  };
}

export function fetchFixtures(leagueID){
  return (dispatch, getState) => {
      dispatch(requestFixtures(leagueID))
      return getFixturesByLeagueAndDate(leagueID, today)
        // get latest season
      .then( data => processFixtures(data))
      .then( processedData => dispatch(receiveFixtures(processedData)));
    }
}

export function requestTeamsByID(leagueID){
  return {
    type: REQUEST_TEAMS_FOR_LEAGUE,
    leagueID: leagueID,
  };
}

export function receiveTeamsByID(teamIDs){
  return {
    type: RECEIVE_TEAMS_FOR_LEAGUE,
    teamIDs: teamIDs,
  };
}

function shouldFetchTeams(league){
  if(!league.teamIDs){
    return true;
  }else if(league.fetchingTeams){
    return false;
  }
}

export function fetchTeams(leagueID){
  if(shouldFetchTeams(getState().leaguesByID[leagueID])){
    dispatch(requestTeamsByID(leagueID))
    return getTeamsByLeagueID(leagueID)
    .then( data => processTeams(data))
    .then( processedData => {
        dispatch(receiveTeamsByID(processedData[0]));
        dispatch(receiveMultipleTeams(processedData[1]));
    })
  }
}

export function processLeagues(data){
  collect = {};
  ids = [];
  data = data.api;
  leagues = data.leagues;
  count = 0;
  for (leagueID in leagues){
    league = leagues[leagueID];
    if(league.is_current){
        count++;
        ids.push(league.league_id);
        collect[league.league_id] = {
          fetchingLeague: false,
          fetchingFixtures: false,
          leagueID: league.league_id,
          name: league.country + " " + league.name,
          countryCode: league.country_code,
          logo: league.logo,
        };
    }
    if(count == 9){
      break;
    }
  }
  return [ids,collect];
}

export function receiveMultipleLeagues(leagues){
  return {
    type: RECEIVE_MULTIPLE_LEAGUES,
    leagues: leagues,
  };
}
