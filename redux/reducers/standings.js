import {
  STANDINGS_REQUEST_BY_LEAGUE_ID,
  STANDINGS_RECEIVE_BY_LEAGUE_ID,
} from '../types/standings'
/**
 * @module Redux Reducers standings
 */

/**
 * An entity in the standingsByLeagueID store, holds all properties belonging
 * to a single set of standings.
 * @method standings
 * @param {Object} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to make to the store
 * @property {Object} state
 * @property {Boolean} fetching Default=false Set to true when fetching
 * the standings belonging to a league, false otherwise
 * @property {timestamp} lastUpdated A timestamp of when the standings were fetched
 * @property {Array} data An array containing a set of Objects with each
 * representing a specific team in the league.
 * @return {Object} The new state with the modification applied
 */
function standings(
  state = {
    fetching: false,
    lastUpdated: '',
    data: [],
  },
  action
  ){
  switch(action.type){
    case STANDINGS_REQUEST_BY_LEAGUE_ID:
      return Object.assign({}, state, {
        fetching: true,
      });
    case STANDINGS_RECEIVE_BY_LEAGUE_ID:
      return Object.assign({}, state, {
        fetching: false,
        data: action.standings,
        lastUpdated: action.lastUpdated,
      });
    default:
      return state;
  }
}

/**
 * The standings by league ID store contains entities referenced by a league ID which
 * hold all the poperties related to a single league's standings.
 * @method standingsByLeagueID
 * @param {Object} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to make to the store
 * @property {Object} state
 * @property {Boolean} state.fetching Default=false Set to true when fetching
 * standings for a specific league, false otherwise
 * @property {Object} state.leagueID An Object containing all properties
 * belonging to the standings of a league where leagueID is a valid Integer league ID
 * @return {Object} The new state with the modification applied
 */
export function standingsByLeagueID(state={
  fetching: false,
}, action){
  switch(action.type){
    case STANDINGS_REQUEST_BY_LEAGUE_ID:
      return Object.assign({}, state, {
        fetching: true,
        [action.leagueID]: standings(state[action.leagueID], action),
      });
    case STANDINGS_RECEIVE_BY_LEAGUE_ID:
      return Object.assign({}, state, {
        fetching: false,
        [action.leagueID]: standings(state[action.leagueID], action),
      });
    default:
      return state;
  }
}
