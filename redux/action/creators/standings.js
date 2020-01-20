import {
  REQUEST_STANDINGS,
  RECEIVE_STANDINGS,
  ADD_LEAGUE_STANDINGS,
  REMOVE_LEAGUE_STANDINGS,
} from '../types/types'
import { getStandingsByLeague } from '../../../fetch/Standings';


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

export function setStandings(leagueID){
  return (dispatch,getState) => {
    dispatch(fetchStandings(leagueID));
  }
}

function receiveStandings(standings){
  return {
    type: RECEIVE_STANDINGS,
    teamNames: standings[0],
    standingsInOrder: standings[1],
    lastUpdated: Date.now(),
  };
}

function requestStandings(leagueID, leagueName){
  return {
    type: REQUEST_STANDINGS,
    leagueID: leagueID,
    leagueName: leagueName,
  };
}

function fetchStandings(leagueID, leagueName){
  return (dispatch, getState) => {
    dispatch(requestStandings(leagueID, leagueName))
    return getStandingsByLeague(leagueID)
      .then( data => processStandings(data))
      .then( standings => dispatch(receiveStandings(standings)));
  }
}

function processStandings(data){
  collect={};
  data = data.api;
  standings = data.standings;
  standings.forEach( team => {
      teamName = team.teamName;
      stats = team.all;
      collect[teamName].push({
          rank: team.rank,
          teamID: team.team_id,
          logo: team.logo,
          totPoints: team.points,
          played: stats.matchsPlayed,
          gamesWon: stats.win,
          gamesDrawn: stats.draw,
          gamesLost: stats.lose,
          scored: stats.goalsFor,
          conceded: stats.goalsAgainst,
      });
  });
  collectNames=[];
  collectFixtures=[];
  for (team in collect) {
      collectNames.push(team);
      collectFixtures.push(collect[team]);
  }
  return [collectNames, collectFixtures];
}
