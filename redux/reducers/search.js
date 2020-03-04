import {
  SEARCH_UPDATE_INPUT,
  SEARCH_CLEAR_LEAGUE,
  SEARCH_CLEAR_TEAM,
  SEARCH_REQUEST_LEAGUE_SEARCH,
  SEARCH_RECEIVE_LEAGUE_SEARCH,
  SEARCH_REQUEST_TEAM_SEARCH,
  SEARCH_RECEIVE_TEAM_SEARCH,
} from '../types/search'
/**
 * @module Redux Reducers search
 */

/**
 * The search input store is a String representing the current value of the
 * search bar in the search tab.
 * @method searchInput
 * @param {Object} state Default = "" The current state of the store
 * @param {Object} action (propertyName : property) The modification to make to the store
 * @return {String} The new state with the modification applied
 */
export function searchInput( state = "", action ){
  switch(action.type){
    case SEARCH_UPDATE_INPUT:
      return action.input;
    default:
      return state;
  }
}

/**
 * The search store contains all properties belonging to the search functionality
 * of the search tab.
 * @method search
 * @param {Object} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to make to the store
 * @property {Object} state
 * @property  {Boolean} state.teamIsFetching Default=false Set to true when fetching
 * teams, false otherwise
 * @property  {Array} state.teamIDs An array containing the IDs of the teams
 * that were searched.
 * @property  {Boolean} state.leagueIsFetching Default=false Set to true when fetching
 * leagues, false otherwise
 * @property  {Array} state.leagueIDs An array containing the IDs of the leagues
 * that were searched.
 * @return {Object} The new state with the modification applied
 */
export function search(
  state = {
    teamIsFetching: false,
    teamIDs: [],
    leagueIsFetching: false,
    leagueIDs: [],
  },
  action
  ){
  switch(action.type){
    case SEARCH_REQUEST_LEAGUE_SEARCH:
      return Object.assign({}, state, {
        leagueIsFetching: true,
        leagueIDs: [],
      })
    case SEARCH_RECEIVE_LEAGUE_SEARCH:
      return Object.assign({}, state, {
        leagueIsFetching: false,
        leagueIDs: action.leagueIDs,
    });
    case SEARCH_CLEAR_LEAGUE:
      return Object.assign({}, state, {
        leagueIDs: [],
    });
    case SEARCH_REQUEST_TEAM_SEARCH:
      return Object.assign({}, state, {
        teamIsFetching: true,
        teamIDs: [],
      })
    case SEARCH_RECEIVE_TEAM_SEARCH:
      return Object.assign({}, state, {
        teamIsFetching: false,
        teamIDs: action.teamIDs,
    });
    case SEARCH_CLEAR_TEAM:
      return Object.assign({}, state, {
        teamIDs: [],
    });
    default:
      return state;
  }
}
