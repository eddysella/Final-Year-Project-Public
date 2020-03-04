import {
  PLAYER_RECEIVE_BY_ID,
} from '../types/player'
/**
 * @module Redux Creators players
 */

/**
 * Instantiates a new player property in the playersByID store referenced by
 * the specified PlayerID.
 * Stores all the passed properties in it.
 * @method receivePlayer
 * @param  {Object} info A set of player information
 * @return {Action} type: PLAYER_RECEIVE_BY_ID
 */
export function receivePlayer(info){
  return {
    type: PLAYER_RECEIVE_BY_ID,
    playerID: info.playerID,
    name: info.name,
    age: info.age,
    nationality: info.nationality,
  };
}

/**
 * Processes a set of players.
 * @method processPlayers
 * @param  {Object} data A parsed JSON Object
 * @return {Array} [
 * 0 : [Array] A set of player ids
 * 1 : [Object] (PlayerID : data)
 * ]
 */
export function processPlayers(data){
  collect=[];
  ids={
    'Attacker': [],
    'Midfielder': [],
    'Defender': [],
    'Goalkeeper': [],
  };
  data = data.api;
  players = data.players;
  players.forEach( player => {
    if(player.position != null){
      ids[player.position].push(player.player_id);
      collect.push({
        playerID:player.player_id,
        name: player.player_name,
        age: player.age,
        nationality: player.nationality,
      });
    }
  });
  return [ids, collect];
}
