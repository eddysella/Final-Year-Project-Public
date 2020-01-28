import {
  REQUEST_FIXTURES_BY_DATE,
  RECEIVE_FIXTURES_BY_DATE,
  SET_FIXTURE_DATES,
  SET_CURRENT_DATE,
} from '../types'
import { getAllFixturesByDate} from '../../fetch/Fixtures';

function calculateToday(){
  start = new Date();
  start.setDate(start.getDate());
  date = new Date(start);
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var year = String(date.getFullYear());
  return String(year + '-' + mm + '-' + dd);
}

const today = calculateToday();

export function initCurrentDate(){
  return {
    type: SET_CURRENT_DATE,
    date: today,
  }
}

export function initFixtureDates(){
  return {
    type: SET_FIXTURE_DATES,
    dates: createDates(),
  }
}

export function initTodaysFixtures(){
  return dispatch => dispatch(fetchFixturesByDate(today))
}

function setCurrentDate(date){
  return {
    type: SET_CURRENT_DATE,
    date: date,
  }
}

function requestFixturesByDate(date){
  return {
    type: REQUEST_FIXTURES_BY_DATE,
    date: date,
  };
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

function shouldFetchFixtures(fixtures){
  if(!fixtures){
    return true;
  }else if(fixtures.isFetching){
    return false;
  }
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
    if(shouldFetchFixtures(getState().fixturesByDate[passedDate])){
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

export function processFixtures(data){
  names=[]
  collect={};
  data = data.api;
  fixtures = data.fixtures;

  if(!fixtures){
    return[[],[]]
  }

  fixtures.forEach( fixture => {
      status = processFixtureStatus([
        fixture.statusShort,
        fixture.event_timestamp,
        fixture.goalsHomeTeam,
        fixture.goalsAwayTeam,
        fixture.elapsed
      ])
      league = fixture.league;
      leagueName = league.country + " " + league.name;
      if (!(leagueName in collect)) {
          collect[leagueName] = [];
          names.push(leagueName);
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
          statusShort: fixture.statusShort,
      });
  });
  return [names,Object.values(collect)];
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
