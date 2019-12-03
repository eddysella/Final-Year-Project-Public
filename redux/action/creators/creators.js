import {
  REQUEST_FIXTURES_BY_DATE,
  RECEIVE_FIXTURES_BY_DATE,
  SET_FIXTURE_DATES,
} from '../action/types/types'
import { getAllFixturesByDate } from '../../../fetch/Fixtures';

export const setFixtureDates = () => ({
  type: 'SET_FIXTURE_DATES',
  dates: () => {
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
})

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


function receiveFixturesByDate(date, fixtures){
  return {
    date: date,
    type: 'RECEIVE_FIXTURES_BY_DATE',
    fixtures: fixtures,
    receivedAt: Date.now(),
  };
}

function requestFixturesByDate(date){
  return {
    type: 'REQUEST_FIXTURES_BY_DATE',
    date: date,
  };
}

export function fetchFixturesByDate(passedDate){

  dateString=undefined;
  const date = new Date();
  date.setDate(date.getDate());
  var year = String(date.getFullYear());
  dateString = year + '-' + passedDate.split('/').join('-');

  collect={};

  return function (dispatch){
    dispatch(requestFixturesByDate(date))

    return getAllFixturesByDate( dateString ).then( data => {
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
      dispatch(receiveFixturesByDate(date, collect));
  })}
}
