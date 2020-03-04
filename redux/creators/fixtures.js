import {
  FIXTURES_STORE_BY_ID,
  FIXTURES_STORE_BY_DATE,
  FIXTURES_REQUEST_PAST,
  FIXTURES_RECEIVE_PAST,
  FIXTURES_RECEIVE_TODAY_LEAGUE,
  FIXTURES_RECEIVE_TODAY_TEAM,
  FIXTURES_REQUEST_FUTURE,
  FIXTURES_RECEIVE_FUTURE,
  FIXTURES_INIT_LEAGUE,
  FIXTURES_INIT_TEAM,
  FIXTURES_RESET,
  FIXTURES_SET_LEAGUE_CURRENT_ROUND,
} from '../types/fixtures'

import { fetchPastTeamFixtures, fetchPastLeagueFixtures } from './pastFixtures';
import { fetchFutureTeamFixtures, fetchFutureLeagueFixtures, receiveFutureLeagueFixtures } from './futureFixtures';
import { getFixturesByLeagueAndRound, } from '../../fetch/FixturesV2';
import { getLeagueCurrentRound, } from '../../fetch/League';

export function resetFixtures(){
  return {
    type: FIXTURES_RESET,
  }
}

export function leagueSetCurrentRound(leagueID, round){
  return {
    type: FIXTURES_SET_LEAGUE_CURRENT_ROUND,
    leagueID: leagueID,
    round: round,
  }
}

export function storeFixturesByID(fixtures){
  return {
    type: FIXTURES_STORE_BY_ID,
    fixtures: fixtures,
  }
}

export function storeFixtureIDsByDate(date, league, fixtures){
  return {
    type: FIXTURES_STORE_BY_DATE,
    date: date,
    league: league,
    fixtures: fixtures,
  }
}

export function requestPastFixtures(){
  return {
    type: FIXTURES_REQUEST_PAST,
  }
}

export function receivePastFixtures(date){
  return {
    type: FIXTURES_RECEIVE_PAST,
    date: date,
  }
}

export function requestFutureFixtures(){
  return {
    type: FIXTURES_REQUEST_FUTURE,
  }
}

export function receiveFutureFixtures(date){
  return {
    type: FIXTURES_RECEIVE_FUTURE,
    date: date,
  }
}

export function receiveTodayLeagueFixtures(leagueID, fixtures){
  return {
    type: FIXTURES_RECEIVE_TODAY_LEAGUE,
    leagueID: leagueID,
    fixtures: fixtures,
  }
}

export function receiveTodayTeamFixtures(teamID, fixtures){
  return {
    type: FIXTURES_RECEIVE_TODAY_TEAM,
    teamID: teamID,
    fixtures: fixtures,
  }
}

export function initFixturesForLeague(leagueID){
  return {
    type: FIXTURES_INIT_LEAGUE,
    leagueID: leagueID,
  }
}

export function initFixturesForTeam(teamID){
  return {
    type: FIXTURES_INIT_TEAM,
    teamID: teamID,
  }
}

today = new Date()
today.setHours(0,0,0,0)
const todayTime = today.getTime()

export function initFixtures(){
  return (dispatch, getState) => {
    dispatch(initLeagues())
    dispatch(initTeams())
  }
}

function initLeagues(){
  return (dispatch, getState) => {
    leagueIDs = getState().followingLeagueIDs;
    leagueIDs.map( leagueID => {
      dispatch(initLeague(leagueID))
    })
  }
}

export function initLeague(leagueID){
  return (dispatch, getState) => {
    if(getState().fixtureIDsByLeagueID[leagueID] === undefined){
      dispatch(initFixturesForLeague(leagueID))
      dispatch(fetchPastLeagueFixtures([leagueID]))
      dispatch(fetchFutureLeagueFixtures([leagueID]))
    }
  }
}

function initTeams(){
  return (dispatch, getState) => {
    teamIDs = getState().followingTeamIDs;
    teamIDs.map( teamID => {
      dispatch(initTeam(teamID))
    })
  }
}

export function initTeam(teamID){
  return (dispatch, getState) => {
    if(getState().fixtureIDsByTeamID[teamID] === undefined){
      dispatch(initFixturesForTeam(teamID))
      dispatch(fetchPastTeamFixtures([teamID]))
      dispatch(fetchFutureTeamFixtures([teamID]))
    }
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
    status = processFixtureStatus([
      fixture.statusShort,
      fixture.event_timestamp,
      fixture.goalsHomeTeam,
      fixture.goalsAwayTeam,
      fixture.elapsed
    ])
    fixByID[fixtureID] = {
      id: fixtureID,
      date: timeStamp,
      status: status,
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

/**
 * Processes a set of fixtures for a League.
 * @method processLeagueFixtures
 * @param  {Object} data A parsed JSON Object
 * @return {Array} [
 * 0 : [Object] (fixtureID:data)
 * 1 : [Object] (Date: [Object] (League:fixtureIDs))
 * 2 : [Array] A set of fixture IDs for today
 * 3 : [Object] (Date: [Array] fixtureIDs)
 * ]
 */
export function processLeagueFixtures(data){
  if(data === undefined){
    return ["INVALID"];
  }else if(data.api.results == 0){
    return ["EMPTY"];
  }
  todayIDs=[];
  fixByDateLeague={};
  fixByID={};
  fixByDate={};
  data = data.api;
  fixtures = data.fixtures;

  fixtures.forEach( fixture => {
    date = new Date(fixture.event_timestamp*1000)
    date.setHours(0,0,0,0)
    timeStamp = date.getTime()
    leagueID = fixture.league_id;
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
    status = processFixtureStatus([
      fixture.statusShort,
      fixture.event_timestamp,
      fixture.goalsHomeTeam,
      fixture.goalsAwayTeam,
      fixture.elapsed
    ])
    fixByID[fixtureID] = {
      id: fixtureID,
      date: timeStamp,
      status: status,
      elapsed:fixture.elapsed,
      league: fixture.league,
      homeTeam:fixture.homeTeam,
      awayTeam:fixture.awayTeam,
      goalsHome:String(fixture.goalsHomeTeam),
      goalsAway:String(fixture.goalsAwayTeam),
      statusShort: fixture.statusShort,
    };
  });
  return ["VALID", fixByID, fixByDateLeague, todayIDs, fixByDate];
}
