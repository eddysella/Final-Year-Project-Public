import {
  RECEIVE_TODAY_TEAM_FIXTURES,
  RECEIVE_TODAY_LEAGUE_FIXTURES,
  REQUEST_FUTURE_FIXTURES,
  RECEIVE_FUTURE_FIXTURES,
  REQUEST_FUTURE_TEAM_FIXTURES,
  RECEIVE_FUTURE_TEAM_FIXTURES,
  REQUEST_FUTURE_LEAGUE_FIXTURES,
  RECEIVE_FUTURE_LEAGUE_FIXTURES,
} from '../types'
import { getFutureLeagueFixtures, getFutureTeamFixtures, } from '../../fetch/FixturesV2';
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

function shouldFetchFixtures(fixturesPage, entityPage){
  if(fixturesPage >= entityPage){
    return true;
  }else{
    return false;
  }
}

export function fetchFollowingFutureFixtures(){
  return (dispatch, getState) => {
    fixturesNextPage = getState().fixturesPagination['futureNextPage'];

    teamIDs = getState().followingTeamIDs;
    teamPromises = teamIDs.map( teamID => {
      teamNextPage = getState().teamsByID.teamID['nextFutureFixturesPage'];
      if(shouldFetchFixtures(fixturesNextPage, teamNextPage)){
        getFutureTeamFixtures(teamID, teamNextPage)
        .then( data => processFixtures(data, ))
        .then( processedData => {
          dispatch( storeFixtures(processedData[2]));
          dispatch( receiveTodayTeamFixture(processedData[0], teamID))
          dispatch( receiveFutureTeamFixtures(processedData[1], teamID));
        });
      }
    });

    leagueIDs = getState().followingLeagueIDs;
    leaguePromises = leagueIDs.map( leagueID => {
      leagueNextPage = getState().leaguesByID.leagueID['nextFutureFixturesPage'];
      if(shouldFetchFixtures(fixturesNextPage, leagueNextPage)){
        getFutureLeagueFixtures(leagueID, leagueNextPage)
        .then( data => processFixtures(data))
        .then( processedData => {
          dispatch( storeFixtures(processedData[2]));
          dispatch( receiveTodayLeagueFixture(processedData[0], leagueID))
          dispatch( receiveFutureLeagueFixtures(processedData[1], leagueID));
        });
      }
    });

    dispatch( requestFutureFixtures())
    return Promise.all([leaguePromises, teamPromises])
    .then( () => dispatch( receiveFutureFixtures()))
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
    fixtures: fixtures,
  }
}

function fetchFutureTeamFixtures(teamIDs, fixturesNextPage){
  return (dispatch, getState) => {
    return teamIDs.map( teamID => {
      teamNextPage = getState().teamsByID.teamID['nextFutureFixturesPage'];
      if(shouldFetchFixtures(fixturesNextPage, teamNextPage)){
      return getFutureTeamFixtures(teamID, teamNextPage)
      .then( data => processFixtures(data))
      .then( processedData => {
        dispatch( storeFixtures(processedData[2]));
        dispatch( receiveTodayTeamFixture(processedData[0], teamID))
        dispatch( receiveFutureTeamFixtures(processedData[1], teamID));
      });
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
    fixtures: fixtures,
  }
}

function fetchFutureLeagueFixtures(leagueIDs, fixturesNextPage){
  return (dispatch, getState) => {
    return leagueIDs.map( leagueID => {
      leagueNextPage = getState().leaguesByID.leagueID['nextFutureFixturesPage'];
      requestFutureLeagueFixtures(leagueID)
      return getFutureLeagueFixtures(leagueID, teamNextPage)
      .then( data => processFixtures(data))
      .then( processedData => {
        dispatch( storeFixtures(processedData[2]));
        dispatch( receiveTodayLeagueFixture(processedData[0], leagueID))
        dispatch( receiveFutureLeagueFixtures(processedData[1], leagueID));
      });
    });
  }
}
