import {
  FOLLOWING_ADD_LEAGUE,
  FOLLOWING_REMOVE_LEAGUE,
  FOLLOWING_ADD_TEAM,
  FOLLOWING_REMOVE_TEAM,
} from '../types/following'
/**
 * @module Redux Reducers following
 */

/**
 * The following league IDs store is an array which holds a set of unique
 * league IDs which the user 'follows'.
 * @method followingLeagueIDs
 * @param  {Array} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to
 * make to the store
 * @return {Object} The new state with the modification applied
 */
export function followingLeagueIDs(state = [], action){
  switch(action.type){
    case FOLLOWING_ADD_LEAGUE:
      return [...state, action.leagueID]
    case FOLLOWING_REMOVE_LEAGUE:
      return state.filter(function(value, index, arr){
        return value != action.leagueID;
      });
      return
    default:
      return state;
  }
}

/**
 * The following team IDs store is an array which holds a set of unique
 * team IDs which the user 'follows'.
 * @method followingTeamIDs
 * @param  {Array} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to
 * make to the store
 * @return {Object} The new state with the modification applied
 */
export function followingTeamIDs(state = [], action){
  switch(action.type){
    case FOLLOWING_ADD_TEAM:
      return [...state, action.teamID]
    case FOLLOWING_REMOVE_TEAM:
      return state.filter(function(value, index, arr){
        return value != action.teamID;
      });
      return
    default:
      return state;
  }
}
