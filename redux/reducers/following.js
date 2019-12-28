import {
  ADD_LEAGUE,
  REMOVE_LEAGUE,
  ADD_TEAM,
  REMOVE_TEAM,
} from '../action/types/types'


export function followingLeagueIDs(state = [], action){
  switch(action.type){
    case ADD_LEAGUE:
      return [...state, action.leagueID]
    case REMOVE_LEAGUE:
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
    case ADD_TEAM:
      return [...state, action.teamID]
    case REMOVE_TEAM:
      return state.filter(function(value, index, arr){
        return value != action.teamID;
      });
      return
    default:
      return state;
  }
}
