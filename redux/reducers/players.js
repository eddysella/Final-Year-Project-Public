import {
  RECEIVE_PLAYER,
} from '../types'

function player(
  state = {},action){
  switch(action.type){
    case RECEIVE_PLAYER:
    return Object.assign({}, state, {
      isFetching: false,
      playerID: action.playerID,
      name: action.name,
      age: action.age,
      position: action.position,
      nationality: action.nationality,
    });
    default:
      return state;
  }
}

export function playersByID(state={}, action){
  switch(action.type){
    case RECEIVE_PLAYER:
      return Object.assign({}, state, {
        [action.playerID]: player(state[action.playerID], action)
        });
    default:
      return state;
  }
}
