import dict from './authorizationKey';

const key = dict.key;

export async function getAllSeasonsForLeague( id ) {
    let fetchedData = await fetch( "https://api-football-v1.p.rapidapi.com/v2/leagues/seasonsAvailable/" + id, {
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

export async function getLeaguesByCountry(countryCode){
  let fetchedData = await fetch("https://api-football-v1.p.rapidapi.com/v2/leagues/country/" + countryCode + "/2019", {
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

export async function getLeagueCurrentRound(id){
  let fetchedData = await fetch("https://api-football-v1.p.rapidapi.com/v2/fixtures/rounds/" + id + "/current", {
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
