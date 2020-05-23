import dict from './authorizationKey';

const key = dict.key;

export async function getTeamByID(id){
  let fetchedData = await fetch("https://api-football-v1.p.rapidapi.com/v2/teams/team/" + id ,{
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": key
        }
    });
    if ( fetchedData.status !== 200 ) {
        console.log( 'Looks like there was a problem. Status Code: ' + fetchedData.status );
        return;
    } else {

        parsedData = await fetchedData.json();
        return parsedData;
    }
}

export async function getLastTwentyFixtures(teamID){
  let fetchedData = await fetch("https://api-football-v1.p.rapidapi.com/v2/fixtures/team/" + teamID + '/last/20',{
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": key
        }
    });
    if ( fetchedData.status !== 200 ) {
        console.log( 'Looks like there was a problem. Status Code: ' + fetchedData.status );
        return;
    } else {

        parsedData = await fetchedData.json();
        return parsedData;
    }
}

export async function getNextTenFixtures(teamID){
  let fetchedData = await fetch("https://api-football-v1.p.rapidapi.com/v2/fixtures/team/" + teamID + '/next/10',{
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": key
        }
    });
    if ( fetchedData.status !== 200 ) {
        console.log( 'Looks like there was a problem. Status Code: ' + fetchedData.status );
        return;
    } else {

        parsedData = await fetchedData.json();
        return parsedData;
    }
}

export async function getAllLeaguesForTeam(teamID){

  let fetchedData = await fetch("https://api-football-v1.p.rapidapi.com/v2/leagues/team/" + teamID + "/2019" ,{
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": key
        }
    });
    if ( fetchedData.status !== 200 ) {
        console.log( 'Looks like there was a problem. Status Code: ' + fetchedData.status );
        return;
    } else {

        parsedData = await fetchedData.json();
        return parsedData;
    }
}

export async function getStatisticsForTeamInLeague(leagueID, teamID){
  let fetchedData = await fetch("https://api-football-v1.p.rapidapi.com/v2/statistics/" + leagueID + "/" + teamID ,{
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": key
        }
    });
    if ( fetchedData.status !== 200 ) {
        console.log( 'Looks like there was a problem. Status Code: ' + fetchedData.status );
        return;
    } else {

        parsedData = await fetchedData.json();
        return parsedData;
    }
}

export async function getPlayersByTeamID(teamID){
  let fetchedData = await fetch("https://api-football-v1.p.rapidapi.com/v2/players/squad/" + teamID + "/2019-2020" ,{
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": key
        }
    });
    if ( fetchedData.status !== 200 ) {
        console.log( 'Looks like there was a problem. Status Code: ' + fetchedData.status );
        return;
    } else {

        parsedData = await fetchedData.json();
        return parsedData;
    }
}

export async function getPlayerStatisticsByTeamID(teamID){
  let fetchedData = await fetch("https://api-football-v1.p.rapidapi.com/v2/players/team/" + teamID + "/2019-2020" ,{
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": key
        }
    });
    if ( fetchedData.status !== 200 ) {
        console.log( 'Looks like there was a problem. Status Code: ' + fetchedData.status );
        return;
    } else {

        parsedData = await fetchedData.json();
        return parsedData;
    }
}

export async function getTeamsByLeagueID(id){
  let fetchedData = await fetch("https://api-football-v1.p.rapidapi.com/v2/teams/league/" + id ,{
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": key
        }
    });
    if ( fetchedData.status !== 200 ) {
        console.log( 'Looks like there was a problem. Status Code: ' + fetchedData.status );
        return;
    } else {

        parsedData = await fetchedData.json();
        return parsedData;
    }
}
