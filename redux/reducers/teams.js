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
