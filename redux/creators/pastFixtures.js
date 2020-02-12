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

counter = 0;

export function initPastFixtures(){
  return (dispatch, getState) => {
    dispatch(fetchFollowingPastFixtures());
  }
}

function shouldFetchFixtures(lastDate, currentDate){
  if (new Date(currentDate).getTime() <= new Date(lastDate).getTime()) {
    return true;
  }else if(currentDate === undefined){
    return true;
  }else{
    return false;
  }
}

export function storePastDates(dates){
  return {
    type: STORE_PAST_DATES,
    dates: dates,
  }
}

export function fetchFollowingPastFixtures(){
  return (dispatch, getState) => {
    teamIDs = getState().followingTeamIDs;
    leagueIDs = getState().followingLeagueIDs;
    counter = teamIDs.length + leagueIDs.length;
    teamPromises = dispatch(fetchPastTeamFixtures(teamIDs));
    leaguePromises = dispatch(fetchPastLeagueFixtures(leagueIDs));

    dispatch( requestPastFixtures())
    return Promise.all([leaguePromises, teamPromises])
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

function storePastDate(){
  console.log("past")
  return (dispatch, getState) => {
    console.log("counter : " + counter)
    if(counter == 0){
        current = getState().fixturesStatus['currentPastDates'].length
        console.log("len: " + current)
        date = getState().pastDates[current];
        console.log("state: " , getState().pastDates)
        console.log("date: " + date)
        dispatch( receivePastFixtures(date))
    }
  }
}

function fetchPastTeamFixtures(teamIDs){
  return (dispatch, getState) => {
    currentDate = getState().pastDates[getState().fixturesStatus['currentPastDates'].length];
    return teamIDs.map( teamID => {
      counter -= 1;
      lastDate = getState().fixtureIDsByTeamID[teamID]['lastPastDateReceived'];
      if(shouldFetchFixtures(lastDate, currentDate)){
        nextPage = getState().fixtureIDsByTeamID[teamID]['nextPastPage'];
        dispatch(requestPastTeamFixtures(teamID))
        return getPastTeamFixtures(teamID, nextPage)
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
            dispatch( storePastDates(dates))
            dispatch( receiveTodayTeamFixtures(teamID, processedData[2]))
            dispatch( receivePastTeamFixtures(teamID, Object.keys(processedData[0], lastDate)))
            dispatch( storePastDate());
          }
        })
      }else{
        dispatch(storePastDate());
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
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1)
  pieces = yesterday.toLocaleDateString().split('/')
  fetchDate = "" + pieces[2] + '-' + pieces[0] + '-' + pieces[1]
  storeDate = yesterday.toDateString();
  return [fetchDate, storeDate];
}

function fetchPastLeagueFixtures(leagueIDs){
  return (dispatch, getState) => {
    currentDate = getState().pastDates[getState().fixturesStatus['currentPastDates'].length];
    return leagueIDs.map( leagueID => {
      lastDate = getState().fixtureIDsByLeagueID[leagueID]['lastPastDateFetched'];
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
      dispatch(requestPastLeagueFixtures(leagueID))
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
          dispatch( storePastDates(Object.keys(processedData[1])))
          dispatch( receiveTodayLeagueFixtures(leagueID, processedData[2]))
          dispatch( receivePastLeagueFixtures(leagueID, processedData[3], storeDate));
          dispatch( storePastDate());
        }else{
          dispatch( fetchLeagueFixtures(leagueID, storeDate, currentDate));
        }
      });
    }else{
      counter -= 1;
      dispatch(storePastDate());
    }
  }
}
