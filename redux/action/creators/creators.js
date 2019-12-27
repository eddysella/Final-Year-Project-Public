import {
  REQUEST_FIXTURES_BY_DATE,
  RECEIVE_FIXTURES_BY_DATE,
  SET_FIXTURE_DATES,
  SET_CURRENT_DATE,
  RECEIVE_FIXTURE_BY_ID,
  REQUEST_FIXTURE_BY_ID,
  SET_TAB,
  REQUEST_STANDINGS,
  RECEIVE_STANDINGS,
  ADD_LEAGUE_STANDINGS,
  REMOVE_LEAGUE_STANDINGS,
} from '../types/types'
import { getAllFixturesByDate, getFixtureByID } from '../../../fetch/Fixtures';
import { getStandingsByLeague } from '../../../fetch/Standings';
import { getAllSeasonsForLeague } from '../../../fetch/League';


FETCH LEAGUE BY ID and retrieve info. Make main screen standings functionality
deal with league info and then details screen has specificstandings

change addLeagueToStandings
change removeLeagueFromStandings

// CHECK IF YOU CAN ADD 2019 to league retrieval



export function addLeagueToStandings(league){
  return {
    type: ADD_LEAGUE_STANDINGS,
    leagueID: league,
  };
}

export function removeLeagueFromStandings(league){
  return {
    type: REMOVE_LEAGUE_STANDINGS,
    leagueID: league,
  };
}

export function setStandingsLeagues(leagues){
  return (dispatch, getState) => {
    dispatch(fetchLeagues(leagues));
  }
}

function fetchLeagues(leagueIDs){
  return (dispatch, getState) => {
    dispatch(requestStandingsLeagues(leagueIDs))
    return getLeaguesByIDs(leagueID)
      .then( data => processStandings(data))
      .then( standings => dispatch(receiveStandings(standings)));
  }
}

function requestStandingsLeagues(leagueIDs){
  return leagueIDs => {
    collect = {};
    for (leagueID in leagueIDs){
      getAllSeasonsForLeague(leagueID)
        // get latest season
      .then( data => processLeague(data))
      .then( processedData => collect.push(processedData));
    }
    return collect;
  }
}

function processLeague(data){
  data = data.api;
  leagues = data.leagues;
  league = leagues[leagues.length-1]
  leagueName = league.country + league.name;
  collect = {
      countryCode: league.country_code,
      logo: league.logo,
  };

  return [leagueName, collect];
}

export function setStandings(leagueID){
  return (dispatch,getState) => {
    dispatch(fetchStandings(leagueID));
  }
}

function receiveStandingsByLeague(standings){
  return {
    type: RECEIVE_STANDINGS,
    teamNames: standings[0],
    standingsInOrder: standings[1],
    lastUpdated: Date.now(),
  };
}

function requestStandingsByLeague(leagueID, leagueName){
  return {
    type: REQUEST_STANDINGS,
    leagueID: leagueID,
    leagueName: leagueName,
  };
}

function fetchStandings(leagueID, leagueName){
  return (dispatch, getState) => {
    dispatch(requestStandings(leagueID, leagueName))
    return getStandingsByLeague(leagueID)
      .then( data => processStandings(data))
      .then( standings => dispatch(receiveStandings(standings)));
  }
}

function processStandings(data){
  collect={};
  data = data.api;
  standings = data.standings;
  standings.forEach( team => {
      teamName = team.teamName;
      stats = team.all;
      collect[teamName].push({
          rank: team.rank,
          teamID: team.team_id,
          logo: team.logo,
          totPoints: team.points,
          played: stats.matchsPlayed,
          gamesWon: stats.win,
          gamesDrawn: stats.draw,
          gamesLost: stats.lose,
          scored: stats.goalsFor,
          conceded: stats.goalsAgainst,
      });
  });
  collectNames=[];
  collectFixtures=[];
  for (team in collect) {
      collectNames.push(team);
      collectFixtures.push(collect[team]);
  }
  return [collectNames, collectFixtures];
}

function createStats(passedStats){
    emptyStats=[]
    stats = [
        'Shots on Goal',
        'Shots off Goal',
        'Total Shots',
        'Blocked Shots',
        'Shots insidebox',
        'Shots outsidebox',
        'Fouls',
        'Corner Kicks',
        'Offsides',
        'Ball Possession',
        'Yellow Cards',
        'Red Cards',
        'Goalkeeper Saves',
        'Total passes',
        'Passes accurate',
        'Passes %',
    ]

    if(!passedStats){
        stats.forEach( stat => {
            emptyStats.push({stat:stat,home:0,away:0});
        });
    }else{
        for (stat in passedStats){
            emptyStats.push({stat:stat,home:passedStats[stat]['home'],away:passedStats[stat]['away']});
        }
    }
    return emptyStats
}

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
    return true;
  }else if(!fixtures.leagueNames.length){
    return true;
  }else if(fixtures.isFetching){
    return false;
  }
}

function shouldFetchSpecificFixture(state){
  fixture = state.specificFixture
  if(!fixture.receivedAt){
    return true;
  }else if(fixture.receivedAt < Date.now()){
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
    topBar:
    {
      status: '',
      homeName: '',
      awayName: '',
      },
    screen:
    {
      stats: createStats(),
      events: [],
      lineups: [],
      homeTeam: '',
      awayTeam: '',
      },
  };
}

function receiveFixtureByID(id, fixture){
  return {
    type: RECEIVE_FIXTURE_BY_ID,
    topBar: fixture[0],
    screen: fixture[1],
    receivedAt: Date.now(),
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
    if(shouldFetchSpecificFixture(getState())){
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
  collect=[];
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
      homeTeam = fixture.homeTeam;
      awayTeam = fixture.awayTeam;
      collect.push({
          leagueName:league.name,
          id:fixture.fixture_id,
          timeStamp:fixture.event_timestamp,
          status:status,
          elapsed:fixture.elapsed,
          homeLogo: homeTeam.logo,
          homeName: homeTeam.team_name,
          awayLogo: awayTeam.logo,
          awayName: awayTeam.team_name,
          goalsHome:String(fixture.goalsHomeTeam),
          goalsAway:String(fixture.goalsAwayTeam),
      });
      stats = createStats(fixture.statistics);
      lineups = createLineups(fixture.lineups);
      collect.push({
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
