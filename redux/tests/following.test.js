import * as types from '../types/following'
import { followingLeagueIDs, followingTeamIDs } from '../reducers/following'

describe('followingLeagueIDs Reducer', () => {
  it('should return the initial state', () => {
    expect(followingLeagueIDs(undefined, {})).toEqual([])
  })

  it('FOLLOWING_ADD_LEAGUE should insert the specified id into the store', () => {
    expect(followingLeagueIDs(undefined, {
      type: types.FOLLOWING_ADD_LEAGUE,
      leagueID: 5
    })).toEqual([5])

    expect(followingLeagueIDs([5], {
      type: types.FOLLOWING_ADD_LEAGUE,
      leagueID: 10,
    })).toEqual([5,10])
  })

  it('FOLLOWING_REMOVE_LEAGUE should insert the specified id into the store', () => {
    expect(followingLeagueIDs([5], {
      type: types.FOLLOWING_REMOVE_LEAGUE,
      leagueID: 5
    })).toEqual([])

    expect(followingLeagueIDs([10,5], {
      type: types.FOLLOWING_REMOVE_LEAGUE,
      leagueID: 5,
    })).toEqual([10])
  })
})

describe('followingTeamIDs Reducer', () => {
  it('should return the initial state', () => {
    expect(followingTeamIDs(undefined, {})).toEqual([])
  })

  it('FOLLOWING_ADD_TEAM should insert the specified id into the store', () => {
    expect(followingTeamIDs(undefined, {
      type: types.FOLLOWING_ADD_TEAM,
      teamID: 5
    })).toEqual([5])

    expect(followingTeamIDs([5], {
      type: types.FOLLOWING_ADD_TEAM,
      teamID: 10,
    })).toEqual([5,10])
  })

  it('FOLLOWING_REMOVE_TEAM should insert the specified id into the store', () => {
    expect(followingTeamIDs([5], {
      type: types.FOLLOWING_REMOVE_TEAM,
      teamID: 5
    })).toEqual([])

    expect(followingTeamIDs([10,5], {
      type: types.FOLLOWING_REMOVE_TEAM,
      teamID: 5,
    })).toEqual([10])
  })
})
