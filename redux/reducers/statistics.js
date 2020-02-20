import {
  STATS_REQUEST_BY_PLAYER_ID,
  STATS_RECEIVE_BY_PLAYER_ID,
} from '../types/statistics'

export function playerStatsByID(state={
  fetching: false,
}, action){
  switch(action.type){
    case STATS_REQUEST_BY_PLAYER_ID:
      return Object.assign({}, state, {
        fetching:true,
        });
    case STATS_RECEIVE_BY_PLAYER_ID:
      return Object.assign({}, state, {
        fetching: false,
      }, action.stats);
    default:
      return state;
  }
}


  // REQUEST_TEAM_STATISTICS_BY_ID,
  // RECEIVE_TEAM_STATISTICS_BY_ID,
//
// function teamStats(
//   state = {
//       isFetching: false,
//       matchesPlayed: {},
//       wins: {},
//       draws: {},
//       losses: {},
//       goals: {},
//       conceded: {},
//   },
//   action
//   ){
//   switch(action.type){
//     case REQUEST_TEAM_STATISTICS_BY_ID:
//       return Object.assign({}, state, {
//         teamID: action.teamID,
//         leagueID: action.leagueID,
//         isFetching: true,
//       })
//     case RECEIVE_TEAM_STATISTICS_BY_ID:
//     return Object.assign({}, state, {
//       isFetching: false,
//       matchesPlayed: action.matchesPlayed,
//       wins: action.wins,
//       draws: action.draws,
//       losses: action.losses,
//       goals: action.goals,
//       conceded: action.conceded,
//     });
//     default:
//       return state;
//   }
// }
//
// export function teamStatsByLeague(state={}, action){
//   switch(action.type){
//     case REQUEST_TEAM_STATISTICS_BY_ID:
//     case RECEIVE_TEAM_STATISTICS_BY_ID:
//       return Object.assign({}, state, {
//           [action.key]: teamStats(state[action.key], action)
//         });
//     default:
//       return state;
//   }
// }



// function playerStats(
//   state = {},action){
//   switch(action.type){
//     case STATS_RECEIVE_BY_PLAYER_ID:
//     return Object.assign({}, state, {
//       shots: action.shots,
//       goals: action.goals,
//       passes: action.passes,
//       tackles: action.tackles,
//       dribbles: action.dribbles,
//       fouls: action.fouls,
//       cards: action.cards,
//       penalties: action.penalties,
//       games: action.games,
//     });
//     default:
//       return state;
//   }
// }
