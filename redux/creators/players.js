import {
  RECEIVE_PLAYER,
} from '../types'

export function receivePlayer(stats){
  return {
    type: RECEIVE_PLAYER,
    playerID: stats.playerID,
    name: stats.name,
    age: stats.age,
    position: stats.position,
    nationality: stats.nationality,
  };
}

export function processPlayers(data){
  collect=[];
  ids=[];
  data = data.api;
  players = data.players;
  players.forEach( player => {
    ids.push(player.player_id);
    collect.push({
      playerID:player.player_id,
      name: player.player_name,
      age: player.age,
      position: player.position,
      nationality: player.nationality,
    });
  });
  return [ids, collect];
}
