import {
  INIT_FIXTURES,
  REQUEST_FIXTURES_BY_DATE,
  RECEIVE_FIXTURES_BY_DATE,
  SET_FIXTURE_DATES,
  SET_CURRENT_DATE,
} from '../types/types'
import { getAllFixturesByDate } from '../../../fetch/Fixtures';

export function setFixtureDates(){
  return {
    type: SET_FIXTURE_DATES,
    dates: createDates(),
  }
}

function createDates(){
  collect=[];
  start = new Date();
  start.setDate(start.getDate() - 5);
  end = new Date();
  end.setDate(end.getDate() + 5);

  date = new Date(start);

  while (date <= end) {
      var dd = String(date.getDate()).padStart(2, '0');
      var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
      collect.push(mm + '/' + dd);

      date.setDate(date.getDate() + 1);
  }
  return collect;
}

export const getFixtureByID = id => ({
  type: 'GET_FIXTURE_BY_ID',
  id: id,
})

export const setFixtureByID = fixture => ({
  type: 'SET_FIXTURE_BY_ID',
  fixture: fixture,
})

export const selectFixtureTab = tab => ({
  type: 'SELECT_FIXTURE_TAB',
  tab: tab,
})

function shouldFetchFixtures(state, date){
  fixtures = state.fixturesByDate[date]
  if(!fixtures){
    console.log("Fetching Fixtures for " + date);
    return true;
  }else if(!fixtures.leagueNames.length){
    console.log("2nd Fetching Fixtures for " + date);
    return true;
  }else if(fixtures.isFetching){
    return false;
  }
}

function today(){
  start = new Date();
  start.setDate(start.getDate());
  date = new Date(start);
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var year = String(date.getFullYear());
  return String(year + '-' + mm + '-' + dd);
}

export function setTodaysFixtures(){
  date = today();
  return (dispatch, getState) => dispatch(fetchFixturesByDate(date))
}

export function initCurrentDate(){
  date = today();
  return {
    type: SET_CURRENT_DATE,
    date: date,
  }
}

function setCurrentDate(date){
  return {
    type: SET_CURRENT_DATE,
    date: date,
  }
}

export function initFixtures(date){
  return {
    type: INIT_FIXTURES,
    date: date,
    leagueNames: [],
    fixturesInOrder: [],
  }
}

function receiveFixturesByDate(date, fixtures){
  return {
    type: RECEIVE_FIXTURES_BY_DATE,
    date: date,
    leagueNames: fixtures[0],
    fixturesInOrder: fixtures[1],
    receivedAt: Date.now(),
  };
}

function requestFixturesByDate(date){
  return {
    type: REQUEST_FIXTURES_BY_DATE,
    date: date,
  };
}

export function fetchFixturesByDate(passedDate){
  if(passedDate.length < 8){
    start = new Date();
    start.setDate(start.getDate());
    date = new Date(start);
    var year = String(date.getFullYear());
    passedDate = year + '-' + passedDate.split('/').join('-');
  }
  return (dispatch, getState) => {
    if(shouldFetchFixtures(getState(), passedDate)){
        dispatch(requestFixturesByDate(passedDate))
        return getAllFixturesByDate(passedDate)
          .then( data => processFixtures(data))
          .then( fixtures => dispatch(receiveFixturesByDate(passedDate, fixtures)))
          .then( () => dispatch(setCurrentDate(passedDate)))
    }else{
      dispatch(setCurrentDate(passedDate))
    }
  }
}

function processFixtures(data){
  collect={};
  data = data.api;
  fixtures = data.fixtures;

  fixtures.forEach( fixture => {
      status='';
      if(fixture.statusShort == 'NS'){
          var date = new Date(fixture.event_timestamp*1000);
          // Hours part from the timestamp
          var hours = date.getHours();
          // Minutes part from the timestamp
          var minutes = "0" + date.getMinutes();
          // Will display time in 10:30:23 format
          status = hours + ':' + minutes.substr(-2);
      }else if (['HT', 'FT'].includes(fixture.statusShort)){
          status = String(fixture.goalsHomeTeam + "  " + fixture.statusShort + "  " + fixture.goalsAwayTeam);
      }else if (['1H','2H','ET','P'].includes(fixture.statusShort)){
          status = String(fixture.goalsHomeTeam + "  " + fixture.elapsed + "'  " + fixture.goalsAwayTeam);
      }else{
        status = fixture.status;
      }
      league = fixture.league;
      leagueName = league.country + " " + league.name;
      if (!(leagueName in collect)) {
          collect[leagueName] = [];
      }
      collect[leagueName].push({
          flag:league.logo,
          id:fixture.fixture_id,
          timeStamp:fixture.event_timestamp,
          status:status,
          elapsed:fixture.elapsed,
          homeTeam:fixture.homeTeam,
          awayTeam:fixture.awayTeam,
          goalsHome:String(fixture.goalsHomeTeam),
          goalsAway:String(fixture.goalsAwayTeam),
      });
  });
  collectNames=[];
  collectFixtures=[];
  for (league in collect) {
      collectNames.push(league);
      collectFixtures.push(collect[league]);
  }
  return [collectNames, collectFixtures];
}
