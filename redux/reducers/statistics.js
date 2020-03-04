import {
  STATS_REQUEST_BY_PLAYER_ID,
  STATS_RECEIVE_BY_PLAYER_ID,
} from '../types/statistics'
/**
 * @module Redux Reducers statistics
 */

/**
 * The player stats by ID store holds all player statistics for a player on
 * a specific team.
 * @method playerStatsByID
 * @param  {Object} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to
 * make to the store
 * @property {Object} state
 * @property {Object} state.fetching Default=false Set to true when fetching
 * the statistics for a team, false otherwise
 * @property {Object} state.ID An Object containing all statistics belonging to
 * a specific player in a specific team where ID = (teamID + "x" + playerID)
 * @return {Object} The new state with the modification applied
*/
export function playerStatsByID(state={
  fetching: false,
}, action){
  switch(action.type){
    case STATS_REQUEST_BY_PLAYER_ID:
      return Object.assign({}, state, {
        fetching:true,
        });
    case STATS_RECEIVE_BY_PLAYER_ID:
      return Object.assign({}, state, {
        fetching: false,
      }, action.stats);
    default:
      return state;
  }
}
