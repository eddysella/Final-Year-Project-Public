import {
  REQUEST_TEAM_BY_ID,
  RECEIVE_TEAM_BY_ID,
  REQUEST_PLAYERS_FOR_TEAM,
  RECEIVE_PLAYERS_FOR_TEAM,
  REQUEST_LEAGUES_FOR_TEAM,
  RECEIVE_LEAGUES_FOR_TEAM,
  RECEIVE_MULTIPLE_TEAMS,
  STATS_FETCHED_FOR_TEAM,
} from '../types'

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
    case REQUEST_TEAM_BY_ID:
      return Object.assign({}, state, {
        fetchingTeam: true,
      })
    case RECEIVE_TEAM_BY_ID:
    return Object.assign({}, state, {
      fetchingTeam: false,
      name: action.teamName,
      logo: action.logo,
    });
    case REQUEST_PLAYERS_FOR_TEAM:
    return Object.assign({}, state, {
      fetchingPlayers: true,
      playerIDs:[],
    });
    case RECEIVE_PLAYERS_FOR_TEAM:
    return Object.assign({}, state, {
      fetchingPlayers: false,
      playerIDs: action.playerIDs,
    });
    case REQUEST_LEAGUES_FOR_TEAM:
    return Object.assign({}, state, {
      fetchingLeagues: true,
      leagueIDs:[],
    });
    case RECEIVE_LEAGUES_FOR_TEAM:
    return Object.assign({}, state, {
      fetchingLeagues: false,
      leagueIDs: action.leagueIDs,
    });
    case STATS_FETCHED_FOR_TEAM:
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
    case REQUEST_TEAM_BY_ID:
    case REQUEST_PLAYERS_FOR_TEAM:
    case REQUEST_LEAGUES_FOR_TEAM:
    return Object.assign({}, state, {
      fetching: true,
      [action.teamID]: team(state[action.teamID], action),
    });
    case RECEIVE_TEAM_BY_ID:
    case RECEIVE_PLAYERS_FOR_TEAM:
    case RECEIVE_LEAGUES_FOR_TEAM:
      return Object.assign({}, state, {
        fetching: false,
        [action.teamID]: team(state[action.teamID], action),
        });
    case STATS_FETCHED_FOR_TEAM:
      return Object.assign({}, state, {
        [action.teamID]: team(state[action.teamID], action),
        });
    case RECEIVE_MULTIPLE_TEAMS:
      return Object.assign({}, state, action.teams);
    default:
      return state;
  }
}
