import * as types from '../types/search'
import { searchInput, search } from '../reducers/search'

describe('searchInput Reducer', () => {
  it('should return the initial state', () => {
    expect(searchInput(undefined, {})).toEqual("")
  })

  it('SEARCH_UPDATE_INPUT should update the store to the passed string', () => {
    expect(searchInput({}, {
        type: types.SEARCH_UPDATE_INPUT,
        input: "test1",
      })).toEqual("test1")
  })
    expect(searchInput({}, {
      type: types.SEARCH_UPDATE_INPUT,
      input: "test2",
    })).toEqual("test2")
})

describe('search Reducer', () => {
  it('should return the initial state', () => {
    expect(search(undefined, {})).toEqual({
      teamIsFetching: false,
      teamIDs: [],
      leagueIsFetching: false,
      leagueIDs: [],
    })
  })

  it('SEARCH_REQUEST_LEAGUE_SEARCH should set leagueIsFetching to true and clear the leagueIDs array', () => {
    expect(search({
      teamIsFetching: false,
      teamIDs: [],
      leagueIsFetching: false,
      leagueIDs: [1,2,3,4],
    }, {
      type: types.SEARCH_REQUEST_LEAGUE_SEARCH,
    })).toEqual({
      teamIsFetching: false,
      teamIDs: [],
      leagueIsFetching: true,
      leagueIDs: [],
    })
  })

  it('SEARCH_RECEIVE_LEAGUE_SEARCH should set leagueIsFetching to false and insert the passed leagueIDs into the leagueIDs array', () => {
    expect(search({
      teamIsFetching: false,
      teamIDs: [],
      leagueIsFetching: true,
      leagueIDs: [],
    }, {
      type: types.SEARCH_RECEIVE_LEAGUE_SEARCH,
      leagueIDs: [1,2,3,4]
    })).toEqual({
      teamIsFetching: false,
      teamIDs: [],
      leagueIsFetching: false,
      leagueIDs: [1,2,3,4],
    })
  })

  it('SEARCH_CLEAR_LEAGUE should clear the leagueIDs array', () => {
    expect(search({
      teamIsFetching: false,
      teamIDs: [],
      leagueIsFetching: false,
      leagueIDs: [1,2,3,4],
    }, {
      type: types.SEARCH_CLEAR_LEAGUE,
    })).toEqual({
      teamIsFetching: false,
      teamIDs: [],
      leagueIsFetching: false,
      leagueIDs: [],
    })
  })

  it('SEARCH_REQUEST_TEAM_SEARCH should set teamIsFetching to true and clear the teamIDs array', () => {
    expect(search({
      teamIsFetching: false,
      teamIDs: [1,2,3,4],
      leagueIsFetching: false,
      leagueIDs: [],
    }, {
      type: types.SEARCH_REQUEST_TEAM_SEARCH,
    })).toEqual({
      teamIsFetching: true,
      teamIDs: [],
      leagueIsFetching: false,
      leagueIDs: [],
    })
  })

  it('SEARCH_RECEIVE_TEAM_SEARCH should set teamIsFetching to false and insert the passed teamIDs into the teamIDs array', () => {
    expect(search({
      teamIsFetching: true,
      teamIDs: [],
      leagueIsFetching: false,
      leagueIDs: [],
    }, {
      type: types.SEARCH_RECEIVE_TEAM_SEARCH,
      teamIDs: [1,2,3,4]
    })).toEqual({
      teamIsFetching: false,
      teamIDs: [1,2,3,4],
      leagueIsFetching: false,
      leagueIDs: [],
    })
  })

  it('SEARCH_CLEAR_TEAM should clear the teamIDs array', () => {
    expect(search({
      teamIsFetching: false,
      teamIDs: [1,2,3,4],
      leagueIsFetching: false,
      leagueIDs: [],
    }, {
      type: types.SEARCH_CLEAR_TEAM,
    })).toEqual({
      teamIsFetching: false,
      teamIDs: [],
      leagueIsFetching: false,
      leagueIDs: [],
    })
  })

})
