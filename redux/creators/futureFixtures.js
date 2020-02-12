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

counter = 0;

export function initFutureFixtures(){
  return (dispatch, getState) => {
    dispatch(fetchFollowingFutureFixtures());
  }
}

function shouldFetchFixtures(lastDate, currentDate){
  if (new Date(currentDate).getTime() >= new Date(lastDate).getTime()) {
    return true;
  }else if(currentDate === undefined){
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
    leagueIDs = getState().followingLeagueIDs;
    counter = teamIDs.length + leagueIDs.length;
    teamPromises = dispatch(fetchFutureTeamFixtures(teamIDs));
    leaguePromises = dispatch(fetchFutureLeagueFixtures(leagueIDs));

    dispatch( requestFutureFixtures())
    return Promise.all([leaguePromises, teamPromises])
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

function storeFutureDate(){
  console.log("future")
  return (dispatch, getState) => {
    console.log("counter : " + counter)
    if(counter == 0){
        current = getState().fixturesStatus['currentFutureDates'].length
        console.log("len: " + current)
        date = getState().futureDates[current];
        console.log("state: " , getState().futureDates)
        console.log("date: " + date)
        dispatch( receiveFutureFixtures(date))
    }
  }
}

function fetchFutureTeamFixtures(teamIDs){
  return (dispatch, getState) => {
    currentDate = getState().futureDates[getState().fixturesStatus['currentFutureDates'].length];
    return teamIDs.map( teamID => {
      counter -= 1;
      lastDate = getState().fixtureIDsByTeamID[teamID]['lastFutureDateReceived'];
      if(shouldFetchFixtures(lastDate, currentDate)){
        nextPage = getState().fixtureIDsByTeamID[teamID]['nextFuturePage'];
        dispatch(requestFutureTeamFixtures(teamID))
        return getFutureTeamFixtures(teamID, nextPage)
        .then( data => processTeamFixtures(data, nextPage))
        .then( processedData => {
          if(processedData){
            dispatch( storeFixturesByID(processedData[0]));
            // works because objects iterate by order of insertion
            // I receive the fixs in order so technically the last date is last item
            dates = Object.keys(processedData[1])
            lastDate = dates[dates.length-1];
            // for teams have to iter over every date cause multiple dates received
            for (date in processedData[1]){
              for (league in processedData[1][date]){
                  dispatch( storeFixtureIDsByDate(date, league, processedData[1][date][league]));
              }
            }
            dispatch( storeFutureDates(dates))
            dispatch( receiveTodayTeamFixtures(teamID, processedData[2]))
            dispatch( receiveFutureTeamFixtures(teamID, Object.keys(processedData[0], lastDate)));
            dispatch( storeFutureDate());
          }
        })
      }else{
        dispatch(storeFutureDate());
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

export function receiveFutureLeagueFixtures(fixtures, leagueID, lastDate){
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
  pieces = tomorrow.toLocaleDateString().split('/')
  fetchDate = "" + pieces[2] + '-' + pieces[0] + '-' + pieces[1]
  storeDate = tomorrow.toDateString();
  return [fetchDate, storeDate];
}

function fetchFutureLeagueFixtures(leagueIDs){
  return (dispatch, getState) => {
    currentDate = getState().futureDates[getState().fixturesStatus['currentFutureDates'].length];
    return leagueIDs.map( leagueID => {
      lastDate = getState().fixtureIDsByLeagueID[leagueID]['lastFutureDateFetched'];
      dispatch(fetchLeagueFixtures(leagueID, lastDate, currentDate));
    });
  }
}

function fetchLeagueFixtures(leagueID, lastDate, currentDate){
  return (dispatch, getState) => {
    if(shouldFetchFixtures(lastDate, currentDate)){
      dates = getNextDate(lastDate);
      fetchDate = dates[0]
      storeDate = dates[1]
      dispatch(requestFutureLeagueFixtures(leagueID))
      return getFixturesByLeagueAndDate(leagueID, fetchDate)
      .then( data => processLeagueFixtures(data))
      .then( processedData => {
        if(processedData){
          counter -= 1;
          dispatch( storeFixturesByID(processedData[0]));
          for (date in processedData[1]){
            for (league in processedData[1][date]){
                dispatch( storeFixtureIDsByDate(date, league, processedData[1][date][league]));
            }
          }
          dispatch( storeFutureDates(Object.keys(processedData[1])))
          dispatch( receiveTodayLeagueFixtures(leagueID, processedData[2]))
          dispatch( receiveFutureLeagueFixtures(leagueID, processedData[3], storeDate));
          dispatch( storeFutureDate());
        }else{
          dispatch( fetchLeagueFixtures(leagueID, storeDate, currentDate));
        }
      });
    }else{
      counter -= 1;
      dispatch(storeFutureDate());
    }
  }
}
