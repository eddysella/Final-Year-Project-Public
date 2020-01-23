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
    teamNames: standings[0],
    standingsInOrder: standings[1],
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
  return (dispatch, getState) => {
    dispatch(requestStandings(leagueID))
    return getStandingsByLeague(leagueID)
      .then( data => processStandings(data))
      .then( standings => dispatch(receiveStandings(standings)));
  }
}

function processStandings(data){
  names=[];
  collect=[];
  data = data.api;
  standings = data.standings;
  standings.forEach( team => {
      names.push(team.teamName);
      stats = team.all;
      collect.push({
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
  return [names, collect]
}
