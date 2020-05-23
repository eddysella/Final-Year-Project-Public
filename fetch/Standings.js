import dict from './authorizationKey';

const key = dict.key;

export async function getStandingsByLeague(league){
  let fetchedData = await fetch("https://api-football-v1.p.rapidapi.com/v2/leagueTable/" + league ,{
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
