import {
  FIXTURES_REQUEST_PAST,
  FIXTURES_RECEIVE_PAST,
  FIXTURES_STORE_PAST_DATES,
  FIXTURES_REQUEST_PAST_TEAM,
  FIXTURES_RECEIVE_PAST_TEAM,
  FIXTURES_REQUEST_PAST_LEAGUE,
  FIXTURES_RECEIVE_PAST_LEAGUE,
  FIXTURES_RESET_PAST_LEAGUE_FETCH,
  FIXTURES_SET_SHOULD_FETCH_PAST_LEAGUE_TRUE,
} from '../types/fixtures'
import { getFixturesByLeagueAndDate, getPastTeamFixtures, } from '../../fetch/FixturesV2';
import { storeFixturesByID, storeFixtureIDsByDate, receivePastFixtures,
  requestPastFixtures, processTeamFixtures, processLeagueFixtures,
receiveTodayTeamFixtures, receiveTodayLeagueFixtures} from './fixtures'

export function resetLeagueFetch(leagueID){
  return {
    type: FIXTURES_RESET_PAST_LEAGUE_FETCH,
    leagueID: leagueID,
  }
}

export function setShouldFetchPastTrue(leagueID){
  return {
    type: FIXTURES_SET_SHOULD_FETCH_PAST_LEAGUE_TRUE,
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
    type: FIXTURES_STORE_PAST_DATES,
    dates: dates,
  }
}

export function fetchFollowingPastFixtures(){
  return (dispatch, getState) => {
    teamIDs = getState().followingTeamIDs;
    leagueIDs = getState().followingLeagueIDs;
    counter = teamIDs.length + leagueIDs.length;

    if(counter){
      dispatch( requestPastFixtures())
      dispatch( fetchPastLeagueFixtures(leagueIDs))
      dispatch( fetchPastTeamFixtures(teamIDs))
    }
  }
}

export function requestPastTeamFixtures(teamID){
  return {
    type: FIXTURES_REQUEST_PAST_TEAM,
    teamID: teamID,
  }
}

export function receivePastTeamFixtures(teamID, fixtures, lastDate){
  return {
    type: FIXTURES_RECEIVE_PAST_TEAM,
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

export function fetchPastTeamFixtures(teamIDs, overrideCheck = false){
  return (dispatch, getState) => {
    currentDate = getState().pastDates[getState().fixturesStatus['currentPastDates'].length];
    teamIDs.map( teamID => {
      team = getState().fixtureIDsByTeamID[teamID]
      if(shouldFetchFixtures(team.fetchingPast, team.lastPastDate, currentDate) || overrideCheck){
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
    type: FIXTURES_REQUEST_PAST_LEAGUE,
    leagueID: leagueID,
  }
}

export function receivePastLeagueFixtures(leagueID, fixtures,  lastDate){
  return {
    type: FIXTURES_RECEIVE_PAST_LEAGUE,
    leagueID: leagueID,
    fixtures: fixtures,
    date: lastDate,
  }
}

function getNextDate(timeStamp){
  const yesterday = new Date(timeStamp);
  yesterday.setDate(new Date(timeStamp).getDate() - 1)
  yesterday.setHours(0,0,0,0)
  fetchDate = yesterday.toISOString().substring(0,10)
  return [fetchDate, yesterday.getTime()];
}

// overrideCheck is used by the league page to continue fetching
export function fetchPastLeagueFixtures(leagueIDs, overrideCheck=false){
  return (dispatch, getState) => {
    currentDate = getState().pastDates[getState().fixturesStatus['currentPastDates'].length];
    leagueIDs.map( leagueID => {
      lastDate = getState().fixtureIDsByLeagueID[leagueID]['lastPastDate']
      seasonStart = getState().leaguesByID[leagueID]['seasonStart']
      dispatch(fetchLeagueFixtures(leagueID, lastDate, currentDate, seasonStart, overrideCheck));
    });
  }
}

function fetchLeagueFixtures(leagueID, lastDate, currentDate, seasonStart, overrideCheck){
  return (dispatch, getState) => {
    fetching = getState().fixtureIDsByLeagueID[leagueID]['fetchingPast']
    // overrideCheck is for the league screen
    if(lastDate >= seasonStart){
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
            if(storeDate == todayTime){
              dispatch( receiveTodayLeagueFixtures(leagueID, processedData[2]))
              dispatch( receivePastLeagueFixtures(leagueID, {}, storeDate));
            }else{
              dispatch( storePastDates(Object.keys(processedData[1])))
              dispatch( receivePastLeagueFixtures(leagueID, processedData[3], storeDate));
            }
            counter -= 1;
            dispatch( storePastDate());
          }else{
            dispatch( resetLeagueFetch(leagueID));
            dispatch( fetchLeagueFixtures(leagueID, storeDate, currentDate, seasonStart, overrideCheck));
          }
        });
      }else{
        counter -= 1;
        dispatch(storePastDate());
      }
    }
  }
}
