import {
  LEAGUE_REQUEST_BY_ID,
  LEAGUE_RECEIVE_BY_ID,
  LEAGUE_REQUEST_TEAMS,
  LEAGUE_RECEIVE_TEAMS,
  LEAGUE_RECEIVE_MULTIPLE_LEAGUES,
} from '../types/leagues'

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
    case LEAGUE_REQUEST_BY_ID:
      return Object.assign({}, state, {
        leagueID: action.leagueID,
        fetchingLeague: true,
      })
    case LEAGUE_RECEIVE_BY_ID:
    return Object.assign({}, state, {
      fetchingLeague: false,
      name: action.name,
      countryCode: action.countryCode,
      logo: action.logo,
      seasonStart: action.seasonStart,
      seasonEnd: action.seasonEnd,
    });
    case LEAGUE_REQUEST_TEAMS:
      return Object.assign({}, state, {
        fetchingTeams: true,
      })
    case LEAGUE_RECEIVE_TEAMS:
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
    case LEAGUE_REQUEST_BY_ID:
    case LEAGUE_REQUEST_TEAMS:
      return Object.assign({}, state, {
        fetching: true,
        [action.leagueID]: league(state[action.leagueID], action)
        });
    case LEAGUE_RECEIVE_BY_ID:
    case LEAGUE_RECEIVE_TEAMS:
      return Object.assign({}, state, {
        fetching:false,
        [action.leagueID]: league(state[action.leagueID], action)
        });
    case LEAGUE_RECEIVE_MULTIPLE_LEAGUES:
      return Object.assign({}, state, action.leagues);
    default:
      return state;
  }
}
