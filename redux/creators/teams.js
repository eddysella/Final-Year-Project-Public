import {
  REQUEST_TEAM_BY_ID,
  RECEIVE_TEAM_BY_ID,
  REQUEST_PLAYERS_FOR_TEAM,
  RECEIVE_PLAYERS_FOR_TEAM,
  REQUEST_LEAGUES_FOR_TEAM,
  RECEIVE_LEAGUES_FOR_TEAM,
  REQUEST_PAST_TEAM_FIXTURES,
  RECEIVE_PAST_TEAM_FIXTURES,
  REQUEST_FUTURE_TEAM_FIXTURES,
  RECEIVE_FUTURE_TEAM_FIXTURES,
  RECEIVE_MULTIPLE_TEAMS,
  STATS_FETCHED_FOR_TEAM,
} from '../types'
import { getTeamByID, getLastTwentyFixtures, getNextTenFixtures,
  getAllLeaguesForTeam, getStatisticsForTeamInLeague,
  getPlayersByTeamID } from '../../fetch/Team'
import { processLeagues, receiveMultipleLeagues } from './leagues'
import { processPlayers, receivePlayer } from './players'

function requestTeamByID(teamID){
  return {
    type: REQUEST_TEAM_BY_ID,
    teamID: teamID,
  };
}

function receiveTeamByID(team){
  return {
    type: RECEIVE_TEAM_BY_ID,
    teamID: team.teamID,
    country: team.country,
    name: team.name,
    logo: team.logo
  };
}

function processTeam(data){
  data = data.api;
  teams = data.teams;
  team = teams[0]
  return {
      teamID: team.team_id,
      name: team.name,
      country: team.country,
      logo: team.logo,
  };
}

function shouldFetchTeam(team){
  if(!team){
    return true;
  }else if(team.fetchingTeam){
    return false;
  }
}
// removed cause not used?
// export function fetchTeam(teamID){
//   return (dispatch, getState) => {
//     if(shouldFetchTeam(getState().teamsByID[teamID])){
//       dispatch(requestTeamByID(teamID))
//       return getTeamByID(teamID)
//         // get latest season
//       .then( data => processTeam(data))
//       .then( processedData => dispatch(receiveTeamByID(processedData)));
//     }
//   }
// }

export function fetchTeams(teamIDs){
  return (dispatch, getState) => {
    promises = teamIDs.map( teamID => {
      if(shouldFetchTeam(getState().teamsByID[teamID])){
        dispatch(requestTeamByID(teamID))
        return getTeamByID(teamID)
          // get latest season
        .then( data => processTeam(data))
        .then( processedData => dispatch( receiveTeamByID(processedData)))
      }
    });
    return Promise.all(promises);
  }
}

export function processTeams(data){
  collect = {};
  ids = [];
  data = data.api;
  teams = data.teams;
  teams.length = 10;
  teams.forEach( team => {
    ids.push(team.team_id);
    collect[team.team_id] = {
      fetchingTeam: false,
      fetchingLeagues: false,
      fetchingPastFixtures: false,
      fetchingPlayers: false,
      fetchingFutureFixtures: false,
      teamID: team.team_id,
      name: team.name,
      logo: team.logo,
      country: team.country,
    }
  })
  return [ids,collect];
}

function requestLeagues(teamID){
  return {
    type: REQUEST_LEAGUES_FOR_TEAM,
    teamID: teamID,
  };
}

export function receiveLeagueIDs(teamID, leagueIDs){
  return {
    type: RECEIVE_LEAGUES_FOR_TEAM,
    teamID: teamID,
    leagueIDs: leagueIDs,
  };
}

function shouldFetchLeagues(team){
  if("leagueIDs" in team){
    return false;
  }else if(team.fetchingLeagues){
    return false;
  }else{
    return true;
  }
}

export function fetchLeaguesForTeam(teamID){
  return (dispatch, getState) => {
    if(shouldFetchLeagues(getState().teamsByID[teamID])){
      dispatch(requestLeagues())
      return getAllLeaguesForTeam(teamID)
      .then( data => processLeagues(data))
      .then( processedData => {
        dispatch( receiveMultipleLeagues(processedData[1]));
        dispatch( receiveLeagueIDs(teamID, processedData[0]));
      })
    }
  }
}

function requestPastFixtures(teamID){
  return {
    type: REQUEST_PAST_TEAM_FIXTURES,
    teamID: teamID,
  };
}

function receivePastFixtures(teamID, fixtures){
  return {
    type: RECEIVE_PAST_TEAM_FIXTURES,
    teamID: teamID,
    fixturesInOrder: fixtures,
    receivedAt: Date.now(),
  };
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
  collect=[];
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
      collect.push({
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
  return collect;
}

export function fetchPastFixtures(teamID){
  return (dispatch, getState) => {
    dispatch(requestPastFixtures(teamID))
    return getLastTwentyFixtures(teamID)
      // get latest season
    .then( data => processFixtures(data))
    .then( processedData => dispatch(receivePastFixtures(teamID, processedData)));
  }
}

function requestFutureFixtures(teamID){
  return {
    type: REQUEST_FUTURE_TEAM_FIXTURES,
    teamID: teamID,
  };
}

function receiveFutureFixtures(teamID, fixtures){
  return {
    type: RECEIVE_FUTURE_TEAM_FIXTURES,
    teamID: teamID,
    leagueNames: fixtures[0],
    fixturesInOrder: fixtures[1],
    receivedAt: Date.now(),
  };
}

export function fetchFutureFixtures(teamID){
  return (dispatch, getState) => {
    dispatch(requestFutureFixtures(teamID))
    return getNextTenFixtures(teamID)
      // get latest season
    .then( data => processFixtures(data))
    .then( processedData => dispatch(receiveFutureFixtures(teamID, processedData)));
  }
}

export function requestPlayersForTeam(teamID){
  return {
    type: REQUEST_PLAYERS_FOR_TEAM,
    teamID: teamID,
  };
}

export function fetchPlayers(teamID){
  return (dispatch, getState) => {
    dispatch( requestPlayersForTeam(teamID))
    return getPlayersByTeamID(teamID)
      .then( data => processPlayers(data))
      .then( processedData => {
        Promise.all([
          processedData[1].map( player => {
            dispatch( receivePlayer(player))
          }),
          dispatch( receivePlayerIDsForTeam(teamID, processedData[0])),
        ]);
      });
  }
}

export function receivePlayerIDsForTeam(teamID, playerIDs){
  return {
    type: RECEIVE_PLAYERS_FOR_TEAM,
    teamID: teamID,
    playerIDs: playerIDs,
  };
}

export function receiveMultipleTeams(teams){
  return {
    type: RECEIVE_MULTIPLE_TEAMS,
    teams: teams,
  };
}

export function confirmStatsFetched(teamID){
  return {
    type: STATS_FETCHED_FOR_TEAM,
    teamID: teamID,
  };
}
