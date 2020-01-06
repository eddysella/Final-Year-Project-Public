import {
  REQUEST_STATISTICS_BY_LEAGUE_AND_TEAM_ID,
  RECEIVE_STATISTICS_BY_LEAGUE_AND_TEAM_ID,
  REQUEST_PLAYER_STATS_BY_TEAM_ID,
  RECEIVE_PLAYER_STATS_BY_TEAM_ID
} from '../action/types/types'

function teamStats(
  state = {
      isFetching: false,
      matchesPlayed: {},
      wins: {},
      draws: {},
      losses: {},
      goals: {},
      conceded: {},
  },
  action
  ){
  switch(action.type){
    case REQUEST_STATISTICS_BY_LEAGUE_AND_TEAM_ID:
      return Object.assign({}, state, {
        key: action.key,
        isFetching: true,
      })
    case RECEIVE_STATISTICS_BY_LEAGUE_AND_TEAM_ID:
    return Object.assign({
      isFetching: false,
      matchesPlayed: action.matchesPlayed,
      wins: action.wins,
      draws: action.draws,
      losses: action.losses,
      goals: action.goals,
      conceded: action.conceded,
    });
    default:
      return state;
  }
}

export function teamStatsByLeague(state={}, action){
  switch(action.type){
    case REQUEST_STATISTICS_BY_LEAGUE_AND_TEAM_ID:
    case RECEIVE_STATISTICS_BY_LEAGUE_AND_TEAM_ID:
      return Object.assign({}, state, {
          [action.key]: league(state[action.key], action)
        });
    default:
      return state;
  }
}


function playerStats(
  state = {

  },
  action
  ){
  switch(action.type){
    case :
      return Object.assign({}, state, {
      })
    case :
    return Object.assign({
    });
    default:
      return state;
  }
}

export function playerStatsByPlayerID(state={}, action){
  switch(action.type){
    case :
    case :
      return Object.assign({}, state, {
        [action.playerID]: league(state[action.playerID], action)
        });
    default:
      return state;
  }
}
