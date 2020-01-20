import {
  REQUEST_STATISTICS_BY_LEAGUE_AND_TEAM_ID,
  RECEIVE_STATISTICS_BY_LEAGUE_AND_TEAM_ID,
  REQUEST_PLAYER_STATS_BY_TEAM_ID,
  RECEIVE_PLAYER_STATS_BY_TEAM_ID,
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
        teamID: action.teamID,
        leagueID: action.leagueID,
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
          [action.key]: teamStats(state[action.key], action)
        });
    default:
      return state;
  }
}


function playerStats(
  state = {
    isFetching: false,
    playerID: "",
    name: "",
    position: "",
    nationality: "",
    injured: "",
    captain: "",
    shots: {},
     goals: {},
     passes: {},
     tackles: {},
     dribbles: {},
     fouls: {},
     cards: {},
     penalties: {},
     games: {},
  },
  action
  ){
  switch(action.type){
    case REQUEST_PLAYER_STATS_BY_TEAM_ID:
      return Object.assign({}, state, {
        isFetching: true,
        playerID: action.playerID,
      })
    case RECEIVE_PLAYER_STATS_BY_TEAM_ID:
    return Object.assign({
      isFetching: false,
      name: action.name,
      position: action.position,
      nationality: action.nationality,
      injured: action.injured,
      captain: action.captain,
      shots: action.shots,
       goals: action.goals,
       passes: action.passes,
       tackles: action.tackles,
       dribbles: action.dribbles,
       fouls: action.fouls,
       cards: action.cards,
       penalties: action.penalties,
       games: action.games,
    });
    default:
      return state;
  }
}

export function playerStatsByPlayerID(state={}, action){
  switch(action.type){
    case REQUEST_PLAYER_STATS_BY_TEAM_ID:
    case RECEIVE_PLAYER_STATS_BY_TEAM_ID:
      return Object.assign({}, state, {
        [action.playerID]: playerStats(state[action.playerID], action)
        });
    default:
      return state;
  }
}
