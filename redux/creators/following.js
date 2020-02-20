import {
  FOLLOWING_ADD_LEAGUE,
  FOLLOWING_REMOVE_LEAGUE,
  FOLLOWING_ADD_TEAM,
  FOLLOWING_REMOVE_TEAM,
} from '../types/following'
import { initLeague,} from './fixtures'
import { fetchTeams, } from './teams'

/*
initLeague is here because theres no next function for it to be sent from
 */
export function addLeagueToFollowing(leagueID){
  return dispatch => {
    dispatch(addLeague(leagueID))
    dispatch(initLeague(leagueID))
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

/*
initeam is in fetchTeams because they need to have th eleagues fetched before the
fixtuers can be initialized.
 */
export function addTeamToFollowing(teamID){
  return dispatch => {
    dispatch(addTeam(teamID))
    dispatch(fetchTeams([teamID]))
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
