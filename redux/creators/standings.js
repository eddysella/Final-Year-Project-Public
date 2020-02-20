import {
  STANDINGS_REQUEST_BY_LEAGUE_ID,
  STANDINGS_RECEIVE_BY_LEAGUE_ID,
} from '../types/standings'
import { getStandingsByLeague } from '../../fetch/Standings';

function receiveStandings(standings, leagueID){
  return {
    type: STANDINGS_RECEIVE_BY_LEAGUE_ID,
    leagueID: leagueID,
    data: standings,
    lastUpdated: Date.now(),
  };
}

function requestStandings(leagueID){
  return {
    type: STANDINGS_REQUEST_BY_LEAGUE_ID,
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
