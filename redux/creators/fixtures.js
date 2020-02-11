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
} from '../types'

import { initPastFixtures } from './pastFixtures';
import { initFutureFixtures } from './futureFixtures';

export function storeFixturesByID(fixtures){
  return {
    type: STORE_FIXTURES_BY_ID,
    fixtures: fixtures,
  }
}

export function storeFixtureIDsByDate(date, fixtures){
  return {
    type: STORE_FIXTURES_BY_DATE,
    date: date,
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

export function initFixtures(){
  return (dispatch, getState) => {
    teamIDs = getState().followingTeamIDs;
    initTeam = teamIDs.map( teamID => {
      dispatch(initFixturesForTeam(teamID))
    })
    leagueIDs = getState().followingLeagueIDs;
    initLeague = leagueIDs.map( leagueID => {
      dispatch(initFixturesForLeague(leagueID))
    })

    Promise.all([initTeam, initLeague])
    .then(() => dispatch( initPastFixtures()))
    // .then(() => dispatch(initFutureFixtures()));
  }
}

//
// function todayTimeStamp(){
//   start = new Date();
//   start.setHours(0,0,0,0);
//   dayStart = start.toUTCString();
//
//   end = new Date(start.getTime());
//   end.setHours(23,59,59,999);
//   dayEnd = end.toUTCString();
// }

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
    return[{},{},[]]
  }else if(page > 1){
    fixtures.splice(0, (20*(page-1)))
  }

  fixtures.forEach( fixture => {
    date = new Date(fixture.timeStamp*1000).toDateString();
    leagueID = fixture.league_id;

    if(!(date in fixByDateLeague)){
      fixByDateLeague[date] = {}
    }
    if(!(leagueID in fixByDateLeague[date])){
      fixByDateLeague[date][leagueID] = []
    }
    if(date == today){
      todayIDs.push(fixture.fixture_id);
    }else{
      fixByDateLeague[date][leagueID].push(fixture.fixture_id);
    }
    fixByID[fixture.fixture_id].push({
      id: fixture_id,
      date: date,
      timeStamp: fixture.event_timestamp,
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
    });
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
    date = new Date(fixture.timeStamp*1000).toDateString();
    leagueID = fixture.league_id;
    fixtureID = fixture.fixture_id;

    if(!(date in fixByDateLeague)){
      fixByDateLeague[date] = {}
      fixByDate[date] = []
    }
    if(!(leagueID in fixByDateLeague[date])){
      fixByDateLeague[date][leagueID] = []
    }
    if(date == today){
      todayIDs.push(fixtureID);
    }else{
      fixByDate[date].push(fixtureID)
      fixByDateLeague[date][leagueID].push(fixtureID);
    }
    fixByID[fixtureID].push({
      date: date,
      timeStamp: fixture.event_timestamp,
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
    });
  });
  return [fixByID, fixByDateLeague, todayIDs, fixByDate];
}
