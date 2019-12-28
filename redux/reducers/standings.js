import {
  REQUEST_STANDINGS,
  RECEIVE_STANDINGS,
  ADD_LEAGUE_STANDINGS,
  REMOVE_LEAGUE_STANDINGS,
} from '../action/types/types'

export function standingsLeagues(state = [], action){
  switch(action.type){
    case ADD_LEAGUE_STANDINGS:
      return [...state, action.leagueID]
    case REMOVE_LEAGUE_STANDINGS:
      return state.filter(function(value, index, arr){
        return value != action.leagueID;
      });
      return
    default:
      return state;
  }
}

export function specificStandings(
  state = {
    isFetching: false,
    teamNames: [],
    standingsInOrder: [],
  },
  action
  ){
  switch(action.type){
    case REQUEST_STANDINGS:
      return Object.assign({}, state, {
        leagueID: action.leagueID,
        leagueName: action.leagueName,
        isFetching:true,
      })
    case RECEIVE_STANDINGS:
    return Object.assign({
      isFetching: false,
      teamNames: action.teamNames,
      standingsInOrder: action.standingsInOrder,
      lastUpdated: action.receivedAt,
    });
    default:
      return state;
  }
}
