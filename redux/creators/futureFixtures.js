import {
  REQUEST_FUTURE_FIXTURES,
  RECEIVE_FUTURE_LEAGUE_FIXTURES,
  RECEIVE_FUTURE_TEAM_FIXTURES,
} from '../types'
import { getFutureLeagueFixtures, getFutureTeamFixtures, } from '../../fetch/FixturesV2';
import { processFixtures, storeFixtures } from './processFixtures'

export function requestFutureFixtures(){
  return {
    type: REQUEST_FUTURE_FIXTURES,
  }
}

export function receiveFutureFixtures(){
  return {
    type: RECEIVE_FUTURE_FIXTURES,
  }
}

export function fetchFollowingFutureFixtures(){
  return (dispatch, getState) => {
    fixturesCurrentPage = getState().fixturesPagination['futureNextPage'];
    teamIDs = getState().followingTeamIDs;
    teamPromises = fetchFutureTeamFixtures(teamIDs, page);
    leagueIDs = getState().followingLeagueIDs;
    leaguePromises = fetchFutureLeagueFixtures(leagueIDs, page);
    dispatch( requestFutureFixtures())
    return Promise.all([leaguePromises, teamPromises])
    .then( () => dispatch( receiveFutureFixtures()));
  }
}

export function requestFutureTeamFixtures(teamID){
  return {
    type: REQUEST_FUTURE_TEAM_FIXTURES,
    teamID: teamID,
  }
}

export function receiveFutureTeamFixtures(teamID, fixtures){
  return {
    type: RECEIVE_FUTURE_TEAM_FIXTURES,
    teamID: teamID,
    pastFixtures: fixtures,
  }
}

function fetchFutureTeamFixtures(teamIDs, fixturesCurrentPage){
  // idk if reinjection of dispatch works, check this in case it fails
  return (dispatch, getState) => {
    return teamIDs.map( teamID => {
      teamCurrentPage = getState().teamsByID.teamID['nextFutureFixturesPage'];
      if(shouldFetchFixtures(fixturesCurrentPage, teamCurrentPage)){
        requestFutureTeamFixtures(teamID)
        return getFutureTeamFixtures(teamID, page)
        .then( data => processFixtures(data))
        .then( processedData => {
          dispatch( receiveFutureTeamFixtures(processedData[0], teamID)));
          dispatch( storeFixtures(processedData[1]));
        });
      }
    });
  }
}

export function requestFutureLeagueFixtures(leagueID){
  return {
    type: REQUEST_FUTURE_LEAGUE_FIXTURES,
    leagueID: leagueID,
  }
}

export function receiveFutureLeagueFixtures(fixtures, leagueID){
  return {
    type: RECEIVE_FUTURE_LEAGUE_FIXTURES,
    leagueID: leagueID,
    pastFixtures: fixtures,
  }
}

function fetchFutureLeagueFixtures(leagueIDs, fixturesCurrentPage){
  // idk if reinjection of dispatch works, check this in case it fails
  return (dispatch, getState) => {
    return leagueIDs.map( leagueID => {
      leagueCurrentPage = getState().leaguesByID.leagueID['nextFutureFixturesPage'];
      if(shouldFetchFixtures(fixturesCurrentPage, leagueCurrentPage)){
        requestFutureLeagueFixtures(leagueID)
        return getFutureLeagueFixtures(leagueID, page)
        .then( data => processFixtures(data))
        .then( processedData => {
          dispatch( receiveFutureLeagueFixtures(processedData[0], leagueID)));
          dispatch( storeFixtures(processedData[1]));
        });
      }
    });
  }
}
