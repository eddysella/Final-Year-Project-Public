import {
  REQUEST_FUTURE_FIXTURES,
  RECEIVE_FUTURE_FIXTURES,
  STORE_FUTURE_DATES,
  REQUEST_FUTURE_TEAM_FIXTURES,
  RECEIVE_FUTURE_TEAM_FIXTURES,
  REQUEST_FUTURE_LEAGUE_FIXTURES,
  RECEIVE_FUTURE_LEAGUE_FIXTURES,
} from '../types'
import { getFixturesByLeagueAndDate, getFutureTeamFixtures, } from '../../fetch/FixturesV2';
import { storeFixturesByID, storeFixtureIDsByDate, receiveFutureFixtures,
  requestFutureFixtures, processTeamFixtures, processLeagueFixtures,
receiveTodayTeamFixtures, receiveTodayLeagueFixtures } from './fixtures'

function shouldFetchFixtures(lastDate, currentDate){
  if (new Date(currentDate).getTime() >= new Date(lastDate).getTime()) {
    return true;
  }else{
    return false;
  }
}

export function storeFutureDates(dates){
  return {
    type: STORE_FUTURE_DATES,
    dates: dates
  }
 }

export function fetchFollowingFutureFixtures(){
  return (dispatch, getState) => {
    teamIDs = getState().followingTeamIDs;
    teamPromises = fetchFutureTeamFixtures(teamIDs);
    leagueIDs = getState().followingLeagueIDs;
    leaguePromises = fetchFutureLeagueFixtures(leagueIDs);

    dispatch( requestFutureFixtures())
    return Promise.all([leaguePromises, teamPromises])
    .then( () => {
      current = getState().fixturesStatus['currentFutureDates'].length
      date = getState().futureDates[current];
      dispatch( receiveFutureFixtures(date))
    });
  }
}

export function requestFutureTeamFixtures(teamID){
  return {
    type: REQUEST_FUTURE_TEAM_FIXTURES,
    teamID: teamID,
  }
}

export function receiveFutureTeamFixtures(teamID, fixtures, lastDate){
  return {
    type: RECEIVE_FUTURE_TEAM_FIXTURES,
    teamID: teamID,
    fixtures: fixtures,
    date: lastDate,
  }
}

function fetchFutureTeamFixtures(teamIDs){
  return (dispatch, getState) => {
    currentDate = getState().futureDates[getState().fixturesStatus['currentFutureDates'].length];
    return teamIDs.map( teamID => {
      lastDate = getState().fixturesByTeamID.teamID['lastFutureDateReceived'];
      if(shouldFetchFutureFixtures(lastDate, currentDate)){
        nextPage = getState().fixturesByTeamID.teamID['nextFuturePage'];
        requestFutureTeamFixtures(teamID)
        return getFutureTeamFixtures(teamID, nextPage)
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
          dispatch( storeFutureDates(dates))
          dispatch( receiveTodayTeamFixtures(teamID, processedData[2]))
          dispatch( receiveFutureTeamFixtures(teamID, Object.keys(processedData[0], lastDate)));
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
    fixtures: fixtures,
    date: lastDate,
  }
}

function getNextDate(date){
  const today = new Date(date)
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1)
  fetchDate = tomorrow.toLocaleDateString().split('/').reverse().join('-');
  storeDate = tomorrow.toDateString();
  return [fetchDate, storeDate];
}

function fetchFutureLeagueFixtures(leagueIDs, fixturesNextPage){
  return (dispatch, getState) => {
    currentDate = getState().futureDates[getState().fixturesStatus['currentFutureDates'].length];
    return leagueIDs.map( leagueID => {
      lastDate = getState().leaguesByID.leagueID['lastFutureDateFetched'];
      if(shouldFetchFutureFixtures(lastDate, currentDate)){
        dates = getNextDate(lastDate);
        fetchDate = dates[0]
        storeDate = dates[1]
        requestFutureLeagueFixtures(leagueID)
        return getFixturesByLeagueAndDate(leagueID, fetchDate)
        .then( data => processLeagueFixtures(data)))
        .then( processedData => {
          dispatch( storeFixturesByID(processedData[0]));
          // there should only be one date in processedData[1] so no need to iter
          dispatch( storeFixtureIDsByDate(storeDate, processedData[1][storeDate]));
          dispatch( storeFutureDates(Object.keys(processedData[1])))
          dispatch( receiveTodayLeagueFixtures(leagueID, processedData[2]))
          dispatch( receiveFutureLeagueFixtures(leagueID, processedData[3], storeDate)));
        });
      }
    });
  }
}
