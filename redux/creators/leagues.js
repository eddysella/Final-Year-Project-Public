import {
  REQUEST_LEAGUE_BY_ID,
  RECEIVE_LEAGUE_BY_ID,
  REQUEST_FIXTURES_BY_LEAGUE,
  RECEIVE_FIXTURES_BY_LEAGUE,
  REQUEST_TEAMS_FOR_LEAGUE,
  RECEIVE_TEAMS_FOR_LEAGUE,
  RECEIVE_MULTIPLE_LEAGUES,
} from '../types'
import { getAllSeasonsForLeague } from '../../fetch/League'
import { getFixturesByLeagueAndDate } from '../../fetch/Fixtures'
import { getTeamsByLeagueID } from '../../fetch/Team'
import { processTeams, receiveMultipleTeams } from './teams'

export function requestLeagueByID(leagueID){
  return {
    type: REQUEST_LEAGUE_BY_ID,
    leagueID: leagueID,
  };
}

export function receiveLeagueByID(league){
  return {
    type: RECEIVE_LEAGUE_BY_ID,
    leagueID: league.leagueID,
    leagueName: league.leagueName,
    countryCode: league.countryCode,
    logo: league.logo,
  };
}

function shouldFetchLeague(league){
  if(!league){
    return true;
  }else if(league.fetchingLeague){
    return false;
  }
}

export function fetchLeagues(leagueIDs){
  return (dispatch, getState) => {
    promises = leagueIDs.map( leagueID => {
      if(shouldFetchLeague(getState().leaguesByID[leagueID])){
        dispatch(requestLeagueByID(leagueID))
        return getAllSeasonsForLeague(leagueID)
          // get latest season
        .then( data => processLeague(data))
        .then( processedData => dispatch(receiveLeagueByID(processedData)));
      }
    });
    return Promise.all(promises);
  }
}

function processLeague(data){
  data = data.api;
  leagues = data.leagues;
  league = leagues[leagues.length-1]
  return {
      leagueID: league.league_id,
      leagueName: league.country + " " + league.name,
      countryCode: league.country_code,
      logo: league.logo,
  };
}

export function requestTeamsByID(leagueID){
  return {
    type: REQUEST_TEAMS_FOR_LEAGUE,
    leagueID: leagueID,
  };
}

export function receiveTeamsByID(teamIDs, leagueID){
  return {
    type: RECEIVE_TEAMS_FOR_LEAGUE,
    teamIDs: teamIDs,
    leagueID: leagueID,
  };
}

function shouldFetchTeams(league){
  if(!league.teamIDs){
    return true;
  }else if(league.fetchingTeams){
    return false;
  }
}

export function fetchTeams(leagueID){
  return (dispatch, getState) => {
    if(shouldFetchTeams(getState().leaguesByID[leagueID])){
      dispatch(requestTeamsByID(leagueID))
      return getTeamsByLeagueID(leagueID)
      .then( data => processTeams(data))
      .then( processedData => {
          dispatch(receiveMultipleTeams(processedData[1]));
          dispatch(receiveTeamsByID(processedData[0], leagueID));
      })
}
  }
}

export function processLeagues(data){
  collect = {};
  ids = [];
  data = data.api;
  leagues = data.leagues;
  count = 0;
  for (leagueID in leagues){
    league = leagues[leagueID];
    if(league.is_current){
        count++;
        ids.push(league.league_id);
        collect[league.league_id] = {
          fetchingLeague: false,
          fetchingFixtures: false,
          fetchingTeams: false,
          leagueID: league.league_id,
          name: league.country + " " + league.name,
          countryCode: league.country_code,
          logo: league.logo,
        };
    }
    if(count == 9){
      break;
    }
  }
  return [ids,collect];
}

export function receiveMultipleLeagues(leagues){
  return {
    type: RECEIVE_MULTIPLE_LEAGUES,
    leagues: leagues,
  };
}


// export function requestFixtures(leagueID){
//   return {
//     type: REQUEST_FIXTURES_BY_LEAGUE,
//     leagueID: leagueID,
//   };
// }
//
// export function receiveFixtures(leagueID, fixtures){
//   return {
//     type: RECEIVE_FIXTURES_BY_LEAGUE,
//     leagueID: leagueID,
//     fixtures: fixtures,
//   };
// }
//
// function processFixtureStatus(data){
//   status='';
//   if(data[0] == 'NS'){
//       var date = new Date(data[1]*1000);
//       // Hours part from the timestamp
//       var hours = date.getHours();
//       // Minutes part from the timestamp
//       var minutes = "0" + date.getMinutes();
//       // Will display time in 10:30:23 format
//       status = hours + ':' + minutes.substr(-2);
//   }else if (['HT', 'FT'].includes(data[0])){
//       status = String(data[2] + "  " + data[0] + "  " + data[3]);
//   }else if (['1H','2H','ET','P'].includes(data[0])){
//       status = String(data[2] + "  " + data[4] + "'  " + data[3]);
//   }else{
//     status = data[0];
//   }
//   return status
// }
//
// export function processFixtures(data){
//   collect=[];
//   data = data.api;
//   fixtures = data.fixtures;
//
//   if(!fixtures){
//     return[[],[]]
//   }
//
//   fixtures.forEach( fixture => {
//       status = processFixtureStatus([
//         fixture.statusShort,
//         fixture.event_timestamp,
//         fixture.goalsHomeTeam,
//         fixture.goalsAwayTeam,
//         fixture.elapsed
//       ])
//       collect.push({
//           flag:fixture.league.logo,
//           id:fixture.fixture_id,
//           date: calculateDate(fixture.event_timestamp),
//           status:status,
//           elapsed:fixture.elapsed,
//           homeTeam:fixture.homeTeam,
//           awayTeam:fixture.awayTeam,
//           goalsHome:String(fixture.goalsHomeTeam),
//           goalsAway:String(fixture.goalsAwayTeam),
//           statusShort: fixture.statusShort,
//       });
//   });
//   return collect;
// }
//
//
// // display in dates using cards for each date,
// // scroll down for further
// // scroll up for before
// // yesterday
// // today
// // tomorrow
//
// export function fetchFixtures(leagueID){
//   return (dispatch, getState) => {
//       dispatch(requestFixtures(leagueID))
//       return getFixturesByLeagueAndDate(leagueID, today)
//       .then( data => processFixtures(data))
//       .then( processedData => dispatch(receiveFixtures(leagueID, processedData)));
//     }
// }

//
// function calculateDate(timeStamp){
//
//   date = null;
//   if(!timeStamp){
//     start = new Date();
//     start.setDate(start.getDate());
//     date = new Date(start);
//   }else{
//     date = new Date(timeStamp)
//   }
//   var dd = String(date.getDate()).padStart(2, '0');
//   var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
//   var year = String(date.getFullYear());
//   return String(year + '-' + mm + '-' + dd);
// }
//
// const today = calculateDate();
