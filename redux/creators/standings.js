import {
  REQUEST_STANDINGS,
  RECEIVE_STANDINGS,
  ADD_LEAGUE_STANDINGS,
  REMOVE_LEAGUE_STANDINGS,
} from '../types'
import { getStandingsByLeague } from '../../fetch/Standings';


export function addLeagueToStandings(league){
  return {
    type: ADD_LEAGUE_STANDINGS,
    leagueID: league,
  };
}

export function removeLeagueFromStandings(league){
  return {
    type: REMOVE_LEAGUE_STANDINGS,
    leagueID: league,
  };
}

function receiveStandings(standings){
  return {
    type: RECEIVE_STANDINGS,
    tableData: standings,
    lastUpdated: Date.now(),
  };
}

function requestStandings(leagueID){
  return {
    type: REQUEST_STANDINGS,
    leagueID: leagueID,
  };
}

export function fetchStandings(leagueID){
  return dispatch => {
    dispatch(requestStandings(leagueID))
    return getStandingsByLeague(leagueID)
      .then( data => processStandings(data))
      .then( standings => dispatch(receiveStandings(standings)));
  }
}

function processStandings(data){
  titleData=[];
  tableData=[]
  data = data.api;
  standings = data.standings[0];
  standings.forEach( team => {
      stats = team.all;
      tableData.push([
          team.rank,
          team.logo,
          team.teamName,
          stats.matchsPlayed,
          (stats.goalsFor + ":" + stats.goalsAgainst),
          (stats.goalsFor - stats.goalsAgainst),
          team.points,
      ]);
  });
  return tableData;
}
