import * as types from '../types/standings'
import { standingsByLeagueID } from '../reducers/standings'

describe('standingsByLeagueID Reducer', () => {
  it('should return the initial state', () => {
    expect(standingsByLeagueID(undefined, {})).toEqual({
      fetching: false,
    })
  })

  it('STANDINGS_REQUEST_BY_LEAGUE_ID should set fetching to true and create an entity referenced by leagueID', () => {
    expect(standingsByLeagueID({
      fetching: false,
    }, {
      type: types.STANDINGS_REQUEST_BY_LEAGUE_ID,
      leagueID: 5,
    })).toEqual({
      fetching: true,
      5: {
        fetching: true,
        lastUpdated: '',
        data: [],
      }
    })
  })

  it('STANDINGS_RECEIVE_BY_LEAGUE_ID should set fetching to false and update the properties of the specified league', () => {
    expect(standingsByLeagueID({
      fetching: true,
      5: {
        fetching: true,
        lastUpdated: '',
        data: [],
      }
    }, {
      type: types.STANDINGS_RECEIVE_BY_LEAGUE_ID,
      leagueID: 5,
      standings: [1,2,3,4,5],
      lastUpdated: 10000,
    })).toEqual({
      fetching: false,
      5: {
        fetching: false,
        lastUpdated: 10000,
        data: [1,2,3,4,5],
      }
    })
  })
})
