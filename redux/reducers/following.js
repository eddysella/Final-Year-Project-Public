import {
  ADD_LEAGUE_TO_FOLLOWING,
  REMOVE_LEAGUE_FROM_FOLLOWING,
  ADD_TEAM_TO_FOLLOWING,
  REMOVE_TEAM_FROM_FOLLOWING,
} from '../types'


export function followingLeagueIDs(state = [], action){
  switch(action.type){
    case ADD_LEAGUE_TO_FOLLOWING:
      return [...state, action.leagueID]
    case REMOVE_LEAGUE_FROM_FOLLOWING:
      return state.filter(function(value, index, arr){
        return value != action.leagueID;
      });
    default:
      return state;
  }
}


export function followingTeamIDs(state = [], action){
  switch(action.type){
    case ADD_TEAM_TO_FOLLOWING:
      return [...state, action.teamID]
    case REMOVE_TEAM_FROM_FOLLOWING:
      return state.filter(function(value, index, arr){
        return value != action.teamID;
      });
      return
    default:
      return state;
  }
}
