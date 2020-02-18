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
receiveTodayTeamFixtures, receiveTodayLeagueFixtures,
resetLeagueFetch } from './fixtures'

counter = 0;
today = new Date()
today.setHours(0,0,0,0)
const todayTime = today.getTime()

export function initFutureFixtures(){
  return (dispatch, getState) => {
    Promise.resolve( dispatch( fetchFollowingFutureFixtures()))
  }
}

function shouldFetchFixtures(fetching, lastDate, currentDate){
  if(fetching){
    return false;
  }else if (new Date(parseInt(currentDate)).getTime() >= new Date(parseInt(lastDate)).getTime()) {
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

    dispatch( requestFutureFixtures())
    dispatch( fetchFutureLeagueFixtures(leagueIDs))
    dispatch( fetchFutureTeamFixtures(teamIDs))
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
  return (dispatch, getState) => {
    if(counter == 0){
        current = getState().fixturesStatus['currentFutureDates'].length
        date = getState().futureDates[current];
        dispatch( receiveFutureFixtures(date))
    }
  }
}

export function fetchFutureTeamFixtures(teamIDs){
  return (dispatch, getState) => {
    currentDate = getState().futureDates[getState().fixturesStatus['currentFutureDates'].length];
    teamIDs.map( teamID => {
      team = getState().fixtureIDsByTeamID[teamID];
      if(shouldFetchFixtures(team.fetchingFuture, team.lastFutureDate, currentDate)){
        nextPage = team.nextFuturePage;
        dispatch(requestFutureTeamFixtures(teamID))
        return getFutureTeamFixtures(teamID, nextPage)
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
            dates = Object.keys(processedData[1])
            const index = dates.indexOf("" + todayTime);
            if (index >= 0) {
              dates.splice(index, 1);
            }
            lastDate = dates[dates.length-1];
            dispatch( storeFutureDates(dates))
            dispatch( receiveTodayTeamFixtures(teamID, processedData[2]))
            dispatch( receiveFutureTeamFixtures(teamID, Object.keys(processedData[0]), lastDate));
            counter -= 1;
            dispatch( storeFutureDate());
          }
        })
      }else{
        counter -= 1;
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

export function receiveFutureLeagueFixtures(leagueID, fixtures, lastDate){
  return {
    type: RECEIVE_FUTURE_LEAGUE_FIXTURES,
    leagueID: leagueID,
    fixtures: fixtures,
    date: lastDate,
  }
}

function getNextDate(timeStamp){
  timeStamp = parseInt(timeStamp)
  const tomorrow = new Date(timeStamp);
  tomorrow.setDate(new Date(timeStamp).getDate() + 1)
  tomorrow.setHours(0,0,0,0)
  fetchDate = tomorrow.toISOString().substring(0,10)
  storeDate = tomorrow.getTime();
  return [fetchDate, storeDate];
}


export function fetchFutureLeagueFixtures(leagueIDs, overrideCheck=false){
  return (dispatch, getState) => {
    currentDate = getState().futureDates[getState().fixturesStatus['currentFutureDates'].length];
    leagueIDs.map( leagueID => {
      lastDate = getState().fixtureIDsByLeagueID[leagueID]['lastFutureDate']
      dispatch(fetchLeagueFixtures(leagueID, lastDate, currentDate, overrideCheck));
    });
  }
}

function fetchLeagueFixtures(leagueID, lastDate, currentDate, overrideCheck){
  return (dispatch, getState) => {
    fetching = getState().fixtureIDsByLeagueID['fetching']
    if(overrideCheck || shouldFetchFixtures(fetching, lastDate, currentDate)){
      dates = getNextDate(lastDate);
      fetchDate = dates[0]
      storeDate = dates[1]
      dispatch(requestFutureLeagueFixtures(leagueID))
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
          dispatch( storeFutureDates(Object.keys(processedData[1])))
          dispatch( receiveFutureLeagueFixtures(leagueID, processedData[3], storeDate));
          counter -= 1;
          dispatch( storeFutureDate());
        }else{
          dispatch( resetLeagueFetch());
          dispatch( fetchLeagueFixtures(leagueID, storeDate, currentDate, overrideCheck));
        }
      });
    }else{
      counter -= 1;
      dispatch(storeFutureDate());
    }
  }
}
