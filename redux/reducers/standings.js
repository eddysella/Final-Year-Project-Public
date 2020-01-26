import {
  REQUEST_STANDINGS,
  RECEIVE_STANDINGS,
  ADD_LEAGUE_STANDINGS,
  REMOVE_LEAGUE_STANDINGS,
} from '../types'

export function standingsLeagueIDs(state = [], action){
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

export function standingsSpecific(
  state = {
    isFetching: false,
    leagueID: "",
    titles:[
      "Rank",
      " ",
      " ",
      "Games",
      "S/C",
      "GoalD",
      "Points"
    ],
    standingsInOrder: [],
  },
  action
  ){
  switch(action.type){
    case REQUEST_STANDINGS:
    // state is not included in the sources to reset it every time a new
    // standings is fetched
      return Object.assign({}, {
        leagueID: action.leagueID,
        isFetching:true,
        standingsInOrder:[],
      })
    case RECEIVE_STANDINGS:
    return Object.assign({}, state, {
      isFetching: false,
      standingsInOrder: action.standingsInOrder,
      lastUpdated: action.receivedAt,
    });
    default:
      return state;
  }
}
