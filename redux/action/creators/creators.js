import {
  REQUEST_FIXTURES_BY_DATE,
  RECEIVE_FIXTURES_BY_DATE,
  SET_FIXTURE_DATES,
  SET_CURRENT_DATE,
  RECEIVE_FIXTURE_BY_ID,
  REQUEST_FIXTURE_BY_ID,
  SET_TAB,
} from '../types/types'
import { getAllFixturesByDate, getFixtureByID } from '../../../fetch/Fixtures';

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

function shouldFetchSpecificFixture(state, id){
  console.log(state);
  fixture = state.specificFixture
  if(!fixture.id.length){
    console.log("Fetching fixture " + ID);
    return true;
  }else if(fixture.receivedAt < Date.now()){
    console.log("Replacing specificFixture");
    return true;
  }else if(fixture.fetching){
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

function requestFixtureByID(id){
  return {
    type: REQUEST_FIXTURE_BY_ID,
    fixtureID: id,
    fetching: true,
    topBar:
    [{
      status: '',
      homeLogo: '',
      homeName: '',
      awayLogo: '',
      awayName: '',
      },
    ],
    screen:
    [{
      stats: [],
      events: [],
      lineups: [],
      homeTeam: '',
      awayTeam: '',
      },
    ],
  };
}

function receiveFixtureByID(id, fixture){
  return {
    type: RECEIVE_FIXTURE_BY_ID,
    topBar: fixture['topBar'],
    screen: fixture['screen'],
    receivedAt: Date.now(),
    fetching: false,
  };
}

export function setTab(tab){
  return {
    type: SET_TAB,
    tabDisplayed: tab,
  };
}

export function fetchSpecificFixture(id){
  return (dispatch, getState) => {
    if(shouldFetchSpecificFixture(getState(), id)){
      dispatch(requestFixtureByID(id))
      return getFixtureByID(id)
        .then( data => processFixture(data))
        .then( fixture => dispatch(receiveFixtureByID(id, fixture)))
    }
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

function processFixture(data){
  console.log("PROCESSING " + id);
  collect={topBar:[],screen:[]};
  data = data.api;
  fixtures = data.fixtures;
  fixtures.forEach( fixture => {
      league = fixture.league;
      status = processFixtureStatus([
        fixture.statusShort,
        fixture.event_timestamp,
        fixture.goalsHomeTeam,
        fixture.goalsAwayTeam,
        fixture.elapsed
      ])
      collect['topBar'].push({
          leagueName:league.name,
          id:fixture.fixture_id,
          timeStamp:fixture.event_timestamp,
          status:status,
          elapsed:fixture.elapsed,
          homeTeam:fixture.homeTeam,
          awayTeam:fixture.awayTeam,
          goalsHome:String(fixture.goalsHomeTeam),
          goalsAway:String(fixture.goalsAwayTeam),
      });
      stats = this.createStats(fixture.statistics);
      lineups = this.createLineups(fixture.lineups);
      collect['screen'].push({
          homeTeam:fixture.homeTeam,
          awayTeam:fixture.awayTeam,
          stats:stats,
          events:fixture.events,
          lineups:lineups,
      });
  });
  return collect;
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

function processFixtures(data){
  collect={};
  data = data.api;
  fixtures = data.fixtures;

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
//
// function createStats(passedStats){
//   console.log("Creating Stats")
//     emptyStats=[]
//     stats = [
//         'Shots on Goal',
//         'Shots off Goal',
//         'Total Shots',
//         'Blocked Shots',
//         'Shots insidebox',
//         'Shots outsidebox',
//         'Fouls',
//         'Corner Kicks',
//         'Offsides',
//         'Ball Possession',
//         'Yellow Cards',
//         'Red Cards',
//         'Goalkeeper Saves',
//         'Total passes',
//         'Passes accurate',
//         'Passes %',
//     ]
//
//     if(!passedStats){
//         stats.forEach( stat => {
//             emptyStats.push({stat:stat,home:0,away:0});
//         });
//     }else{
//         for (stat in passedStats){
//             emptyStats.push({stat:stat,home:passedStats[stat]['home'],away:passedStats[stat]['away']});
//         }
//     }
//     return emptyStats
// }

function createLineups(passedLineups){
    lineups=[];
    if(!passedLineups){
        return;
    }
    for (team in passedLineups){
        lineups.push({team:team, starting:passedLineups[team]['startXI'], subs:passedLineups[team]['substitutes']});
    }
    return lineups;
}
