import {
  RECEIVE_TODAY_TEAM_FIXTURES,
  RECEIVE_TODAY_LEAGUE_FIXTURES,
  REQUEST_PAST_FIXTURES,
  RECEIVE_PAST_FIXTURES,
  REQUEST_PAST_TEAM_FIXTURES,
  RECEIVE_PAST_TEAM_FIXTURES,
  REQUEST_PAST_LEAGUE_FIXTURES,
  RECEIVE_PAST_LEAGUE_FIXTURES,
} from '../types'
import { getPastLeagueFixtures, getPastTeamFixtures, } from '../../fetch/FixturesV2';
import { processFixtures, storeFixtures } from './processFixtures'

export function receiveTodayTeamFixtures(teamID, fixtures){
  return {
    type: RECEIVE_TODAY_TEAM_FIXTURES,
    teamID: teamID,
    fixtures: fixtures,
  }
}

export function receiveTodayLeagueFixtures(fixtures, leagueID){
  return {
    type: RECEIVE_TODAY_LEAGUE_FIXTURES,
    leagueID: leagueID,
    fixtures: fixtures,
  }
}

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

function shouldFetchFixtures(fixturesPage, entityPage){
  if(fixturesPage > entityPage){
    return true;
  }else{
    return false;
  }
}

export function fetchFollowingPastFixtures(){
  return (dispatch, getState) => {
    fixturesNextPage = getState().fixturesPagination['futureNextPage'];

    teamIDs = getState().followingTeamIDs;
    teamPromises = teamIDs.map( teamID => {
      teamNextPage = getState().teamsByID.teamID['nextFutureFixturesPage'];
      if(shouldFetchFixtures(fixturesNextPage, teamNextPage)){
        getPastTeamFixtures(teamID, teamNextPage)
        .then( data => processFixtures(data))
        .then( processedData => {
          dispatch( storeFixtures(processedData[2]));
          dispatch( receiveTodayTeamFixture(processedData[0], teamID))
          dispatch( receivePastTeamFixtures(processedData[1], teamID));
        });
      }
    });
    leagueIDs = getState().followingLeagueIDs;
    leaguePromises = leagueIDs.map( leagueID => {
      leagueNextPage = getState().leaguesByID.leagueID['nextFutureFixturesPage'];
      if(shouldFetchFixtures(fixturesNextPage, leagueNextPage)){
        getPastLeagueFixtures(leagueID, leagueNextPage)
        .then( data => processFixtures(data))
        .then( processedData => {
          dispatch( storeFixtures(processedData[2]));
          dispatch( receiveTodayLeagueFixture(processedData[0], leagueID))
          dispatch( receivePastLeagueFixtures(processedData[1], leagueID));
        });
      }
    });

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
    fixtures: fixtures,
  }
}

function fetchPastTeamFixtures(teamIDs, fixturesNextPage){
  return (dispatch, getState) => {
    return teamIDs.map( teamID => {
      teamNextPage = getState().teamsByID.teamID['nextPastFixturesPage'];
      requestPastTeamFixtures(teamID)
      return getPastTeamFixtures(teamID, teamNextPage)
      .then( processedData => {
        dispatch( storeFixtures(processedData[2]));
        dispatch( receiveTodayTeamFixture(processedData[0], teamID))
        dispatch( receivePastTeamFixtures(processedData[1], teamID));
      });
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
    fixtures: fixtures,
  }
}

function fetchPastLeagueFixtures(leagueIDs, fixturesNextPage){
  return (dispatch, getState) => {
    return leagueIDs.map( leagueID => {
      leagueNextPage = getState().leaguesByID.leagueID['nextPastFixturesPage'];
      requestPastLeagueFixtures(leagueID)
      return getPastLeagueFixtures(leagueID, leagueNextPage)
      .then( data => processFixtures(data))
      .then( processedData => {
        dispatch( storeFixtures(processedData[2]));
        dispatch( receiveTodayLeagueFixture(processedData[0], leagueID))
        dispatch( receivePastLeagueFixtures(processedData[1], leagueID));
      });
    });
  }
}
