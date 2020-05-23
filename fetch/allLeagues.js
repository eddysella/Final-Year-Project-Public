import dict from './authorizationKey';

const key = dict.key;

export function allLeagues(){
    try{
        fetch("https://api-football-v1.p.rapidapi.com/v2/leagues", {
        "method": "GET",
        "headers": {
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        "x-rapidapi-key": key
        }
        }).then((response) => {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + fetchedData.status);
                return;
            }
            else{
                response.json().then((parsedData) => {
                    return parsedData
                });
            }
        }).catch(error => {});
    } catch (error){}
}
