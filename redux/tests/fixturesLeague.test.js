import * as types from '../types/fixtures'
import { fixtureIDsByLeagueID } from '../reducers/fixturesLeague'

const todayTime = 1000;
const yesterdayTime = 999;
// **CHANGE THE VALUES IN THE MAIN FILE TO MAKE TESTS PASS**

describe('fixtureIDsByLeagueID Reducer', () => {
  it('should return the initial state', () => {
    expect(fixtureIDsByLeagueID(undefined, {})).toEqual({})
  })

  it("FIXTURES_INIT_LEAGUE initializes an entity in the store for the passed leagueID", () => {
    expect(fixtureIDsByLeagueID({},{
      type: types.FIXTURES_INIT_LEAGUE,
      leagueID: 10,
    })).toEqual({
      10: {
        fetchingFuture: false,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{},
        lastPastDate: todayTime,
        lastFutureDate: yesterdayTime,
      }
    })
  })

  it("FIXTURES_RESET_FUTURE_LEAGUE_FETCH should set fetchingFuture to false", () => {
    expect(fixtureIDsByLeagueID({
      10: {
        fetchingFuture: true,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{},
        lastPastDate: todayTime,
        lastFutureDate: yesterdayTime,
      }
    },{
      type: types.FIXTURES_RESET_FUTURE_LEAGUE_FETCH,
      leagueID: 10,
    })).toEqual({
      10: {
        fetchingFuture: false,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{},
        lastPastDate: todayTime,
        lastFutureDate: yesterdayTime,
      }
    })
  })

  it("FIXTURES_RESET_PAST_LEAGUE_FETCH should set fetchingPast to false", () => {
    expect(fixtureIDsByLeagueID({
      10: {
        fetchingFuture: false,
        fetchingPast: true,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{},
        lastPastDate: todayTime,
        lastFutureDate: yesterdayTime,
      }
    },{
      type: types.FIXTURES_RESET_PAST_LEAGUE_FETCH,
      leagueID: 10,
    })).toEqual({
      10: {
        fetchingFuture: false,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{},
        lastPastDate: todayTime,
        lastFutureDate: yesterdayTime,
      }
    })
  })

  it("FIXTURES_REQUEST_PAST_LEAGUE should set fetchingPast to true", () => {
    expect(fixtureIDsByLeagueID({
      10: {
        fetchingFuture: false,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{},
        lastPastDate: todayTime,
        lastFutureDate: yesterdayTime,
      }
    },{
      type: types.FIXTURES_REQUEST_PAST_LEAGUE,
      leagueID: 10,
    })).toEqual({
      10: {
        fetchingFuture: false,
        fetchingPast: true,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{},
        lastPastDate: todayTime,
        lastFutureDate: yesterdayTime,
      }
    })
  })

  it("FIXTURES_REQUEST_FUTURE_LEAGUE should set fetchingFuture to true ", () => {
    expect(fixtureIDsByLeagueID({
      10: {
        fetchingFuture: false,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{},
        lastPastDate: todayTime,
        lastFutureDate: yesterdayTime,
      }
    },{
      type: types.FIXTURES_REQUEST_FUTURE_LEAGUE,
      leagueID: 10,
    })).toEqual({
      10: {
        fetchingFuture: true,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{},
        lastPastDate: todayTime,
        lastFutureDate: yesterdayTime,
      }
    })
  })

  it("FIXTURES_RECEIVE_TODAY_LEAGUE adds a set of fixtureIDs for the specified league for today, updates lastFutureDate with new date", () => {
    expect(fixtureIDsByLeagueID({
      10: {
        fetchingFuture: false,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{},
        lastPastDate: todayTime,
        lastFutureDate: yesterdayTime,
      }
    },{
      type: types.FIXTURES_RECEIVE_TODAY_LEAGUE,
      leagueID: 10,
      fixtureIDs: [1,2,3,4,5],
      date: 10000,
    })).toEqual({
      10: {
        fetchingFuture: false,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[],
        todayFixtures: [1,2,3,4,5],
        futureDates:[],
        fixturesByDate:{},
        lastPastDate: todayTime,
        lastFutureDate: 10000,
      }
    })
  })

  it("FIXTURES_RECEIVE_PAST_LEAGUE", () => {
    expect(fixtureIDsByLeagueID({
      10: {
        fetchingFuture: false,
        fetchingPast: true,
        shouldFetchPast: true,
        shouldFetchFuture: false,
        pastDates:[],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{},
        lastPastDate: todayTime,
        lastFutureDate: yesterdayTime,
      }
    },{
      type: types.FIXTURES_RECEIVE_PAST_LEAGUE,
      leagueID: 10,
      fixtures: {
        10000 : [1,2,3,4,5]
      },
      date: 10000,
    })).toEqual({
      10: {
        fetchingFuture: false,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[10000],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{
          10000: [1,2,3,4,5]
        },
        lastPastDate: 10000,
        lastFutureDate: yesterdayTime,
      }
    })

    expect(fixtureIDsByLeagueID({
      10: {
        fetchingFuture: false,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[10000],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{
          10000: [1,2,3,4,5]
        },
        lastPastDate: 10000,
        lastFutureDate: yesterdayTime,
      },
      20: {
        fetchingFuture: false,
        fetchingPast: true,
        shouldFetchPast: true,
        shouldFetchFuture: false,
        pastDates:[10000],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{
          10000: [1,2,3,4,5]
        },
        lastPastDate: 10000,
        lastFutureDate: yesterdayTime,
      }
    },{
      type: types.FIXTURES_RECEIVE_PAST_LEAGUE,
      leagueID: 20,
      fixtures: {
        20000 : [1,2,3,4,5]
      },
      date: 20000,
    })).toEqual({
      10: {
        fetchingFuture: false,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[10000],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{
          10000: [1,2,3,4,5]
        },
        lastPastDate: 10000,
        lastFutureDate: yesterdayTime,
      },
      20: {
        fetchingFuture: false,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[10000, 20000],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{
          10000: [1,2,3,4,5],
          20000: [1,2,3,4,5],
        },
        lastPastDate: 20000,
        lastFutureDate: yesterdayTime,
      }
    })
  })

  it("FIXTURES_RECEIVE_FUTURE_LEAGUE", () => {
    expect(fixtureIDsByLeagueID({
      10: {
        fetchingFuture: true,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: true,
        pastDates:[],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{},
        lastPastDate: todayTime,
        lastFutureDate: yesterdayTime,
      }
    },{
      type: types.FIXTURES_RECEIVE_FUTURE_LEAGUE,
      leagueID: 10,
      fixtures: {
        10000 : [1,2,3,4,5]
      },
      date: 10000,
    })).toEqual({
      10: {
        fetchingFuture: false,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[],
        todayFixtures: [],
        futureDates:[10000],
        fixturesByDate:{
          10000: [1,2,3,4,5]
        },
        lastPastDate: todayTime,
        lastFutureDate: 10000,
      }
    })

    expect(fixtureIDsByLeagueID({
      10: {
        fetchingFuture: false,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[],
        todayFixtures: [],
        futureDates:[10000],
        fixturesByDate:{
          10000: [1,2,3,4,5]
        },
        lastPastDate: todayTime,
        lastFutureDate: 10000,
      },
      20: {
        fetchingFuture: true,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: true,
        pastDates:[],
        todayFixtures: [],
        futureDates:[10000],
        fixturesByDate:{
          10000: [1,2,3,4,5]
        },
        lastPastDate: todayTime,
        lastFutureDate: 10000,
      }
    },{
      type: types.FIXTURES_RECEIVE_FUTURE_LEAGUE,
      leagueID: 20,
      fixtures: {
        20000 : [1,2,3,4,5]
      },
      date: 20000,
    })).toEqual({
      10: {
        fetchingFuture: false,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[],
        todayFixtures: [],
        futureDates:[10000],
        fixturesByDate:{
          10000: [1,2,3,4,5]
        },
        lastPastDate: todayTime,
        lastFutureDate: 10000,
      },
      20: {
        fetchingFuture: false,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[],
        todayFixtures: [],
        futureDates:[10000, 20000],
        fixturesByDate:{
          10000: [1,2,3,4,5],
          20000: [1,2,3,4,5],
        },
        lastPastDate: todayTime,
        lastFutureDate: 20000,
      }
    })
  })

  it("FIXTURES_SET_SHOULD_FETCH_PAST_LEAGUE_TRUE should set shouldFetchPast to false", () => {
    expect(fixtureIDsByLeagueID({
      10: {
        fetchingFuture: false,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{},
        lastPastDate: todayTime,
        lastFutureDate: yesterdayTime,
      }
    },{
      type: types.FIXTURES_SET_SHOULD_FETCH_PAST_LEAGUE_TRUE,
      leagueID: 10,
    })).toEqual({
      10: {
        fetchingFuture: false,
        fetchingPast: false,
        shouldFetchPast: true,
        shouldFetchFuture: false,
        pastDates:[],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{},
        lastPastDate: todayTime,
        lastFutureDate: yesterdayTime,
      }
    })
  })

  it("FIXTURES_SET_SHOULD_FETCH_FUTURE_LEAGUE_TRUE should set shouldFetchFuture to false", () => {
    expect(fixtureIDsByLeagueID({
      10: {
        fetchingFuture: false,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: false,
        pastDates:[],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{},
        lastPastDate: todayTime,
        lastFutureDate: yesterdayTime,
      }
    },{
      type: types.FIXTURES_SET_SHOULD_FETCH_FUTURE_LEAGUE_TRUE,
      leagueID: 10,
    })).toEqual({
      10: {
        fetchingFuture: false,
        fetchingPast: false,
        shouldFetchPast: false,
        shouldFetchFuture: true,
        pastDates:[],
        todayFixtures: [],
        futureDates:[],
        fixturesByDate:{},
        lastPastDate: todayTime,
        lastFutureDate: yesterdayTime,
      }
    })
  })
})
