import {
  REQUEST_PAST_FIXTURES,
  RECEIVE_PAST_LEAGUE_FIXTURES,
  RECEIVE_PAST_TEAM_FIXTURES,
} from '../types'
import { getPastLeagueFixtures, getPastTeamFixtures, } from '../../fetch/FixturesV2';
import { processFixtures, storeFixtures } from './processFixtures'

export function requestPastFixtures(){
  return {
    type: REQUEST_PAST_FIXTURES,
  }
}

export function receivePastFixtures(){
  return {
    type: RECEIVE_PAST_FIXTURES,
  }
}

export function fetchFollowingPastFixtures(){
  return (dispatch, getState) => {
    fixturesCurrentPage = getState().fixturesPagination['futureNextPage'];
    teamIDs = getState().followingTeamIDs;
    teamPromises = fetchPastTeamFixtures(teamIDs, page);
    leagueIDs = getState().followingLeagueIDs;
    leaguePromises = fetchPastLeagueFixtures(leagueIDs, page);
    dispatch( requestPastFixtures())
    return Promise.all([leaguePromises, teamPromises])
    .then( () => dispatch( receivePastFixtures()));
  }
}

export function requestPastTeamFixtures(teamID){
  return {
    type: REQUEST_PAST_TEAM_FIXTURES,
    teamID: teamID,
  }
}

export function receivePastTeamFixtures(teamID, fixtures){
  return {
    type: RECEIVE_PAST_TEAM_FIXTURES,
    teamID: teamID,
    pastFixtures: fixtures,
  }
}

function fetchPastTeamFixtures(teamIDs, fixturesCurrentPage){
  // idk if reinjection of dispatch works, check this in case it fails
  return (dispatch, getState) => {
    return teamIDs.map( teamID => {
      teamCurrentPage = getState().teamsByID.teamID['nextPastFixturesPage'];
      if(shouldFetchFixtures(fixturesCurrentPage, teamCurrentPage)){
        requestPastTeamFixtures(teamID)
        return getPastTeamFixtures(teamID, page)
        .then( data => processFixtures(data))
        .then( processedData => {
          dispatch( receivePastTeamFixtures(processedData[0], teamID)));
          dispatch( storeFixtures(processedData[1]));
        });
      }
    });
  }
}

export function requestPastLeagueFixtures(leagueID){
  return {
    type: REQUEST_PAST_LEAGUE_FIXTURES,
    leagueID: leagueID,
  }
}

export function receivePastLeagueFixtures(fixtures, leagueID){
  return {
    type: RECEIVE_PAST_LEAGUE_FIXTURES,
    leagueID: leagueID,
    pastFixtures: fixtures,
  }
}

function fetchPastLeagueFixtures(leagueIDs, fixturesCurrentPage){
  // idk if reinjection of dispatch works, check this in case it fails
  return (dispatch, getState) => {
    return leagueIDs.map( leagueID => {
      leagueCurrentPage = getState().leaguesByID.leagueID['nextPastFixturesPage'];
      if(shouldFetchFixtures(fixturesCurrentPage, leagueCurrentPage)){
        requestPastLeagueFixtures(leagueID)
        return getPastLeagueFixtures(leagueID, page)
        .then( data => processFixtures(data))
        .then( processedData => {
          dispatch( receivePastLeagueFixtures(processedData[0], leagueID)));
          dispatch( storeFixtures(processedData[1]));
        });
      }
    });
  }
}
