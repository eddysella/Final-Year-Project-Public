import {
  ADD_LEAGUE_TO_FOLLOWING,
  REMOVE_LEAGUE_FROM_FOLLOWING,
  ADD_TEAM_TO_FOLLOWING,
  REMOVE_TEAM_FROM_FOLLOWING,
} from '../types'
import { initFixtures,} from './fixtures'
import { fetchTeams, } from './teams'


export function addLeagueToFollowing(leagueID){
  return dispatch => {
    dispatch(addLeague(leagueID))
    dispatch(initFixtures())
  }
}

function addLeague(leagueID){
  return {
    type: ADD_LEAGUE_TO_FOLLOWING,
    leagueID: leagueID,
  };
}

export function removeLeagueFromFollowing(leagueID){
  return {
    type: REMOVE_LEAGUE_FROM_FOLLOWING,
    leagueID: leagueID,
  };
}

export function addTeamToFollowing(teamID){
  return dispatch => {
    dispatch(addTeam([teamID]))
    dispatch(fetchTeams([teamID]))
    dispatch(initFixtures())
  }
}

function addTeam(teamID){
  return {
    type: ADD_TEAM_TO_FOLLOWING,
    teamID: teamID,
  };
}

export function removeTeamFromFollowing(teamID){
  return {
    type: REMOVE_TEAM_FROM_FOLLOWING,
    teamID: teamID,
  };
}
