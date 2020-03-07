import * as types from '../types/statistics'
import { playerStatsByID } from '../reducers/statistics'

describe('playerStatsByID Reducer', () => {
  it('should return the initial state', () => {
    expect(playerStatsByID(undefined, {})).toEqual({fetching: false})
  })

  it('STATS_REQUEST_BY_PLAYER_ID should set fetching to true', () => {
    expect(playerStatsByID({fetching: false}, {
      type: types.STATS_REQUEST_BY_PLAYER_ID,
    })).toEqual({fetching: true})
  })

  it('STATS_RECEIVE_BY_PLAYER_ID should merge an Object of player entities into the store', () => {
    expect(playerStatsByID({fetching: true}, {
      type: types.STATS_RECEIVE_BY_PLAYER_ID,
      stats: {
        5: {
          stat1: "stat",
          stat2: "stat"
        },
        10: {
          stat1: "stat",
          stat2: "stat"
        },
        15: {
          stat1: "stat",
          stat2: "stat"
        }
      }
    })).toEqual({
      fetching: false,
      5: {
        stat1: "stat",
        stat2: "stat"
      },
      10: {
        stat1: "stat",
        stat2: "stat"
      },
      15: {
        stat1: "stat",
        stat2: "stat"
      }
    })
  })
})
