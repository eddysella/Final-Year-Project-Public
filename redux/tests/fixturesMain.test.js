import * as types from '../types/fixtures'
import { fixturesStatus, pastDates, futureDates, fixtureIDsByDateLeague,
fixturesByID } from '../reducers/fixturesMain'

describe('fixturesStatus Reducer', () => {
  it('should return the initial state', () => {
    expect(fixturesStatus(undefined, {})).toEqual({
        currentFutureDates: [],
        currentPastDates: [],
        pastFetch: false,
        futureFetch: false,
      })
  })

  it('FIXTURES_RESET should reset the curPast+FutureDates', () => {
    expect(
      fixturesStatus(
        {
        currentFutureDates: [1,2,3],
        currentPastDates: [4,5,6],
        pastFetch: false,
        futureFetch: false,
      },{
        type: types.FIXTURES_RESET,
        })
        ).toEqual({
          currentFutureDates: [],
          currentPastDates: [],
          pastFetch: false,
          futureFetch: false,
        })
  })

  it('FIXTURES_REQUEST_PAST should set pastFetch to true', () => {
    expect(
      fixturesStatus(
        {
        currentFutureDates: [10000],
        currentPastDates: [10000],
        pastFetch: false,
        futureFetch: false,
        },{
        type: types.FIXTURES_REQUEST_PAST,
        })
        ).toEqual({
          currentFutureDates: [10000],
          currentPastDates: [10000],
          pastFetch: true,
          futureFetch: false,
        })
  })

  it('FIXTURES_RECEIVE_PAST should set pastFetch to false + update currentPastDates', () => {
    expect(
      fixturesStatus(
        {
        currentFutureDates: [10000],
        currentPastDates: [4,5,6],
        pastFetch: true,
        futureFetch: false,
        },{
        type: types.FIXTURES_RECEIVE_PAST,
        timeStamp: 1000
        })
      ).toEqual({
          currentFutureDates: [10000],
          currentPastDates: [4,5,6,1000],
          pastFetch: false,
          futureFetch: false,
        })
  })

  it('FIXTURES_REQUEST_FUTURE should set futureFetch to true', () => {
    expect(
      fixturesStatus(
        {
        currentFutureDates: [10000],
        currentPastDates: [10000],
        pastFetch: false,
        futureFetch: false,
        },{
        type: types.FIXTURES_REQUEST_FUTURE,
        })
        ).toEqual({
          currentFutureDates: [10000],
          currentPastDates: [10000],
          pastFetch: false,
          futureFetch: true,
        })
  })

  it('FIXTURES_RECEIVE_FUTURE should set futureFetch to false + update currentPastDates', () => {
    expect(
      fixturesStatus(
        {
        currentFutureDates: [4,5,6],
        currentPastDates: [10000],
        pastFetch: false,
        futureFetch: true,
        },{
        type: types.FIXTURES_RECEIVE_FUTURE,
        timeStamp: 1000
        })
      ).toEqual({
          currentFutureDates: [4,5,6,1000],
          currentPastDates: [10000],
          pastFetch: false,
          futureFetch: false,
        })
  })
})

describe('pastDates Reducer', () => {
  it('should return the initial state', () => {
    expect(pastDates(undefined, {})).toEqual([])
  })

  it("FIXTURES_STORE_PAST_DATES should add a date to the store only if it's unique. Dates should be in decreasing order", () => {
    expect(
      pastDates([3],
        {
          type: types.FIXTURES_STORE_PAST_DATES,
          dates: [1,2,3,4,5],
        })
      ).toEqual([5,4,3,2,1])
  })
})

describe('futureDates Reducer', () => {
  it('should return the initial state', () => {
    expect(futureDates(undefined, {})).toEqual([])
  })

  it("FIXTURES_STORE_FUTURE_DATES should add a date to the store only if it's unique. Dates should be in increasing order", () => {
    expect(
      futureDates([3],
        {
          type: types.FIXTURES_STORE_FUTURE_DATES,
          dates: [1,2,3,4,5],
        })
      ).toEqual([1,2,3,4,5])
  })
})

describe('fixtureIDsByDateLeague Reducer', () => {
  it('should return the initial state', () => {
    expect(fixtureIDsByDateLeague(undefined, {})).toEqual({})
  })

  it("FIXTURES_STORE_BY_DATE should store a set of fixtures ref by league ref by date", () => {

    expect(
      fixtureIDsByDateLeague({},
        {
          type: types.FIXTURES_STORE_BY_DATE,
          date: 1000,
          leagueID: 574,
          fixtures: [1,2,3,4,5],
        })
      ).toEqual({
        1000: {
          574: [1,2,3,4,5]
        }
      })

    expect(
      fixtureIDsByDateLeague({
        1000: {
          574: [1,2,3,4,5]
        }
      },
      {
        type: types.FIXTURES_STORE_BY_DATE,
        date: 2000,
        leagueID: 600,
        fixtures: [5,4,3,2,1],
      })
      ).toEqual({
        1000: {
          574: [1,2,3,4,5]
        },
        2000: {
          600: [5,4,3,2,1]
        }
      })
  })
})

describe('fixturesByID Reducer', () => {
  it('should return the initial state', () => {
    expect(fixturesByID(undefined, {})).toEqual({
        fetching: false,
      })
  })

  it("FIXTURES_REQUEST_STATS should set fetching to true", () => {
    expect(
      fixturesByID(undefined,
        {
          type: types.FIXTURES_REQUEST_STATS,
        })
      ).toEqual({
        fetching: true,
      })
  })

  it("FIXTURES_RECEIVE_STATS should set fetching to false and insert a set of stats into a specified fixture", () => {
    expect(
      fixturesByID({
        fetching: false,
        60354: {},
      },
        {
          type: types.FIXTURES_RECEIVE_STATS,
          fixtureID: 60354,
          stats: {
            stat1: "stat",
            stat2: "stat"
          },
        })
      ).toEqual({
        fetching: false,
        60354: {
          stat1: "stat",
          stat2: "stat"
        }
      })

      expect(
        fixturesByID({
          fetching: false,
          60354: {
            stat1: "stat",
            stat2: "stat"
          }
        },
        {
          type: types.FIXTURES_RECEIVE_STATS,
          fixtureID: 600,
          stats: {
            stat3: "stat",
            stat4: "stat"
          },
        })
        ).toEqual({
          fetching: false,
          60354: {
            stat1: "stat",
            stat2: "stat"
          },
          600: {
            stat3: "stat",
            stat4: "stat"
          }
        })
  })

  it("FIXTURES_STORE_BY_ID adds a set of fixture entities to the store ref by ID", () => {
    expect(
      fixturesByID({
        fetching: false
      },
        {
          type: types.FIXTURES_STORE_BY_ID,
          fixtures: {
            5: {},
            10: {},
            20: {},
          },
        })
      ).toEqual({
        fetching: false,
        5: {},
        10: {},
        20: {},
      })
  })
})
