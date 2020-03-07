import * as types from '../types/team'
import { teamsByID } from '../reducers/teams'

describe('teamsByID Reducer', () => {
  it('should return the initial state', () => {
    expect(teamsByID(undefined, {})).toEqual({fetching: false})
  })

  it('TEAM_REQUEST_BY_ID should set fetching and fetchingTeam to true and init a team entity into the store referenced by ID', () => {
    expect(teamsByID({fetching: false}, {
      type: types.TEAM_REQUEST_BY_ID,
      teamID: 5,
    })).toEqual({
      fetching: true,
      5: {
        fetchingTeam: true,
        fetchingLeagues: false,
        fetchingPlayers: false,
        name: '',
        logo: '',
        statsFetched: false,
      }
    })
  })

  it('TEAM_REQUEST_PLAYERS should set fetching and fetchingPlayers to true and init a playerIDs array in the specified entity', () => {
    expect(teamsByID({
      fetching: false,
      5: {
        fetchingTeam: false,
        fetchingLeagues: false,
        fetchingPlayers: false,
        name: '',
        logo: '',
        statsFetched: false,
      }
    }, {
      type: types.TEAM_REQUEST_PLAYERS,
      teamID: 5
    })).toEqual({
      fetching: true,
      5: {
        fetchingTeam: false,
        fetchingLeagues: false,
        fetchingPlayers: true,
        name: '',
        logo: '',
        statsFetched: false,
        playerIDs: [],
      }
    })
  })

  it('TEAM_REQUEST_LEAGUES should set fetching and fetchingLeagues  to  true and init a leagueIDs array for the specified entity', () => {
    expect(teamsByID({
      fetching: false,
      5: {
        fetchingTeam: false,
        fetchingLeagues: false,
        fetchingPlayers: false,
        name: '',
        logo: '',
        statsFetched: false,
      }
    }, {
      type: types.TEAM_REQUEST_LEAGUES,
      teamID: 5
    })).toEqual({
      fetching: true,
      5: {
        fetchingTeam: false,
        fetchingLeagues: true,
        fetchingPlayers: false,
        name: '',
        logo: '',
        statsFetched: false,
        leagueIDs: [],
      }
    })
  })

  it('TEAM_RECEIVE_BY_ID should set fetching and fetchingTeam to false and update properties for the specified team', () => {
    expect(teamsByID({
      fetching: true,
      5: {
        fetchingTeam: true,
        fetchingLeagues: false,
        fetchingPlayers: false,
        name: '',
        logo: '',
        statsFetched: false,
      }
    }, {
      type: types.TEAM_RECEIVE_BY_ID,
      teamID: 5,
      country: "country",
      name: "test",
      logo: "URI",
    })).toEqual({
      fetching: false,
      5: {
        fetchingTeam: false,
        fetchingLeagues: false,
        fetchingPlayers: false,
        name: "test",
        logo: "URI",
        country: "country",
        statsFetched: false,
      }
    })
  })

  it('TEAM_RECEIVE_PLAYERS should set fetching and fetchingPlayers to false and update the playerIDs array with the passed array', () => {
    expect(teamsByID({
      fetching: true,
      5: {
        fetchingTeam: false,
        fetchingLeagues: false,
        fetchingPlayers: true,
        name: '',
        logo: '',
        statsFetched: false,
        playerIDs: [],
      }
    }, {
      type: types.TEAM_RECEIVE_PLAYERS,
      teamID: 5,
      playerIDs: [1,2,3,4,5]
    })).toEqual({
      fetching: false,
      5: {
        fetchingTeam: false,
        fetchingLeagues: false,
        fetchingPlayers: false,
        name: '',
        logo: '',
        statsFetched: false,
        playerIDs: [1,2,3,4,5],
      }
    })
  })

  it('TEAM_RECEIVE_LEAGUES', () => {
    expect(teamsByID({
      fetching: true,
      5: {
        fetchingTeam: false,
        fetchingLeagues: true,
        fetchingPlayers: false,
        name: '',
        logo: '',
        statsFetched: false,
        leagueIDs: [],
      }
    }, {
      type: types.TEAM_RECEIVE_LEAGUES,
      teamID: 5,
      leagueIDs: [1,2,3,4,5]
    })).toEqual({
      fetching: false,
      5: {
        fetchingTeam: false,
        fetchingLeagues: false,
        fetchingPlayers: false,
        name: '',
        logo: '',
        statsFetched: false,
        leagueIDs: [1,2,3,4,5],
      }
    })
  })

  it('TEAM_SET_STATS_FETCHED_TRUE should set statsFetched to true', () => {
    expect(teamsByID({
      fetching: false,
      5: {
        fetchingTeam: false,
        fetchingLeagues: false,
        fetchingPlayers: false,
        name: '',
        logo: '',
        statsFetched: false,
      }
    }, {
      type: types.TEAM_SET_STATS_FETCHED_TRUE,
      teamID: 5,
    })).toEqual({
      fetching: false,
      5: {
        fetchingTeam: false,
        fetchingLeagues: false,
        fetchingPlayers: false,
        name: '',
        logo: '',
        statsFetched: true,
      }
    })
  })

  it('TEAM_RECEIVE_MULTIPLE_TEAMS should merge the passed teams into the store', () => {
    expect(teamsByID({fetching: false}, {
      type: types.TEAM_RECEIVE_MULTIPLE_TEAMS,
      teams: {
        5: {
          fetchingTeam: false,
          fetchingLeagues: false,
          fetchingPlayers: false,
          name: '',
          logo: '',
          statsFetched: true,
        },
        10: {
          fetchingTeam: false,
          fetchingLeagues: false,
          fetchingPlayers: false,
          name: '',
          logo: '',
          statsFetched: true,
        }
      }
    })).toEqual({
      fetching: false,
      5: {
        fetchingTeam: false,
        fetchingLeagues: false,
        fetchingPlayers: false,
        name: '',
        logo: '',
        statsFetched: true,
      },
      10: {
        fetchingTeam: false,
        fetchingLeagues: false,
        fetchingPlayers: false,
        name: '',
        logo: '',
        statsFetched: true,
      }
    })
  })

})
