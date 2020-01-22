import {
  RECEIVE_FIXTURE_BY_ID,
  REQUEST_FIXTURE_BY_ID,
  SET_TAB,
} from '../types'
import { getFixtureByID } from '../../fetch/Fixtures';

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
