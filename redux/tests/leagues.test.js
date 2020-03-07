import * as types from '../types/leagues'
import { leaguesByID } from '../reducers/leagues'

describe('leaguesByID Reducer', () => {
  it('should return the initial state', () => {
    expect(leaguesByID(undefined, {})).toEqual({
      fetching: false,
    })
  })

  it('LEAGUE_REQUEST_BY_ID should set fetching and fetchingLeague to true and init a league entity referenced by id', () => {
    expect(leaguesByID(undefined, {
      type: types.LEAGUE_REQUEST_BY_ID,
      leagueID: 5,
    })).toEqual({
      fetching: true,
      5: {
        fetchingLeague: true,
        fetchingTeams: false,
        fetchingFixtures: false,
        leagueID: 5,
        name: '',
        countryCode: '',
        logo: '',
      }
    })
  })

  it('LEAGUE_REQUEST_TEAMS should set fetching and fetchingTeams to true for the specified league', () => {
    expect(leaguesByID({
      fetching: false,
      5: {
        fetchingLeague: false,
        fetchingTeams: false,
        fetchingFixtures: false,
        leagueID: '',
        name: '',
        countryCode: '',
        logo: '',
      }
    }, {
      type: types.LEAGUE_REQUEST_TEAMS,
      leagueID: 5,
    })).toEqual({
      fetching: true,
      5: {
        fetchingLeague: false,
        fetchingTeams: true,
        fetchingFixtures: false,
        leagueID: '',
        name: '',
        countryCode: '',
        logo: '',
      }
    })
  })
  it('LEAGUE_RECEIVE_BY_ID should update the properties of the specified league with the passed data', () => {
    expect(leaguesByID({
      fetching: true,
      5: {
        fetchingLeague: true,
        fetchingTeams: false,
        fetchingFixtures: false,
        leagueID: 5,
        name: '',
        countryCode: '',
        logo: '',
      }
    }, {
      type: types.LEAGUE_RECEIVE_BY_ID,
      leagueID: 5,
      name: "test",
      countryCode: "TEST",
      logo: "URI",
      seasonStart: 10000,
      seasonEnd: 20000,
    })).toEqual({
      fetching: false,
      5: {
        fetchingLeague: false,
        fetchingTeams: false,
        fetchingFixtures: false,
        leagueID: 5,
        name: "test",
        countryCode: "TEST",
        logo: "URI",
        seasonStart: 10000,
        seasonEnd: 20000,
      }
    })
  })
  it('LEAGUE_RECEIVE_TEAMS should set fetching and fetchingTeams to false and insert the teamIDs', () => {
    expect(leaguesByID({
      fetching: true,
      5: {
        fetchingLeague: false,
        fetchingTeams: true,
        fetchingFixtures: false,
        leagueID: 5,
        name: '',
        countryCode: '',
        logo: '',
      }
    }, {
      type: types.LEAGUE_RECEIVE_TEAMS,
      leagueID: 5,
      teamIDs: [1,2,3,4,5]
    })).toEqual({
      fetching: false,
      5: {
        fetchingLeague: false,
        fetchingTeams: false,
        fetchingFixtures: false,
        leagueID: 5,
        name: '',
        countryCode: '',
        logo: '',
        teamIDs: [1,2,3,4,5]
      }
    })
  })
  it('LEAGUE_RECEIVE_MULTIPLE_LEAGUES should insert multiple league entities into the store', () => {
    expect(leaguesByID(undefined, {
      type: types.LEAGUE_RECEIVE_MULTIPLE_LEAGUES,
      leagues: {
        5 : {
          fetchingLeague: false,
          fetchingTeams: false,
          fetchingFixtures: false,
          leagueID: 5,
          name: '',
          countryCode: '',
          logo: '',
          teamIDs: [1,2,3,4,5]
        },
        10 : {
          fetchingLeague: false,
          fetchingTeams: false,
          fetchingFixtures: false,
          leagueID: 10,
          name: '',
          countryCode: '',
          logo: '',
          teamIDs: [1,2,3,4,5]
        }
      }
    })).toEqual({
      fetching: false,
      5 : {
        fetchingLeague: false,
        fetchingTeams: false,
        fetchingFixtures: false,
        leagueID: 5,
        name: '',
        countryCode: '',
        logo: '',
        teamIDs: [1,2,3,4,5]
      },
      10 : {
        fetchingLeague: false,
        fetchingTeams: false,
        fetchingFixtures: false,
        leagueID: 10,
        name: '',
        countryCode: '',
        logo: '',
        teamIDs: [1,2,3,4,5]
      }
    })
  })

})
