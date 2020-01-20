import {
  REQUEST_LEAGUE_BY_ID,
  RECEIVE_LEAGUE_BY_ID,
} from '../types/types'
import { getAllSeasonsForLeague } from '../../../fetch/League'

export function setLeagues(leagueIDs){
  return (dispatch, getState) => {
    dispatch(fetchLeagues(leagueIDs));
  }
}

function fetchLeagues(leagueIDs){
  return (dispatch, getState) => {
    for (leagueID in leagueIDs){
      dispatch(requestLeague(leagueID))
      return getAllSeasonsForLeague(leagueID)
        // get latest season
      .then( data => processLeague(data))
      .then( processedData => dispatch(receiveLeague(processedData)));
    }
}

function processLeague(data){
  data = data.api;
  leagues = data.leagues;
  league = leagues[leagues.length-1]
  leagueName = league.country + league.name;
  return {
      leagueName: leagueName,
      countryCode: league.country_code,
      logo: league.logo,
  };
}

export function requestLeagueByID(leagueID){
  return {
    type: REQUEST_LEAGUE_BY_ID,
    leagueID: leagueID,
  };
}

export function receiveLeague(league){
  return {
    type: RECEIVE_LEAGUE_BY_ID,
    leagueName: action.leagueName,
    countryCode: action.countryCode,
    logo: action.logo,
  };
}
