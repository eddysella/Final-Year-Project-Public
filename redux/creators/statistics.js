import {
  REQUEST_PLAYER_STATS_BY_ID,
  RECEIVE_PLAYER_STATS_BY_ID,
} from '../types'
import { getPlayerStatisticsByTeamID } from '../../fetch/Team';
import { confirmStatsFetched } from './teams'

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

function shouldFetchStats(team){
  if(!(team.statsFetched)){
    return true;
  }else if(stats.fetching){
    return false;
  }else{
    return false;
  }
}

export function fetchPlayerStatistics(teamID){
  return (dispatch, getState) => {
    if(shouldFetchStats(getState().teamsByID[teamID])){
      console.log("FetchingStats")
      dispatch( requestPlayersStatsForTeam(teamID))
      return getPlayerStatisticsByTeamID(teamID)
        .then( data => processPlayerStats(data, teamID))
        .then( statistics => {
          dispatch( confirmStatsFetched(teamID));
          dispatch( receivePlayerStatsForTeam(statistics));
        })
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
      collect[key] = player;
    }else{
      current = collect[key];
      Object.assign(collect[key], {
        cards: cards(current.cards, player.cards),
        dribbles: dribbles(current.dribbles, player.dribbles),
        fouls: fouls(current.fouls, player.fouls),
        games: games(current.games, player.games),
        goals: goals(current.goals, player.goals),
        passes: passes(current.passes, player.passes),
        shots: shots(current.shots, player.shots),
        tackles: tackles(current.tackles, player.tackles),
      });
    }
  });
  return collect;
}

function sumStat(current=null, additional=null, stat){
  cur = current[stat];
  add = additional[stat];
  if(cur == 'NaN' && add != 'NaN'){
    return add;
  }else if(cur != 'NaN' && add == 'NaN'){
    return cur;
  }else if(cur == 'NaN' && add == 'NaN'){
    return 0;
  }
  return cur + add;
}

function cards(current, additional){
  return {
    red: sumStat(current, additional, 'red'),
    yellow: sumStat(current, additional, 'yellow'),
  }
}

function dribbles(current, additional){
  return {
    attempts: sumStat(current, additional, 'attempts'),
    success: sumStat(current, additional, 'success'),
  }
}

function fouls(current, additional){
  return {
    committed: sumStat(current, additional, 'committed'),
    drawn: sumStat(current, additional, 'drawn'),
  }
}

function games(current, additional){
  return {
    appearences: sumStat(current, additional, 'appearences'),
    minutes_played: sumStat(current, additional, 'minutes_played'),
  }
}

function goals(current, additional){
  return {
    assists: sumStat(current, additional, 'assists'),
    total: sumStat(current, additional, 'total'),
  }
}

function accuracy(current=null, additional=null){
  if(!current.total || !additional.total){
    return current.accuracy < 1 ? (current.accuracy * 100) : current.accuracy ;
  }else{
    curAcc = ((current.accuracy / 100) * current.total);
    addAcc = ((additional.accuracy / 100) * additional.total);
    total = (current.total + additional.total);
    return ((curAcc + addAcc) / total);
  }
}

function passes(current, additional){

  return {
    key: sumStat(current, additional, 'key'),
    accuracy: accuracy(current, additional),
  }
}

function shots(current, additional){
  return {
    on: sumStat(current, additional, 'on'),
    total: sumStat(current, additional, 'total'),
  }
}

function tackles(current, additional){
  return {
    interceptions: sumStat(current, additional, 'interceptions'),
    total: sumStat(current, additional, 'total'),
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

//
// function processPlayerStats(data, teamID){
//   collect={};
//   data = data.api;
//   players = data.players;
//
//   if(!players){
//     return {};
//   }
//
//   players.forEach( player => {
//     key = (teamID + "x" + player.player_id);
//     if(!(key in collect)){
//       collect[key]={};
//     }
//     Object.assign(collect[key], createStats(collect[key], player));
//   });
//   console.log(collect)
//   return collect;
// }
//
// function createStats(current=null, additional=null){
//
//   if(Object.entries(current).length === 0){
//     return additional;
//   }
//
//   stats={
//   cards: ['red', 'yellow'],
//   dribbles: ['attempts','success'],
//   fouls: ['committed', 'drawn'],
//   games: ['appearances', 'minutes_played'],
//   goals: ['assists', 'total'],
//   shots: ['on', 'total'],
//   tackles: ['interceptions', 'total'],
//
//   for(group in stats){
//     stats[group]=sumStat(current, additional, stats[group]);
//   }
//
//   stats.passes.accuracy = accuracy(current, additional);
//   return stats;
// }
//
// function sumStat(current=null, additional=null, group){
//   collect = {}
//   for (stat in group){
//     collect[stat] = current[stat] + additional[stat];
//   }
//   return collect;
// }
//
//
