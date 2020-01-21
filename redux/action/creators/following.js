import {
  ADD_LEAGUE_TO_FOLLOWING,
  REMOVE_LEAGUE_FROM_FOLLOWING,
  ADD_TEAM_TO_FOLLOWING,
  REMOVE_TEAM_FROM_FOLLOWING,
} from '../types/types'
import { getStandingsByLeague } from '../../../fetch/Standings';


export function addLeagueToFollowing(leagueID){
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
  return {
    type: ADD_TEAM_TO_FOLLOWING,
    teamID: teamID,
  };
}

export function removeTeamFromFollowing(teamID){
  return {
    type: REMOVE_TEAM _FROM_FOLLOWING,
    teamID: teamID,
  };
}
