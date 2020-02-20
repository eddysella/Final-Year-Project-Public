import {
  REQUEST_STANDINGS,
  RECEIVE_STANDINGS,
} from '../types'
import { getStandingsByLeague } from '../../fetch/Standings';

function receiveStandings(standings, leagueID){
  return {
    type: RECEIVE_STANDINGS,
    leagueID: leagueID,
    data: standings,
    lastUpdated: Date.now(),
  };
}

function requestStandings(leagueID){
  return {
    type: REQUEST_STANDINGS,
    leagueID: leagueID,
  };
}

// shoould add time check for last updated
function shouldFetchStandings(fetching, standings){
  if(standings === undefined){
    return true
  }else{
    return false
  }
}

export function fetchStandings(leagueID){
  return (dispatch, getState) => {
    standings = getState().standingsByLeagueID[leagueID]
    if(shouldFetchStandings(standings)){
      dispatch(requestStandings(leagueID))
      return getStandingsByLeague(leagueID)
        .then( data => processStandings(data))
        .then( standings => dispatch(receiveStandings(standings, leagueID)))
    }
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
