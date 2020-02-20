import {
  PLAYER_RECEIVE_BY_ID,
} from '../types/player'

function player(
  state = {},action){
  switch(action.type){
    case PLAYER_RECEIVE_BY_ID:
    return Object.assign({}, state, {
      isFetching: false,
      playerID: action.playerID,
      name: action.name,
      age: action.age,
      nationality: action.nationality,
    });
    default:
      return state;
  }
}

export function playersByID(state={}, action){
  switch(action.type){
    case PLAYER_RECEIVE_BY_ID:
      return Object.assign({}, state, {
        [action.playerID]: player(state[action.playerID], action)
        });
    default:
      return state;
  }
}
