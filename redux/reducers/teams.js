import {
  TEAM_REQUEST_BY_ID,
  TEAM_RECEIVE_BY_ID,
  TEAM_REQUEST_PLAYERS,
  TEAM_RECEIVE_PLAYERS,
  TEAM_REQUEST_LEAGUES,
  TEAM_RECEIVE_LEAGUES,
  TEAM_RECEIVE_MULTIPLE_TEAMS,
  TEAM_SET_STATS_FETCHED_TRUE,
} from '../types/team'
/**
 * @module Redux Reducers teams
 */

/**
 * [team description]
 * @method team
 * @param  {Object} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to make to the store
 * @property {Object} state
 * @property  {Object} fetchingTeam Default=false Set to true when fetching
 * the initial team properties, false otherwise
 * @property  {Boolean} fetchingLeagues Default=false Set to true when fetching
 * the leagues the team plays in, false otherwise
 * @property  {Boolean} fetchingPlayers Default=false Set to true when fetching
 * the current squad of the team, false otherwise
 * @property  {String} name The name of the team
 * @property  {String} logo The URI of the logo of the team
 * @property  {String} statsFetched Default=false Set to true IFF the statistics
 * of the players have been fetched
 * @property  {Array} playerIDs An array containing the player IDs of the players
 * in the team
 * @property  {Array} leagueIDs An array containing the league IDs the teams
 * plays in
 * @return {Object} The new state with the modification applied
 */
function team(
  state = {
    fetchingTeam: false,
    fetchingLeagues: false,
    fetchingPlayers: false,
    name: '',
    logo: '',
    statsFetched: false,
  },
  action
  ){
  switch(action.type){
    case TEAM_REQUEST_BY_ID:
      return Object.assign({}, state, {
        fetchingTeam: true,
      })
    case TEAM_RECEIVE_BY_ID:
    return Object.assign({}, state, {
      fetchingTeam: false,
      country: action.country,
      name: action.name,
      logo: action.logo,
    });
    case TEAM_REQUEST_PLAYERS:
    return Object.assign({}, state, {
      fetchingPlayers: true,
      playerIDs:[],
    });
    case TEAM_RECEIVE_PLAYERS:
    return Object.assign({}, state, {
      fetchingPlayers: false,
      playerIDs: action.playerIDs,
    });
    case TEAM_REQUEST_LEAGUES:
    return Object.assign({}, state, {
      fetchingLeagues: true,
      leagueIDs:[],
    });
    case TEAM_RECEIVE_LEAGUES:
    return Object.assign({}, state, {
      fetchingLeagues: false,
      leagueIDs: action.leagueIDs,
    });
    case TEAM_SET_STATS_FETCHED_TRUE:
    return Object.assign({}, state, {
      statsFetched: true,
    });
    default:
      return state;
  }
}

/**
 * The teams by ID store contains entities referenced by a team ID which hold
 * all the properties related to a single team.
 * @method teamsByID
 * @param  {Object} state The current state of the store
 * @param {Object} action (propertyName : property) The modification to
 * make to the store
 * @property {Object} state
 * @property {Object} state.teamID An Object containing all properties belonging
 * to a single team.
 * @return {Object} The new state with the modification applied
 */
export function teamsByID(state={
  fetching:false,
}, action){
  switch(action.type){
    case TEAM_REQUEST_BY_ID:
    case TEAM_REQUEST_PLAYERS:
    case TEAM_REQUEST_LEAGUES:
    return Object.assign({}, state, {
      fetching: true,
      [action.teamID]: team(state[action.teamID], action),
    });
    case TEAM_RECEIVE_BY_ID:
    case TEAM_RECEIVE_PLAYERS:
    case TEAM_RECEIVE_LEAGUES:
      return Object.assign({}, state, {
        fetching: false,
        [action.teamID]: team(state[action.teamID], action),
        });
    case TEAM_SET_STATS_FETCHED_TRUE:
      return Object.assign({}, state, {
        [action.teamID]: team(state[action.teamID], action),
        });
    case TEAM_RECEIVE_MULTIPLE_TEAMS:
      return Object.assign({}, state, action.teams);
    default:
      return state;
  }
}
