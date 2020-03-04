import {
  STATS_REQUEST_BY_PLAYER_ID,
  STATS_RECEIVE_BY_PLAYER_ID,
} from '../types/statistics'
import { getPlayerStatisticsByTeamID } from '../../fetch/Team';
import { confirmStatsFetched } from './teams'
/**
 * @module Redux Creators statistics
 */

/**
 * Sets the fetching property of the playerStatsByID store to true.
 * @method requestPlayersStatsForTeam
 * @param  {Integer} teamID A team ID
 * @return {Action} type: STATS_REQUEST_BY_PLAYER_ID
 */
export function requestPlayersStatsForTeam(teamID){
  return {
    type: STATS_REQUEST_BY_PLAYER_ID,
    teamID: teamID,
  };
}

/**
 * Sets the fetching property of the playerStatsByID store to false.
 * Adds a set of statistics referenced by "teamID + playerID" into the store.
 * @method receivePlayerStatsForTeam
 * @param  {Object} stats (playerID : data)
 * @return {Action} type: STATS_RECEIVE_BY_PLAYER_ID
 */
export function receivePlayerStatsForTeam(stats){
  return {
    type: STATS_RECEIVE_BY_PLAYER_ID,
    stats: stats,
  };
}

/**
 * Should fetch test for player statistics.
 * @method shouldFetchStats
 * @param  {Object} team A team with properties
 * @return {Boolean}
 */
function shouldFetchStats(team){
  if(!(team.statsFetched)){
    return true;
  }else if(stats.fetching){
    return false;
  }else{
    return false;
  }
}

/**
 * Fetch sequence for player statistics for the specified team.
 * @method fetchPlayerStatistics
 * @param  {Integer} teamID A team ID
 * @return {Function}
 */
export function fetchPlayerStatistics(teamID){
  return (dispatch, getState) => {
    if(shouldFetchStats(getState().teamsByID[teamID])){
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

/**
 * Processes a set of player statistics for a team.
 * @method processPlayerStats
 * @param  {Object} data A parsed JSON Object
 * @param  {Integer} teamID A team ID
 * @return {Object} (playerID : data)
 */
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
      // all the player stats are assigned here
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

/**
 * Sums an old and new statistic.
 * If either is NaN returns the other.
 * If bother are NaN returns 0.
 * @method sumStat
 * @param  {Object} current (statName : stat) An object holding a set of statistics
 * @param  {Object} additional (statName : stat) An object holding a set of statistics
 * @param  {String} stat the statistic name
 * @return {Integer}
 */
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

/**
 * Sums a set of current and additional statistics pertaining to Cards.
 * @method cards
 * @param  {Object} current (statName : stat) An object holding a set of statistics
 * @param  {Object} additional (statName : stat) An object holding a set of statistics
 * @return {Object} (statName : stat)
 */
function cards(current, additional){
  return {
    red: sumStat(current, additional, 'red'),
    yellow: sumStat(current, additional, 'yellow'),
  }
}

/**
 * Sums a set of current and additional statistics pertaining to Dribbles.
 * @method dribbles
 * @param  {Object} current (statName : stat) An object holding a set of statistics
 * @param  {Object} additional (statName : stat) An object holding a set of statistics
 * @return {Object} (statName : stat)
 */
function dribbles(current, additional){
  return {
    attempts: sumStat(current, additional, 'attempts'),
    success: sumStat(current, additional, 'success'),
  }
}

/**
 * Sums a set of current and additional statistics pertaining to Fouls.
 * @method fouls
 * @param  {Object} current (statName : stat) An object holding a set of statistics
 * @param  {Object} additional (statName : stat) An object holding a set of statistics
 * @return {Object} (statName : stat)
 */
function fouls(current, additional){
  return {
    committed: sumStat(current, additional, 'committed'),
    drawn: sumStat(current, additional, 'drawn'),
  }
}

/**
 * Sums a set of current and additional statistics pertaining to Games.
 * @method games
 * @param  {Object} current (statName : stat) An object holding a set of statistics
 * @param  {Object} additional (statName : stat) An object holding a set of statistics
 * @return {Object} (statName : stat)
 */
function games(current, additional){
  return {
    appearences: sumStat(current, additional, 'appearences'),
    minutes_played: sumStat(current, additional, 'minutes_played'),
  }
}

/**
 * Sums a set of current and additional statistics pertaining to Goals.
 * @method goals
 * @param  {Object} current (statName : stat) An object holding a set of statistics
 * @param  {Object} additional (statName : stat) An object holding a set of statistics
 * @return {Object} (statName : stat)
 */
function goals(current, additional){
  return {
    assists: sumStat(current, additional, 'assists'),
    total: sumStat(current, additional, 'total'),
  }
}

/**
 * Sums the accuracy percentage of current and additional statistics.
 * @method accuracy
 * @param  {Object} current (statName : stat) An object holding a set of statistics
 * @param  {Object} additional (statName : stat) An object holding a set of statistics
 * @return {Integer} An accuracy value (2 digits)
 */
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

/**
 * Sums a set of current and additional statistics pertaining to Passes.
 * Calculates the new passing accuracy.
 * @method passes
 * @param  {Object} current (statName : stat) An object holding a set of statistics
 * @param  {Object} additional (statName : stat) An object holding a set of statistics
 * @return {Object} (statName : stat)
 */
function passes(current, additional){
  return {
    key: sumStat(current, additional, 'key'),
    accuracy: accuracy(current, additional),
  }
}

/**
 * Sums a set of current and additional statistics pertaining to Shots.
 * @method shots
 * @param  {Object} current (statName : stat) An object holding a set of statistics
 * @param  {Object} additional (statName : stat) An object holding a set of statistics
 * @return {Object} (statName : stat)
 */
function shots(current, additional){
  return {
    on: sumStat(current, additional, 'on'),
    total: sumStat(current, additional, 'total'),
  }
}

/**
 * Sums a set of current and additional statistics pertaining to Tackles.
 * @method tackles
 * @param  {Object} current (statName : stat) An object holding a set of statistics
 * @param  {Object} additional (statName : stat) An object holding a set of statistics
 * @return {Object} (statName : stat)
 */
function tackles(current, additional){
  return {
    interceptions: sumStat(current, additional, 'interceptions'),
    total: sumStat(current, additional, 'total'),
  }
}
