import {
  REQUEST_TEAM_STATISTICS_BY_ID,
  RECEIVE_TEAM_STATISTICS_BY_ID,
  REQUEST_PLAYER_STATS_BY_ID,
  RECEIVE_PLAYER_STATS_BY_ID,
} from '../types'
import { getStatisticsForTeamInLeague, getPlayerStatisticsByTeamID } from '../../fetch/Team';
import { requestPlayersForTeam, receivePlayerIDsForTeam } from './teams'

// from https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

export function requestTeamStatsByID(teamID, leagueID){
  key = "" + teamID + leagueID;
  return {
    type: REQUEST_TEAM_STATISTICS_BY_ID,
    key: key.hashCode(),
    teamID: teamID,
    leagueID: leagueID,
  };
}

export function receiveTeamStatsByID(teamID, leagueID, team){
  key = "" + teamID + leagueID;
  return {
    type: RECEIVE_TEAM_STATISTICS_BY_ID,
    key: key.hashCode(),
    matchesPlayed: team.matchesPlayed,
    wins: team.wins,
    draws: team.draws,
    losses: team.losses,
    goals: team.goals,
    conceded: team.conceded,
  };
}

export function fetchTeamStatistics(teamID, leagueID){
  return (dispatch, getState) => {
    dispatch( requestTeamStatsByID(teamID, leagueID))
    return getStatisticsForTeamInLeague(teamID, leagueID)
      .then( data => processTeamStatistics(data))
      .then( statistics => dispatch( receiveTeamStatsByID(teamID, leagueID, statistics)));
  }
}

function processTeamStatistics(data){
  collect={};
  data = data.api;
  stats = data.statistics;
  games = stats.matchs
  goals = stats.goals
  stats.forEach( team => {
      collect = {
          gamesPlayed: games.matchsPlayed,
          gamesWon: games.wins,
          gamesDrawn: games.draws,
          gamesLost: games.loses,
          scored: goals.goalsFor,
          conceded: goals.goalsAgainst,
      };
  });
  return collect;
}

export function receivePlayerStatsByID(teamID, stats){
  key = "" + teamID + stats.playerID;
  return {
    type: RECEIVE_PLAYER_STATS_BY_ID,
    key: key.hashCode(),
    playerID: stats.playerID,
    name: stats.name,
    age: stats.age,
    position: stats.position,
    nationality: stats.nationality,
    injured: stats.injured,
    captain: stats.captain,
    shots: stats.shots,
    goals: stats.goals,
    passes: stats.passes,
    tackles: stats.tackles,
    dribbles: stats.dribbles,
    fouls: stats.fouls,
    cards: stats.cards,
    penalties: stats.penalties,
    games: stats.games,
  };
}

export function fetchPlayerStatistics(teamID){
  return (dispatch, getState) => {
    dispatch( requestPlayersForTeam(teamID))
    return getPlayerStatisticsByTeamID(teamID)
      .then( data => processPlayerStatistics(data))
      .then( statistics => dispatch( receivePlayerStats(teamID, statistics)));
  }
}

function receivePlayerStats(teamID, statistics){
  return (dispatch, getState) => {
    dispatch( receivePlayerIDsForTeam(teamID, statistics[0]))
    .then( () => {
      for (player in statistics[1]){
        dispatch( receivePlayerStats(teamID, player));
      }
    });
  }
}

function processPlayerStatistics(data){
  collect=[];
  ids=[];
  data = data.api;
  players = data.players;
  stats.forEach( player => {
      ids.push(player.player_id);
      collect.push({
        playerID:player.played_id,
        name: player.player_name,
        age: player.age,
        position: player.position,
        nationality: player.nationality,
        injured: player.injured,
        captain: player.captain,
        shots: player.shots,
        goals: player.goals,
        passes: player.passes,
        tackles: player.tackles,
        dribbles: player.dribbles,
        fouls: player.fouls,
        cards: player.cards,
        penalties: player.penalty,
        games: player.games,
      });
  });
  return collect;
}
