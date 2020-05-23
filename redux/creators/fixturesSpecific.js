import {
  FIXTURES_REQUEST_STATS,
  FIXTURES_RECEIVE_STATS,
} from '../types/fixtures'
import { getFixtureByID } from '../../fetch/FixturesV2';
import { processFixtureStatus } from './fixtures'
/**
 * @module Redux Creators fixturesSpecific
 */

/**
 * Sets the fetching property of the fixturesByID store to true.
 * @method requestFixtureStats
 * @return {Action} type: FIXTURES_REQUEST_STATS
 */
function requestFixtureStats(){
  return {
    type: FIXTURES_REQUEST_STATS,
  };
}

/**
 * Adds a set of statistics to a fixture in the fixturesByID store.
 * @method receiveFixtureStats
 * @param  {Integer} id A Fixture ID
 * @param  {Object} stats statName : String stat
 * @return {Action} type: FIXTURES_RECEIVE_STATS
 */
function receiveFixtureStats(id, stats){
  return {
    type: FIXTURES_RECEIVE_STATS,
    fixtureID: id,
    stats: stats,
  };
}

/**
 * Returns true if there is a stats object within the fixtures object. False otherwise.
 * @method shouldFetchMoreInfo
 * @param  {Object} fixture (propertyName : property)
 * @return {Boolean}
 */
function shouldFetchMoreInfo(fixture){
  return !fixture.stats;
}

/**
 * Fetch Sequence for fixture statistics.
 * @method fetchSpecificFixture
 * @param  {Integer} id A Fixture ID
 * @return {Function}
 */
export function fetchSpecificFixture(id){
  return (dispatch, getState) => {
    if(shouldFetchMoreInfo(getState().fixturesByID[id])){
      dispatch(requestFixtureStats(id))
      return getFixtureByID(id)
      .then( data => processFixture(data))
      .then( processedData => dispatch(receiveFixtureStats(id, processedData)))
    }
  }
}

/**
 * Converts the lineups JSON data into a more convenient layout for UI.
 * @method createLineups
 * @param  {Object} passedLineups (team : Object ((startXI/substitutes) : Object (stat: String stat)))
 * @return {Object} [
 * team : String name,
 * starting : Object A set of player Objects
 * substitutes : Object A set of player Objects
 * ]
 */
function createLineups(passedLineups){
    lineups=[];
    if(!passedLineups){
        return null;
    }
    for (team in passedLineups){
        lineups.push({team:team, starting:passedLineups[team]['startXI'], subs:passedLineups[team]['substitutes']});
    }
    return lineups;
}

/**
 * Converts the statistics JSON data into a more convenient layout for UI.
 * @method createStats
 * @param  {Object} passedStats (stat : Object ((home/away) : Object (stat: String stat)))
 * @return {Object} (stat : String stat)
 */
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

/**
 * Processes a set of fixture statistics for a fixture.
 * @method processFixture
 * @param  {Object}       data JSON Object
 * @return {Object} (stat : Object stat)
 */
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
      if(fixture.statusShort == "PST"){}
      stats = createStats(fixture.statistics);
      lineups = createLineups(fixture.lineups);
      collect = {
          status: status,
          stats:stats,
          events: processEvents(fixture.events),
          lineups:lineups,
      };
  });
  return collect;
}

/**
 * Replaces subsitution event with neater representation
 * @method processEvents
 * @param  {Array} events A set of event objects
 * @return {Array}
 */
function processEvents(events){
  if(!events){
    return null;
  }else{
    events.forEach(event => {
      if(event.type == 'subst'){
        event.player = event.player + " > " + event.detail
        event.detail = 'Substitution'
      }
    })
    return events
  }
}
