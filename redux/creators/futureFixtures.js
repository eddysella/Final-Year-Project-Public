import {
  FIXTURES_REQUEST_FUTURE,
  FIXTURES_RECEIVE_FUTURE,
  FIXTURES_STORE_FUTURE_DATES,
  FIXTURES_REQUEST_FUTURE_TEAM,
  FIXTURES_RECEIVE_FUTURE_TEAM,
  FIXTURES_REQUEST_FUTURE_LEAGUE,
  FIXTURES_RECEIVE_FUTURE_LEAGUE,
  FIXTURES_RESET_FUTURE_LEAGUE_FETCH,
  FIXTURES_SET_SHOULD_FETCH_FUTURE_LEAGUE_TRUE,
} from '../types/fixtures'
import { getFixturesByLeagueAndDate, getFutureTeamFixtures, } from '../../fetch/FixturesV2';
import { storeFixturesByID, storeFixtureIDsByDate, receiveFutureFixtures,
  requestFutureFixtures, processTeamFixtures, processLeagueFixtures,
receiveTodayTeamFixtures, receiveTodayLeagueFixtures} from './fixtures'

export function resetLeagueFetch(leagueID){
  return {
    type: FIXTURES_RESET_FUTURE_LEAGUE_FETCH,
    leagueID: leagueID,
  }
}

export function setShouldFetchFutureTrue(leagueID){
  return {
    type: FIXTURES_SET_SHOULD_FETCH_FUTURE_LEAGUE_TRUE,
    leagueID: leagueID,
  }
}

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
    type: FIXTURES_STORE_FUTURE_DATES,
    dates: dates
  }
}

export function fetchFollowingFutureFixtures(){
  return (dispatch, getState) => {
    teamIDs = getState().followingTeamIDs;
    leagueIDs = getState().followingLeagueIDs;
    counter = teamIDs.length + leagueIDs.length;
    // if any teams are followed, otherwise loads infinitely
    if(counter){
      dispatch( requestFutureFixtures())
      dispatch( fetchFutureLeagueFixtures(leagueIDs))
      dispatch( fetchFutureTeamFixtures(teamIDs))
    }
  }
}

export function requestFutureTeamFixtures(teamID){
  return {
    type: FIXTURES_REQUEST_FUTURE_TEAM,
    teamID: teamID,
  }
}

export function receiveFutureTeamFixtures(teamID, fixtures, lastDate){
  return {
    type: FIXTURES_RECEIVE_FUTURE_TEAM,
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

export function fetchFutureTeamFixtures(teamIDs, overrideCheck = false){
  return (dispatch, getState) => {
    currentDate = getState().futureDates[getState().fixturesStatus['currentFutureDates'].length];
    teamIDs.map( teamID => {
      team = getState().fixtureIDsByTeamID[teamID];
      if(shouldFetchFixtures(team.fetchingFuture, team.lastFutureDate, currentDate) || overrideCheck){
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
    type: FIXTURES_REQUEST_FUTURE_LEAGUE,
    leagueID: leagueID,
  }
}

export function receiveFutureLeagueFixtures(leagueID, fixtures, lastDate){
  return {
    type: FIXTURES_RECEIVE_FUTURE_LEAGUE,
    leagueID: leagueID,
    fixtures: fixtures,
    date: lastDate,
  }
}

function getNextDate(timeStamp){
  const tomorrow = new Date(timeStamp);
  tomorrow.setDate(new Date(timeStamp).getDate() + 1)
  tomorrow.setHours(0,0,0,0)
  fetchDate = tomorrow.toISOString().substring(0,10)
  return [fetchDate, tomorrow.getTime()];
}


export function fetchFutureLeagueFixtures(leagueIDs, overrideCheck=false){
  return (dispatch, getState) => {
    currentDate = getState().futureDates[getState().fixturesStatus['currentFutureDates'].length];
    leagueIDs.map( leagueID => {
      lastDate = getState().fixtureIDsByLeagueID[leagueID]['lastFutureDate']
      seasonEnd = getState().leaguesByID[leagueID]['seasonEnd']
      dispatch(fetchLeagueFixtures(leagueID, lastDate, currentDate, seasonEnd, overrideCheck));
    });
  }
}

function fetchLeagueFixtures(leagueID, lastDate, currentDate, seasonEnd, overrideCheck){
  return (dispatch, getState) => {
    fetching = getState().fixtureIDsByLeagueID[leagueID]['fetchingFuture']
    if(lastDate <= seasonEnd){
      if(shouldFetchFixtures(fetching, lastDate, currentDate) || overrideCheck){
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
            if(storeDate == todayTime){
              dispatch( receiveTodayLeagueFixtures(leagueID, processedData[2]))
              dispatch( receiveFutureLeagueFixtures(leagueID, {}, storeDate));
            }else{
              dispatch( storeFutureDates(Object.keys(processedData[1])))
              dispatch( receiveFutureLeagueFixtures(leagueID, processedData[3], storeDate));
            }
            counter -= 1;
            dispatch( storeFutureDate());
          }else{
            dispatch( resetLeagueFetch(leagueID));
            dispatch( fetchLeagueFixtures(leagueID, storeDate, currentDate, seasonEnd, overrideCheck));
          }
        });
      }else{
        counter -= 1;
        dispatch(storeFutureDate());
      }
    }
  }
}
