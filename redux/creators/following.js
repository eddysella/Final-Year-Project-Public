import {
  FOLLOWING_ADD_LEAGUE,
  FOLLOWING_REMOVE_LEAGUE,
  FOLLOWING_ADD_TEAM,
  FOLLOWING_REMOVE_TEAM,
} from '../types/following'
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
    type: FOLLOWING_ADD_LEAGUE,
    leagueID: leagueID,
  };
}

export function removeLeagueFromFollowing(leagueID){
  return {
    type: FOLLOWING_REMOVE_LEAGUE,
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
    type: FOLLOWING_ADD_TEAM,
    teamID: teamID,
  };
}

export function removeTeamFromFollowing(teamID){
  return {
    type: FOLLOWING_REMOVE_TEAM,
    teamID: teamID,
  };
}
