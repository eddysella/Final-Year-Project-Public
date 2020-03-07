import * as types from '../types/player'
import { playersByID } from '../reducers/players'

describe('playersByID Reducer', () => {
  it('should return the initial state', () => {
    expect(playersByID(undefined, {})).toEqual({})
  })

  it('PLAYER_RECEIVE_BY_ID should insert the passed player entity into the store', () => {
    expect(playersByID({}, {
        type: types.PLAYER_RECEIVE_BY_ID,
        playerID: 50,
        name: "test",
        age: 35,
        nationality: "Italy",
      })).toEqual({
      50: {
        isFetching: false,
        playerID: 50,
        name: "test",
        age: 35,
        nationality: "Italy",
      }
    })
  })
})
