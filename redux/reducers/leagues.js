import {
  REQUEST_LEAGUE_BY_ID,
  RECEIVE_LEAGUE_BY_ID,
  REQUEST_PAST_LEAGUE_FIXTURES,
  RECEIVE_PAST_LEAGUE_FIXTURES,
  REQUEST_FUTURE_LEAGUE_FIXTURES,
  RECEIVE_FUTURE_LEAGUE_FIXTURES,
  REQUEST_TEAMS_FOR_LEAGUE,
  RECEIVE_TEAMS_FOR_LEAGUE,
  RECEIVE_MULTIPLE_LEAGUES,
} from '../types'

function league(
  state = {
    fetchingLeague: false,
    fetchingFutureFixtures: false,
    fetchingPastFixtures: false,
    fetchingTeams: false,
    leagueID: '',
    name: '',
    countryCode: '',
    logo: '',
    teamIDs: [],
    futureFixtures:[],
    pastFixtures:[],
    nextPastFixturesPage: 1,
    nextFutureFixturesPage: 1,
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
    case REQUEST_PAST_LEAGUE_FIXTURES:
      return Object.assign({}, state, {
        fetchingPastFixtures: true,
      })
    case RECEIVE_PAST_LEAGUE_FIXTURES:
      return Object.assign({}, state, {
        fetchingPastFixtures: false,
        pastFixtures: [...state.pastFixtures, ...action.fixtures],
        nextPastFixturesPage: (state.nextPastFixturesPage+1),
      })
    case REQUEST_FUTURE_LEAGUE_FIXTURES:
      return Object.assign({}, state, {
        fetchingFutureFixtures: true,
      })
    case RECEIVE_FUTURE_LEAGUE_FIXTURES:
      return Object.assign({}, state, {
        fetchingFutureFixtures: false,
        futureFixtures: [...state.futureFixtures, ...action.fixtures],
        nextFutureFixturesPage: (state.nextFutureFixturesPage+1),
      })
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
    case RECEIVE_LEAGUE_BY_ID:
      return Object.assign({}, state, {
        [action.leagueID]: league(state[action.leagueID], action)
        });
    case REQUEST_PAST_LEAGUE_FIXTURES:
    case REQUEST_FUTURE_LEAGUE_FIXTURES:
    case REQUEST_TEAMS_FOR_LEAGUE:
      return Object.assign({}, state, {
        fetching: true,
        [action.leagueID]: league(state[action.leagueID], action)
        });
    case RECEIVE_TEAMS_FOR_LEAGUE:
    case RECEIVE_PAST_LEAGUE_FIXTURES:
    case RECEIVE_FUTURE_LEAGUE_FIXTURES:
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
