import {
  LEAGUE_REQUEST_BY_ID,
  LEAGUE_RECEIVE_BY_ID,
  LEAGUE_REQUEST_TEAMS,
  LEAGUE_RECEIVE_TEAMS,
  LEAGUE_RECEIVE_MULTIPLE_LEAGUES,
} from '../types/leagues'
/**
 * @module Redux Reducers leagues
 */

/**
 * An entity in the leaguesByID store, holds all properties belonging to a single league.
 * @method league
 * @param {Object} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to make to the store
 * @property {Object} state
 * @property  {Object} state.fetchingLeague Default=false Set to true when fetching
 * the league, false otherwise
 * @property  {Boolean} state.fetchingTeams Default=false Set to true when fetching
 * all teams belonging to a league, false otherwise
 * @property  {Integer} state.leagueID The league ID of the entity
 * @property  {String} state.name The name of the league
 * @property  {String} state.countryCode The 3 char country code of the league
 * @property  {String} state.logo The URI logo of the team
 * @property  {Array} state.teamIDs The IDs of the teams belonging to this league
 * @return {Object} The new state with the modification applied
 */
function league(
  state = {
    fetchingLeague: false,
    fetchingTeams: false,
    fetchingFixtures: false,
    leagueID: '',
    name: '',
    countryCode: '',
    logo: '',
  },
  action
  ){
  switch(action.type){
    case LEAGUE_REQUEST_BY_ID:
      return Object.assign({}, state, {
        leagueID: action.leagueID,
        fetchingLeague: true,
      })
    case LEAGUE_RECEIVE_BY_ID:
    return Object.assign({}, state, {
      fetchingLeague: false,
      name: action.name,
      countryCode: action.countryCode,
      logo: action.logo,
      seasonStart: action.seasonStart,
      seasonEnd: action.seasonEnd,
    });
    case LEAGUE_REQUEST_TEAMS:
      return Object.assign({}, state, {
        fetchingTeams: true,
      })
    case LEAGUE_RECEIVE_TEAMS:
      return Object.assign({}, state, {
        fetchingTeams: false,
        teamIDs: action.teamIDs,
      })
    default:
      return state;
  }
}

/**
 * The leagues by ID store contains entities referenced by a league ID which
 * hold all the poperties related to a single league.
 * @method leaguesByID
 * @param {Object} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to make to the store
 * @property {Object} state
 * @property {Boolean} state.fetching Default=false Set to true when fetching
 * more data for a specific league, false otherwise
 * @property {Object} state.leagueID An Object containing all properties
 * belonging to a league where leagueID is a valid Integer league ID
 * @return {Object} The new state with the modification applied
 */
export function leaguesByID(state={
  fetching:false,
}, action){
  switch(action.type){
    case LEAGUE_REQUEST_BY_ID:
    case LEAGUE_REQUEST_TEAMS:
      return Object.assign({}, state, {
        fetching: true,
        [action.leagueID]: league(state[action.leagueID], action)
        });
    case LEAGUE_RECEIVE_BY_ID:
    case LEAGUE_RECEIVE_TEAMS:
      return Object.assign({}, state, {
        fetching:false,
        [action.leagueID]: league(state[action.leagueID], action)
        });
    case LEAGUE_RECEIVE_MULTIPLE_LEAGUES:
      return Object.assign({}, state, action.leagues);
    default:
      return state;
  }
}
