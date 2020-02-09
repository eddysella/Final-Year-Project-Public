import {
  REQUEST_LEAGUE_BY_ID,
  RECEIVE_LEAGUE_BY_ID,
  REQUEST_TEAMS_FOR_LEAGUE,
  RECEIVE_TEAMS_FOR_LEAGUE,
  RECEIVE_MULTIPLE_LEAGUES,
} from '../types'

function league(
  state = {
    fetchingLeague: false,
    fetchingTeams: false,
    leagueID: '',
    name: '',
    countryCode: '',
    logo: '',
    teamIDs: [],
  },
  action
  ){
  switch(action.type){
    case REQUEST_LEAGUE_BY_ID:
      return Object.assign({}, state, {
        leagueID: action.leagueID,
        fetchingLeague: true,
      })
    case RECEIVE_LEAGUE_BY_ID:
    return Object.assign({}, state, {
      fetchingLeague: false,
      name: action.leagueName,
      countryCode: action.countryCode,
      logo: action.logo,
    });
    case REQUEST_TEAMS_FOR_LEAGUE:
      return Object.assign({}, state, {
        fetchingTeams: true,
      })
    case RECEIVE_TEAMS_FOR_LEAGUE:
      return Object.assign({}, state, {
        fetchingTeams: false,
        teamIDs: action.teamIDs,
      })
    default:
      return state;
  }
}

export function leaguesByID(state={
  fetching:false,
}, action){
  switch(action.type){
    case REQUEST_LEAGUE_BY_ID:
    case REQUEST_TEAMS_FOR_LEAGUE:
      return Object.assign({}, state, {
        fetching: true,
        [action.leagueID]: league(state[action.leagueID], action)
        });
    case RECEIVE_LEAGUE_BY_ID:
    case RECEIVE_TEAMS_FOR_LEAGUE:
      return Object.assign({}, state, {
        fetching:false,
        [action.leagueID]: league(state[action.leagueID], action)
        });
    case RECEIVE_MULTIPLE_LEAGUES:
      return Object.assign({}, state, action.leagues);
    default:
      return state;
  }
}
