import {
  REQUEST_PAST_FIXTURES,
  RECEIVE_PAST_FIXTURES,
  STORE_PAST_DATES,
  REQUEST_PAST_TEAM_FIXTURES,
  RECEIVE_PAST_TEAM_FIXTURES,
  REQUEST_PAST_LEAGUE_FIXTURES,
  RECEIVE_PAST_LEAGUE_FIXTURES,
  RESET_PAST_LEAGUE_FETCH,
  LEAGUE_SHOULD_FETCH_PAST_TRUE,
} from '../types'
import { getFixturesByLeagueAndDate, getPastTeamFixtures, } from '../../fetch/FixturesV2';
import { storeFixturesByID, storeFixtureIDsByDate, receivePastFixtures,
  requestPastFixtures, processTeamFixtures, processLeagueFixtures,
receiveTodayTeamFixtures, receiveTodayLeagueFixtures} from './fixtures'

export function resetLeagueFetch(leagueID){
  return {
    type: RESET_PAST_LEAGUE_FETCH,
    leagueID: leagueID,
  }
}

export function setShouldFetchPastTrue(leagueID){
  return {
    type: LEAGUE_SHOULD_FETCH_PAST_TRUE,
    leagueID: leagueID,
  }
}

counter = 0
today = new Date()
today.setHours(0,0,0,0)
const todayTime = today.getTime()

export function initPastFixtures(){
  return (dispatch, getState) => {
    dispatch( fetchFollowingPastFixtures())
  }
}

function shouldFetchFixtures(fetching, lastDate, currentDate){
  console.log("lastDate " + new Date(lastDate).toISOString())
  if(fetching){
    return false;
  }else if (new Date(parseInt(currentDate)).getTime() <= new Date(parseInt(lastDate)).getTime()) {
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

    dispatch( requestPastFixtures())
    dispatch( fetchPastLeagueFixtures(leagueIDs))
    dispatch( fetchPastTeamFixtures(teamIDs))
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
  return (dispatch, getState) => {
    if(counter == 0){
      current = getState().fixturesStatus['currentPastDates'].length
      date = getState().pastDates[current];
      dispatch( receivePastFixtures(date))
    }
  }
}

export function fetchPastTeamFixtures(teamIDs){
  return (dispatch, getState) => {
    currentDate = getState().pastDates[getState().fixturesStatus['currentPastDates'].length];
    teamIDs.map( teamID => {
      team = getState().fixtureIDsByTeamID[teamID]
      if(shouldFetchFixtures(team.fetchingPast, team.lastPastDate, currentDate)){
        nextPage = team.nextPastPage;
        dispatch(requestPastTeamFixtures(teamID))
        return getPastTeamFixtures(teamID, nextPage)
        .then( data => processTeamFixtures(data, nextPage))
        .then( processedData => {
          if(processedData){
            dispatch( storeFixturesByID(processedData[0]));
            // works because objects iterate by order of insertion
            // I receive the fixs in order so technically the last date is last item
            // for teams have to iter over every date cause multiple dates received
            for (date in processedData[1]){
              for (league in processedData[1][date]){
                  dispatch( storeFixtureIDsByDate(date, league, processedData[1][date][league]));
              }
            }
            // might be able to refactor this as remove last elemtnn of dates
            dates = Object.keys(processedData[1])
            const index = dates.indexOf("" + todayTime);
            if (index >= 0) {
              dates.splice(index, 1);
            }
            lastDate = dates[dates.length-1]
            dispatch( storePastDates(dates))
            dispatch( receiveTodayTeamFixtures(teamID, processedData[2]))
            dispatch( receivePastTeamFixtures(teamID, Object.keys(processedData[0]), lastDate))
            counter -= 1;
            dispatch( storePastDate());
          }
        })
      }else{
        counter -= 1;
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

function getNextDate(timeStamp){
  const yesterday = new Date(timeStamp);
  yesterday.setDate(new Date(timeStamp).getDate() - 1)
  yesterday.setHours(0,0,0,0)
  fetchDate = yesterday.toISOString().substring(0,10).trim()
  storeDate = yesterday.getTime();
  return [fetchDate, storeDate];
}

// overrideCheck is used by the league page to continue fetching
export function fetchPastLeagueFixtures(leagueIDs, overrideCheck=false){
  return (dispatch, getState) => {
    currentDate = getState().pastDates[getState().fixturesStatus['currentPastDates'].length];
    leagueIDs.map( leagueID => {
      lastDate = getState().fixtureIDsByLeagueID[leagueID]['lastPastDate']
      dispatch(fetchLeagueFixtures(leagueID, lastDate, currentDate, overrideCheck));
    });
  }
}

function fetchLeagueFixtures(leagueID, lastDate, currentDate, overrideCheck){
  return (dispatch, getState) => {
    fetching = getState().fixtureIDsByLeagueID[leagueID]['fetchingPast']
    // overrideCheck is for the league screen
    if(lastDate >= getState().leaguesByID[leagueID]['seasonStart']){
      if(shouldFetchFixtures(fetching, lastDate, currentDate) || overrideCheck){
        dates = getNextDate(lastDate);
        fetchDate = dates[0]
        storeDate = dates[1]
        dispatch(requestPastLeagueFixtures(leagueID))
        return getFixturesByLeagueAndDate(leagueID, fetchDate)
        .then( data => processLeagueFixtures(data))
        .then( processedData => {
          if(processedData){
            dispatch( storeFixturesByID(processedData[0]));
            for (date in processedData[1]){
              for (league in processedData[1][date]){
                dispatch( storeFixtureIDsByDate(date, league, processedData[1][date][league]));
              }
            }
            dispatch( storePastDates(Object.keys(processedData[1])))
            dispatch( receivePastLeagueFixtures(leagueID, processedData[3], storeDate));
            counter -= 1;
            dispatch( storePastDate());
          }else{
            dispatch( resetLeagueFetch(leagueID));
            dispatch( fetchLeagueFixtures(leagueID, storeDate, currentDate, overrideCheck));
          }
        });
      }else{
        counter -= 1;
        dispatch(storePastDate());
      }
    }
  }
}
