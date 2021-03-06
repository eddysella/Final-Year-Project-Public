import {
  PLAYER_RECEIVE_BY_ID,
} from '../types/player'
/**
 * @module Redux Reducers players
 */

/**
 * The players by ID store contains entities referenced by a player ID which
 * hold all the poperties related to a single player.
 * @method playersByID
 * @param {Object} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to make to the store
 * @property {Object} state
 * @property {Object} state.playerID An Object containing all properties
 * belonging to a player where playerID is a valid Integer player ID
 * @return {Object} The new state with the modification applied
 */
export function playersByID(state={}, action){
  switch(action.type){
    case PLAYER_RECEIVE_BY_ID:
      return Object.assign({}, state, {
        [action.playerID]: {
            isFetching: false,
            playerID: action.playerID,
            name: action.name,
            age: action.age,
            nationality: action.nationality,
          }
        });
    default:
      return state;
  }
}
