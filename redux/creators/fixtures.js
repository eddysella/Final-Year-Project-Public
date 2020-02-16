import {
  STORE_FIXTURES_BY_ID,
  STORE_FIXTURES_BY_DATE,
  REQUEST_PAST_FIXTURES,
  RECEIVE_PAST_FIXTURES,
  RECEIVE_TODAY_LEAGUE_FIXTURES,
  RECEIVE_TODAY_TEAM_FIXTURES,
  REQUEST_FUTURE_FIXTURES,
  RECEIVE_FUTURE_FIXTURES,
  INIT_LEAGUE_FIXTURES,
  INIT_TEAM_FIXTURES,
  RESET_FIXTURES,
} from '../types'

import { fetchFollowingPastFixtures } from './pastFixtures';
import { fetchFollowingFutureFixtures } from './futureFixtures';
import { getFixturesByLeagueAndDate, } from '../../fetch/FixturesV2';

export function resetFixtures(){
  return {
    type: RESET_FIXTURES,
  }
}

export function storeFixturesByID(fixtures){
  return {
    type: STORE_FIXTURES_BY_ID,
    fixtures: fixtures,
  }
}

export function storeFixtureIDsByDate(date, league, fixtures){
  return {
    type: STORE_FIXTURES_BY_DATE,
    date: date,
    league: league,
    fixtures: fixtures,
  }
}

export function requestPastFixtures(){
  return {
    type: REQUEST_PAST_FIXTURES,
  }
}

export function receivePastFixtures(date){
  return {
    type: RECEIVE_PAST_FIXTURES,
    date: date,
  }
}

export function requestFutureFixtures(){
  return {
    type: REQUEST_FUTURE_FIXTURES,
  }
}

export function receiveFutureFixtures(date){
  return {
    type: RECEIVE_FUTURE_FIXTURES,
    date: date,
  }
}

export function receiveTodayLeagueFixtures(leagueID, fixtures){
  return {
    type: RECEIVE_TODAY_LEAGUE_FIXTURES,
    leagueID: leagueID,
    fixtures: fixtures,
  }
}

export function receiveTodayTeamFixtures(teamID, fixtures){
  return {
    type: RECEIVE_TODAY_TEAM_FIXTURES,
    teamID: teamID,
    fixtures: fixtures,
  }
}

export function initFixturesForLeague(leagueID){
  return {
    type: INIT_LEAGUE_FIXTURES,
    leagueID: leagueID,
  }
}

export function initFixturesForTeam(teamID){
  return {
    type: INIT_TEAM_FIXTURES,
    teamID: teamID,
  }
}

function getTodayDates(){
  today = new Date()
  today.setHours(0,0,0,0)
  fetchDate = today.toISOString().substring(0,10).trim()
  storeDate = today.getTime();
  return [fetchDate, storeDate];
}

export function initFixtures(){
  return (dispatch, getState) => {
    dispatch( initLeaguesTeams())
    dates = getTodayDates();
    fetchDate = dates[0]
    storeDate = dates[1]
    getState().followingLeagueIDs.map( leagueID => {
      if(!(getState().fixtureIDsByLeagueID[leagueID].todayFixtures.length)){
        return getFixturesByLeagueAndDate(leagueID, fetchDate)
        .then( data => processLeagueFixtures(data))
        .then( processedData => {
          if( processedData ){
            dispatch( storeFixturesByID(processedData[0]));
            for (date in processedData[1]){
              for (league in processedData[1][date]){
                dispatch( storeFixtureIDsByDate(date, league, processedData[1][date][league]));
              }
            }
            dispatch( receiveTodayLeagueFixtures(leagueID, processedData[2]))
          }
        });
      }
    });
    dispatch( resetFixtures())
  }
}

export function initLeaguesTeams(){
  return (dispatch, getState) => {
    teamIDs = getState().followingTeamIDs;
    teamIDs.map( teamID => {
      dispatch(initFixturesForTeam(teamID))
    })
    leagueIDs = getState().followingLeagueIDs;
    leagueIDs.map( leagueID => {
      dispatch(initFixturesForLeague(leagueID))
    })
  }
}

function processFixtureStatus(data){
  status='';
  if(data[0] == 'NS'){
      var date = new Date(data[1]*1000);
      // Hours part from the timestamp
      var hours = date.getHours();
      // Minutes part from the timestamp
      var minutes = "0" + date.getMinutes();
      // Will display time in 10:30:23 format
      status = hours + ':' + minutes.substr(-2);
  }else if (['HT', 'FT'].includes(data[0])){
      status = String(data[2] + "  " + data[0] + "  " + data[3]);
  }else if (['1H','2H','ET','P'].includes(data[0])){
      status = String(data[2] + "  " + data[4] + "'  " + data[3]);
  }else{
    status = data[0];
  }
  return status
}

today = new Date()
today.setHours(0,0,0,0)
todayTime = today.getTime()

export function processTeamFixtures(data, page){
  todayIDs=[];
  fixByDateLeague={};
  fixByID={};
  data = data.api;
  fixtures = data.fixtures;

  if(!fixtures || data.results == 0){
    return null;
  }else if(page > 1){
    fixtures.splice(0, (20*(page-1)))
  }
  fixtures.forEach( fixture => {
    date = new Date(fixture.event_timestamp*1000)
    date.setHours(0,0,0,0)
    timeStamp = date.getTime()
    leagueID = "" + fixture.league_id;
    fixtureID = fixture.fixture_id;

    if(!(timeStamp in fixByDateLeague)){
      fixByDateLeague[timeStamp] = {}
    }
    if(!(leagueID in fixByDateLeague[timeStamp])){
      fixByDateLeague[timeStamp][leagueID] = []
    }
    if(timeStamp == todayTime){
      todayIDs.push(fixtureID);
    }
    fixByDateLeague[timeStamp][leagueID].push(fixtureID);
    fixByID[fixtureID] = {
      id: fixtureID,
      date: timeStamp,
      status: processFixtureStatus([
        fixture.statusShort,
        fixture.event_timestamp,
        fixture.goalsHomeTeam,
        fixture.goalsAwayTeam,
        fixture.elapsed
      ]),
      elapsed:fixture.elapsed,
      league: fixture.league,
      homeTeam:fixture.homeTeam,
      awayTeam:fixture.awayTeam,
      goalsHome:String(fixture.goalsHomeTeam),
      goalsAway:String(fixture.goalsAwayTeam),
      statusShort: fixture.statusShort,
    };
  });
  return [fixByID, fixByDateLeague, todayIDs];
}

export function processLeagueFixtures(data){
  todayIDs=[];
  fixByDateLeague={};
  fixByID={};
  fixByDate={};
  data = data.api;
  fixtures = data.fixtures;

  if(!fixtures || data.results == 0){
    return null;
  }

  fixtures.forEach( fixture => {
    date = new Date(fixture.event_timestamp*1000)
    date.setHours(0,0,0,0)
    console.log("FETCHEDDATE"+ date)
    timeStamp = date.getTime()
    leagueID = "" + fixture.league_id;
    fixtureID = fixture.fixture_id;

    if(!(timeStamp in fixByDateLeague)){
      fixByDate[timeStamp] = []
      fixByDateLeague[timeStamp] = {}
    }
    if(!(leagueID in fixByDateLeague[timeStamp])){
      fixByDateLeague[timeStamp][leagueID] = []
    }
    if(timeStamp == todayTime){
      todayIDs.push(fixtureID);
    }
    fixByDate[timeStamp].push(fixtureID)
    fixByDateLeague[timeStamp][leagueID].push(fixtureID);
    fixByID[fixtureID] = {
      id: fixtureID,
      date: timeStamp,
      status: processFixtureStatus([
        fixture.statusShort,
        fixture.event_timestamp,
        fixture.goalsHomeTeam,
        fixture.goalsAwayTeam,
        fixture.elapsed
      ]),
      elapsed:fixture.elapsed,
      league: fixture.league,
      homeTeam:fixture.homeTeam,
      awayTeam:fixture.awayTeam,
      goalsHome:String(fixture.goalsHomeTeam),
      goalsAway:String(fixture.goalsAwayTeam),
      statusShort: fixture.statusShort,
    };
  });
  return [fixByID, fixByDateLeague, todayIDs, fixByDate];
}
