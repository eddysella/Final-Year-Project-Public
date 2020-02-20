import {
  FOLLOWING_ADD_LEAGUE,
  FOLLOWING_REMOVE_LEAGUE,
  FOLLOWING_ADD_TEAM,
  FOLLOWING_REMOVE_TEAM,
} from '../types/following'


export function followingLeagueIDs(state = [], action){
  switch(action.type){
    case FOLLOWING_ADD_LEAGUE:
      return [...state, action.leagueID]
    case FOLLOWING_REMOVE_LEAGUE:
      return state.filter(function(value, index, arr){
        return value != action.leagueID;
      });
      return
    default:
      return state;
  }
}


export function followingTeamIDs(state = [], action){
  switch(action.type){
    case FOLLOWING_ADD_TEAM:
      return [...state, action.teamID]
    case FOLLOWING_REMOVE_TEAM:
      return state.filter(function(value, index, arr){
        return value != action.teamID;
      });
      return
    default:
      return state;
  }
}
