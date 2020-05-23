import dict from './authorizationKey';

const key = dict.key;

export async function getFutureLeagueFixtures( id, amount ){
    let fetchedData = await fetch("https://api-football-v1.p.rapidapi.com/v2/fixtures/league/" + id + "/next/" + (amount * 20) + "?timezone=Europe%2FLondon", {
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

export async function getPastLeagueFixtures( id, amount ){
    let fetchedData = await fetch("https://api-football-v1.p.rapidapi.com/v2/fixtures/league/" + id + "/last/" + (amount * 20) + "?timezone=Europe%2FLondon", {
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

export async function getFixturesByLeagueAndDate( id, date ){
    let fetchedData = await fetch("https://api-football-v1.p.rapidapi.com/v2/fixtures/league/" + id + "/" + date + "?timezone=Europe%2FLondon", {
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

export async function getFixturesByLeagueAndRound( id, round ){
    let fetchedData = await fetch("https://api-football-v1.p.rapidapi.com/v2/fixtures/league/" + id + "/" + round + "?timezone=Europe%2FLondon", {
    	"method": "GET",
    	"headers": {
    		"x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    		"x-rapidapi-key": key
    	}
    })
    if ( fetchedData.status !== 200 ) {
        console.log( 'Looks like there was a problem. Status Code: ' + fetchedData.status );
        return;
    } else {
        parsedData = await fetchedData.json();
        return parsedData;
    }
}

export async function getFutureTeamFixtures( id, amount ){
    let fetchedData = await fetch("https://api-football-v1.p.rapidapi.com/v2/fixtures/team/" + id + "/next/" + (amount * 20) + "?timezone=Europe%2FLondon", {
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

export async function getPastTeamFixtures( id, amount ){
    let fetchedData = await fetch("https://api-football-v1.p.rapidapi.com/v2/fixtures/team/" + id + "/last/" + (amount * 20) + "?timezone=Europe%2FLondon", {
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


export async function getFixtureByID( id ){
    let fetchedData = await fetch("https://api-football-v1.p.rapidapi.com/v2/fixtures/id/" + id + "?timezone=Europe%2FLondon", {
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
