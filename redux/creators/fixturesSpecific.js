import {
  FIXTURES_REQUEST_STATS,
  FIXTURES_RECEIVE_STATS,
} from '../types/fixtures'
import { getFixtureByID } from '../../fetch/FixturesV2';

function requestFixtureStats(id){
  return {
    type: FIXTURES_REQUEST_STATS,
  };
}

function receiveFixtureStats(id, stats){
  return {
    type: FIXTURES_RECEIVE_STATS,
    fixtureID: id,
    stats: stats,
  };
}

export function fetchSpecificFixture(id){
  return dispatch => {
    dispatch(requestFixtureStats(id))
    return getFixtureByID(id)
    .then( data => processFixture(data))
    .then( processedData => dispatch(receiveFixtureStats(id, processedData)))
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
  collect=null;
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
      stats = createStats(fixture.statistics);
      lineups = createLineups(fixture.lineups);
      collect = {
          status: status,
          stats:stats,
          events:fixture.events,
          lineups:lineups,
      };
  });
  return collect;
}
