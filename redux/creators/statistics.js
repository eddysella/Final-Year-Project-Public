import {
  REQUEST_PLAYER_STATS_BY_ID,
  RECEIVE_PLAYER_STATS_BY_ID,
} from '../types'
import { getPlayerStatisticsByTeamID } from '../../fetch/Team';

export function requestPlayersStatsForTeam(teamID, leagueID){
  return {
    type: REQUEST_PLAYER_STATS_BY_ID,
    teamID: teamID,
  };
}

export function receivePlayerStatsForTeam(stats){
  return {
    type: RECEIVE_PLAYER_STATS_BY_ID,
    stats: stats,
  };
}

function shouldFetchStats(stats){
  if(!stats){
    return true;
  }else if(stats.fetching){
    return false;
  }
}

export function fetchPlayerStatistics(teamID){
  return (dispatch, getState) => {
    if(shouldFetchStats(getState().playerStatsByID[teamID])){
      dispatch( requestPlayersStatsForTeam(teamID))
      return getPlayerStatisticsByTeamID(teamID)
        .then( data => processPlayerStats(data, teamID))
        .then( statistics => dispatch( receivePlayerStatsForTeam(statistics)))
    }
  }
}

function processPlayerStats(data, teamID){
  collect={};
  data = data.api;
  players = data.players;

  if(!players){
    return {};
  }

  players.forEach( player => {
    key = (teamID + "x" + player.player_id);
    if(collect[key] === undefined){
      collect[key] = {
        name: player.player_name,
        cards: player.cards,
        dribbles: player.dribbles,
        fouls: player.fouls,
        games: player.games,
        goals: player.goals,
        passes: player.passes,
        shots: player.shots,
        tackles: player.tackles,
      };
    }else{
      current = collect[key];
      Object.assign(collect[key], {
        cards: cards(player.cards, current.cards),
        dribbles: dribbles(player.dribbles, current.dribbles),
        fouls: fouls(player.fouls, current.fouls),
        games: games(player.games, current.games),
        goals: goals(player.goals, current.goals),
        passes: passes(player.passes, current.passes),
        shots: shots(player.shots, current.shots),
        tackles: tackles(player.tackles, current.tackles),
      });
    }
  });
  return collect;
}

function cards(current, additional){
  return {
    red: (current.red + additional.red),
    yellow: (current.yellow + additional.yellow),
  }
}

function dribbles(current, additional){
  return {
    attempts: (current.attempts + additional.attempts),
    success: (current.success + additional.success),
  }
}

function fouls(current, additional){
  return {
    commited: (current.commited + additional.commited),
    drawn: (current.drawn + additional.drawn),
  }
}

function games(current, additional){
  return {
    appearances: (current.appearances + additional.appearances),
    minutes_played: (current.minutes_played + additional.minutes_played),
  }
}

function goals(current, additional){
  return {
    assists: (current.assists + additional.assists),
    total: (current.total + additional.total),
  }
}

function passes(current, additional){

  curAcc = ((current.accuracy / 100) * current.total);
  addAcc = ((additional.accuracy / 100) * additional.total);
  total = (current.total + additional.total);
  accuracy = ((curAcc + addAcc) / total);

  return {
    key: (current.key + additional.key),
    accuracy: accuracy,
  }
}

function shots(current, additional){
  return {
    on: (current.on + additional.on),
    total: (current.total + additional.total),
  }
}

function tackles(current, additional){
  return {
    interceptions: (current.interceptions + additional.interceptions),
    total: (current.total + additional.total),
  }
}

//
// export function requestTeamStatsByID(teamID, leagueID){
//   key = "" + teamID + leagueID;
//   return {
//     type: REQUEST_TEAM_STATISTICS_BY_ID,
//     key: key.hashCode(),
//     teamID: teamID,
//     leagueID: leagueID,
//   };
// }
//
// export function receiveTeamStatsByID(teamID, leagueID, team){
//   key = "" + teamID + leagueID;
//   return {
//     type: RECEIVE_TEAM_STATISTICS_BY_ID,
//     key: key.hashCode(),
//     matchesPlayed: team.matchesPlayed,
//     wins: team.wins,
//     draws: team.draws,
//     losses: team.losses,
//     goals: team.goals,
//     conceded: team.conceded,
//   };
// }
//
// export function fetchTeamStatistics(teamID, leagueID){
//   return (dispatch, getState) => {
//     dispatch( requestTeamStatsByID(teamID, leagueID))
//     return getStatisticsForTeamInLeague(teamID, leagueID)
//       .then( data => processTeamStatistics(data))
//       .then( statistics => dispatch( receiveTeamStatsByID(teamID, leagueID, statistics)));
//   }
// }
//
// function processTeamStatistics(data){
//   collect={};
//   data = data.api;
//   stats = data.statistics;
//   games = stats.matchs
//   goals = stats.goals
//   stats.forEach( team => {
//       collect = {
//           gamesPlayed: games.matchsPlayed,
//           gamesWon: games.wins,
//           gamesDrawn: games.draws,
//           gamesLost: games.loses,
//           scored: goals.goalsFor,
//           conceded: goals.goalsAgainst,
//       };
//   });
//   return collect;
// }
