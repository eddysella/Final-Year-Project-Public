import {
  STANDINGS_REQUEST_BY_LEAGUE_ID,
  STANDINGS_RECEIVE_BY_LEAGUE_ID,
} from '../types/standings'
import { getStandingsByLeague } from '../../fetch/Standings';
/**
 * @module Redux Creators standings
 */

/**
 * Sets the fetching property of the standingsByLeagueID store to true.
 * Stores the passed standings under the specified leagueID.
 * @method receiveStandings
 * @param  {Object} standings A set standings
 * @param  {Integer} leagueID  A league ID
 * @return {Action} type: STANDINGS_RECEIVE_BY_LEAGUE_ID
 */
function receiveStandings(standings, leagueID){
  return {
    type: STANDINGS_RECEIVE_BY_LEAGUE_ID,
    leagueID: leagueID,
    standings: standings,
    lastUpdated: Date.now(),
  };
}

/**
 * Sets the fetching property of the standingsByLeagueID store to false.
 * Initializes an entry for the specified league in the store.
 * @method requestStandings
 * @return {Action} type: STANDINGS_REQUEST_BY_LEAGUE_ID
 */
function requestStandings(){
  return {
    type: STANDINGS_REQUEST_BY_LEAGUE_ID,
  };
}

/**
 * Should fetch standings for a league.
 * @method shouldFetchStandings
 * @param  {Boolean} fetching  [description]
 * @param  {Object} standings An entry from the standingsByLeagueID store.
 * @return {Boolean}
 */
function shouldFetchStandings(fetching, standings){
  if (fetching) {
    return false
  }else if(standings === undefined){
    return true
  }else{
    return false
  }
}

/**
 * Fetch sequence for standings of the specified league.
 * @method fetchStandings
 * @param  {Integer}       leagueID A league ID
 * @return {Function}
 */
export function fetchStandings(leagueID){
  return (dispatch, getState) => {
    standings = getState().standingsByLeagueID[leagueID]
    fetching = getState().standingsByLeagueID['fetching']
    if(shouldFetchStandings(fetching, standings)){
      dispatch(requestStandings())
      return getStandingsByLeague(leagueID)
        .then( data => processStandings(data))
        .then( standings => dispatch(receiveStandings(standings, leagueID)))
    }
  }
}

/**
 * Processes a set of standings by team for a league.
 * @method processStandings
 * @param  {Object} data A parsed JSON Object
 * @return {Object} (teamID : data)
 */
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
