import dict from './authorizationKey';

const key = dict.key;

export async function searchLeagueByCodeOrName( search ) {
    let fetchedData = await fetch( "https://api-football-v1.p.rapidapi.com/v2/leagues/search/" + search, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": key
        }
    } );
    if ( fetchedData.status !== 200 ) {
        console.log( 'Looks like there was a problem. Status Code: ' + fetchedData.status );
        return;
    } else {
        parsedData = await fetchedData.json();
        return parsedData;
    }
}

export async function searchTeamByCodeOrName( search ) {
    let fetchedData = await fetch( "https://api-football-v1.p.rapidapi.com/v2/teams/search/" + search, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": key
        }
    } );
    if ( fetchedData.status !== 200 ) {
        console.log( 'Looks like there was a problem. Status Code: ' + fetchedData.status );
        return;
    } else {
        parsedData = await fetchedData.json();
        return parsedData;
    }
}
