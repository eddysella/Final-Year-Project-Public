import {
  REQUEST_TEAM_BY_ID,
  RECEIVE_TEAM_BY_ID,
  REQUEST_PLAYERS_FOR_TEAM,
  RECEIVE_PLAYERS_FOR_TEAM,
  REQUEST_LEAGUES_FOR_TEAM,
  RECEIVE_LEAGUES_FOR_TEAM,
  REQUEST_PAST_TEAM_FIXTURES,
  RECEIVE_PAST_TEAM_FIXTURES,
  REQUEST_FUTURE_TEAM_FIXTURES,
  RECEIVE_FUTURE_TEAM_FIXTURES,
  RECEIVE_MULTIPLE_TEAMS,
} from '../types'

function team(
  state = {
    fetchingTeam: false,
    fetchingLeagues: false,
    fetchingPastFixtures: false,
    fetchingPlayers: false,
    fetchingFutureFixtures: false,
    name: '',
    logo: '',
  },
  action
  ){
  switch(action.type){
    case REQUEST_TEAM_BY_ID:
      return Object.assign({}, state, {
        fetchingTeam: true,
      })
    case RECEIVE_TEAM_BY_ID:
    return Object.assign({
      fetchingTeam: false,
      name: action.teamName,
      logo: action.logo,
    });
    case REQUEST_PLAYERS_FOR_TEAM:
    return Object.assign({
      fetchingPlayers: true,
    });
    case RECEIVE_PLAYERS_FOR_TEAM:
    return Object.assign({
      fetchingPlayers: false,
      playerIDs: action.playerIDs,
    });
    case REQUEST_LEAGUES_FOR_TEAM:
    return Object.assign({
      fetchingLeagues: true,
    });
    case RECEIVE_LEAGUES_FOR_TEAM:
    return Object.assign({
      fetchingLeagues: false,
      leagueIDs: action.leagueIDs,
    });
    case REQUEST_PAST_TEAM_FIXTURES:
    return Object.assign({
      fetchingPastFixtures: true,
    });
    case RECEIVE_PAST_TEAM_FIXTURES:
    return Object.assign({
      fetchingPastFixtures: false,
      pastFixtures: action.fixtures,
    });
    case REQUEST_FUTURE_TEAM_FIXTURES:
    return Object.assign({
      fetchingFutureFixtures: true,
    });
    case RECEIVE_FUTURE_TEAM_FIXTURES:
    return Object.assign({
      fetchingFutureFixtures: false,
      futureFixtures: action.fixtures,
    });
    default:
      return state;
  }
}

export function teamsByID(state={}, action){
  switch(action.type){
    case REQUEST_TEAM_BY_ID:
    case RECEIVE_TEAM_BY_ID:
    case REQUEST_PLAYERS_FOR_TEAM:
    case RECEIVE_PLAYERS_FOR_TEAM:
    case REQUEST_LEAGUES_FOR_TEAM:
    case RECEIVE_LEAGUES_FOR_TEAM:
    case REQUEST_PAST_TEAM_FIXTURES:
    case RECEIVE_PAST_TEAM_FIXTURES:
    case REQUEST_FUTURE_TEAM_FIXTURES:
    case RECEIVE_FUTURE_TEAM_FIXTURES:
      return Object.assign({}, state, {
        [action.teamID]: team(state[action.teamID], action)
        });
    case RECEIVE_MULTIPLE_TEAMS:
      return Object.assign({}, state, action.teams);
    default:
      return state;
  }
}
