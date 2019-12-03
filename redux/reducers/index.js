import { getFixtureByDate, getFixtureByID, selectFixtureTab} from '../action/creators/creators'
import * from '../types/types'
import { combineReducers } from 'redux'

function fixturesDates(state = [], action){
  switch(action.type){
    case SET_FIXTURE_DATES:
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
    default:
      return state;
  }
}

function fixturesDisplayed(state = [], action){
  switch(action.type){
    case SET_FIXTURES_BY_DATE:
      passedDate=action.date;
      dateString=undefined;
      const date = new Date();
      date.setDate(date.getDate());
      var year = String(date.getFullYear());
      dateString = year + '-' + passedDate.split('/').join('-');

      collect={};

      getAllFixturesByDate( dateString ).then( data => {
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
      });
      return return collect;
    default:
      return state;
  }
}

export default combineReducers({
  fixturesDates,
  fixturesDisplayed
})
//
// function fixturesMain(state, action){
//   switch(action.type){
//     case SET_FIXTURE_DATES:
//       return Object.assign({}, state, {
//         fixtures_all_dates: action.dates
//       });
//     case GET_FIXTURES_BY_DATE:
//       return Object.assign({}, state, {
//         fixtures_current_date: action.date
//       });
//     case SET_FIXTURES_BY_DATE:
//       return Object.assign({}, state, {
//         fixtures_displayed: action.fixtures
//       });
//     case GET_FIXTURE_BY_ID:
//     case SET_FIXTURE_BY_ID:
//     case SELECT_FIXTURE_TAB:
//       return this.fixturesSpecific(state, action);
//     default:
//       return state;
//   }
//   return state;
// }
//
// function fixturesSpecific(state, action){
//   switch(action.type){
//     case GET_FIXTURE_BY_ID:
//       return Object.assign({}, state, {
//         fixture_by_id: action.id
//       });
//     case SET_FIXTURE_BY_ID:
//       return Object.assign({}, state, {
//         fixture: action.fixture
//       });
//     case SELECT_FIXTURE_TAB:
//       return Object.assign({}, state, {
//         tab: action.tab
//       });
//     default:
//       return state;
//   }
//   return state;
// }
