import {
  STORE_FIXTURES,
} from '../types'

export function storeFixtures(fixtures){
  return {
    type: STORE_FIXTURES,
    fixtures: fixtures,
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
  identifiers=[];
  collect={};
  data = data.api;
  fixtures = data.fixtures;

  if(!fixtures){
    return[[],[]]
  }

  fixtures.forEach( fixture => {
      identifiers.push([fixture.fixture_id, fixture.timeStamp, fixture.league_id]);
      collect[fixture.fixture_id].push({
          timeStamp:fixture.event_timestamp,
          status: processFixtureStatus([
            fixture.statusShort,
            fixture.event_timestamp,
            fixture.goalsHomeTeam,
            fixture.goalsAwayTeam,
            fixture.elapsed
          ]),
          elapsed:fixture.elapsed,
          homeTeam:fixture.homeTeam,
          awayTeam:fixture.awayTeam,
          goalsHome:String(fixture.goalsHomeTeam),
          goalsAway:String(fixture.goalsAwayTeam),
          statusShort: fixture.statusShort,
      });
  });
  return [identifiers,collect];
}
