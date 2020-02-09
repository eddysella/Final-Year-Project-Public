import {
  REQUEST_PAST_FIXTURES,
  RECEIVE_PAST_FIXTURES,
  STORE_PAST_DATES,
  REQUEST_PAST_TEAM_FIXTURES,
  RECEIVE_PAST_TEAM_FIXTURES,
  REQUEST_PAST_LEAGUE_FIXTURES,
  RECEIVE_PAST_LEAGUE_FIXTURES,
} from '../types'
import { getFixturesByLeagueAndDate, getPastTeamFixtures, } from '../../fetch/FixturesV2';
import { storeFixturesByID, storeFixtureIDsByDate, receivePastFixtures,
  requestPastFixtures, processTeamFixtures, processLeagueFixtures,
receiveTodayTeamFixtures, receiveTodayLeagueFixtures } from './fixtures'

function shouldFetchFixtures(lastDate, currentDate){
  if (new Date(currentDate).getTime() <= new Date(lastDate).getTime()) {
    return true;
  }else{
    return false;
  }
}

export function storePastDates(dates){
  return {
    type: STORE_PAST_DATES,
    dates: dates
  }
}

export function fetchFollowingPastFixtures(){
  return (dispatch, getState) => {
    teamIDs = getState().followingTeamIDs;
    teamPromises = fetchPastTeamFixtures(teamIDs);
    leagueIDs = getState().followingLeagueIDs;
    leaguePromises = fetchPastLeagueFixtures(leagueIDs);

    dispatch( requestPastFixtures())
    return Promise.all([leaguePromises, teamPromises])
    .then( () => {
      current = getState().fixturesStatus['currentPastDates'].length
      date = getState().pastDates[current];
      dispatch( receivePastFixtures(date))
    });
  }
}

export function requestPastTeamFixtures(teamID){
  return {
    type: REQUEST_PAST_TEAM_FIXTURES,
    teamID: teamID,
  }
}

export function receivePastTeamFixtures(teamID, fixtures, lastDate){
  return {
    type: RECEIVE_PAST_TEAM_FIXTURES,
    teamID: teamID,
    fixtures: fixtures,
    date: lastDate,
  }
}

function fetchPastTeamFixtures(teamIDs){
  return (dispatch, getState) => {
    currentDate = getState().pastDates[getState().fixturesStatus['currentPastDates'].length];
    return teamIDs.map( teamID => {
      lastDate = getState().fixturesByTeamID.teamID['lastPastDateReceived'];
      if(shouldFetchPastFixtures(lastDate, currentDate)){
        nextPage = getState().fixturesByTeamID.teamID['nextPastPage'];
        requestPastTeamFixtures(teamID)
        return getPastTeamFixtures(teamID, nextPage)
        .then( data => processTeamFixtures(data, nextPage))
        .then( processedData => {
          dispatch( storeFixturesByID(processedData[0]));
          // works because objects iterate by order of insertion
          // I receive the fixs in order so technically the last date is last item
          dates = Object.keys(processedData[1])
          lastDate = dates[dates.length-1];
          // for teams have to iter over every date cause multiple dates received
          for (date in processedData[1]){
              dispatch( storeFixtureIDsByDate(date, processedData[1][date]));
          }
          dispatch( storePastDates(dates))
          dispatch( receiveTodayTeamFixtures(teamID, processedData[2]))
          dispatch( receivePastTeamFixtures(teamID, Object.keys(processedData[0], lastDate)));
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

export function receivePastLeagueFixtures(leagueID, fixtures,  lastDate){
  return {
    type: RECEIVE_PAST_LEAGUE_FIXTURES,
    leagueID: leagueID,
    fixtures: fixtures,
    date: lastDate,
  }
}

function getNextDate(date){
  const today = new Date(date)
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() - 1)
  fetchDate = tomorrow.toLocaleDateString().split('/').reverse().join('-');
  storeDate = tomorrow.toDateString();
  return [fetchDate, storeDate];
}

function fetchPastLeagueFixtures(leagueIDs, fixturesNextPage){
  return (dispatch, getState) => {
    currentDate = getState().pastDates[getState().fixturesStatus['currentPastDates'].length];
    return leagueIDs.map( leagueID => {
      lastDate = getState().leaguesByID.leagueID['lastPastDateFetched'];
      if(shouldFetchPastFixtures(lastDate, currentDate)){
        dates = getNextDate(lastDate);
        fetchDate = dates[0]
        storeDate = dates[1]
        requestPastLeagueFixtures(leagueID)
        return getFixturesByLeagueAndDate(leagueID, fetchDate)
        .then( data => processLeagueFixtures(data)))
        .then( processedData => {
          dispatch( storeFixturesByID(processedData[0]));
          // there should only be one date in processedData[1] so no need to iter
          dispatch( storeFixtureIDsByDate(storeDate, processedData[1][storeDate]));
          dispatch( storePastDates(Object.keys(processedData[1])))
          dispatch( receiveTodayLeagueFixtures(leagueID, processedData[2]))
          dispatch( receivePastLeagueFixtures(leagueID, processedData[3], storeDate)));
        });
      }
    });
  }
}
