import {
  REQUEST_LEAGUE_BY_ID,
  RECEIVE_LEAGUE_BY_ID,
  RECEIVE_MULTIPLE_LEAGUES,
} from '../types'
import { getAllSeasonsForLeague } from '../../fetch/League'

export function fetchLeagues(leagueIDs){
  return (dispatch, getState) => {
    for (leagueID in leagueIDs){
      dispatch(requestLeagueByID(leagueID))
      return getAllSeasonsForLeague(leagueID)
        // get latest season
      .then( data => processLeague(data))
      .then( processedData => dispatch(receiveLeagueByID(processedData)));
    }
}

function processLeague(data){
  data = data.api;
  leagues = data.leagues;
  league = leagues[leagues.length-1]
  leagueName = league.country + league.name;
  return {
      leagueID: league.league_id,
      leagueName: leagueName,
      countryCode: league.country_code,
      logo: league.logo,
  };
}

function processLeagues(data){
  collect = {};
  ids = [];
  data = data.api;
  leagues = data.leagues;
  leagues.forEach( league => {
    if(league.is_current == 1){
        ids.push(league.league_id);
        collect[league.league_id].push({
          leagueName: league.country + league.name,
          leagueName: leagueName,
          countryCode: league.country_code,
          logo: league.logo,
        });
    }
  })
  return [ids,collect];
}

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

export function receiveMultipleLeagues(leagues){
  return {
    type: RECEIVE_MULTIPLE_LEAGUES,
    leagues: leagues,
  };
}
