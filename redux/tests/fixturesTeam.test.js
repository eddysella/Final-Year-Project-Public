import * as types from '../types/fixtures'
import { fixtureIDsByTeamID } from '../reducers/fixturesTeam'
const todayTime = 1000;

describe('fixtureIDsByTeamID Reducer', () => {
  it('should return the initial state', () => {
    expect(fixtureIDsByTeamID(undefined, {})).toEqual({})
  })

  it('FIXTURES_INIT_TEAM should initialize a team entity with the specified id', () => {
    expect(fixtureIDsByTeamID(undefined, {
      type: types.FIXTURES_INIT_TEAM,
      teamID: 5,
    })).toEqual({
      5: {
        fetchingFuture: false,
        fetchingPast: false,
        pastFixtures:[],
        todayFixtures: [],
        futureFixtures:[],
        lastPastDate: todayTime,
        lastFutureDate: todayTime,
        nextPastPage: 1,
        nextFuturePage: 1,
      }
    })
  })

  it('FIXTURES_REQUEST_PAST_TEAM should set fetchingPast to true for the specified team', () => {
    expect(fixtureIDsByTeamID({
      5: {
        fetchingFuture: false,
        fetchingPast: false,
        pastFixtures:[],
        todayFixtures: [],
        futureFixtures:[],
        lastPastDate: todayTime,
        lastFutureDate: todayTime,
        nextPastPage: 1,
        nextFuturePage: 1,
      }
    }, {
      type: types.FIXTURES_REQUEST_PAST_TEAM,
      teamID: 5,
    })).toEqual({
      5: {
        fetchingFuture: false,
        fetchingPast: true,
        pastFixtures:[],
        todayFixtures: [],
        futureFixtures:[],
        lastPastDate: todayTime,
        lastFutureDate: todayTime,
        nextPastPage: 1,
        nextFuturePage: 1,
      }
    })
  })

  it('FIXTURES_REQUEST_FUTURE_TEAM should set fetchingFuture to true for the specified team', () => {
    expect(fixtureIDsByTeamID({
      5: {
        fetchingFuture: false,
        fetchingPast: false,
        pastFixtures:[],
        todayFixtures: [],
        futureFixtures:[],
        lastPastDate: todayTime,
        lastFutureDate: todayTime,
        nextPastPage: 1,
        nextFuturePage: 1,
      }
    }, {
      type: types.FIXTURES_REQUEST_FUTURE_TEAM,
      teamID: 5,
    })).toEqual({
      5: {
        fetchingFuture: true,
        fetchingPast: false,
        pastFixtures:[],
        todayFixtures: [],
        futureFixtures:[],
        lastPastDate: todayTime,
        lastFutureDate: todayTime,
        nextPastPage: 1,
        nextFuturePage: 1,
      }
    })
  })

  it('FIXTURES_RECEIVE_PAST_TEAM', () => {
    expect(fixtureIDsByTeamID({
      5: {
        fetchingFuture: false,
        fetchingPast: true,
        pastFixtures:[],
        todayFixtures: [],
        futureFixtures:[],
        lastPastDate: todayTime,
        lastFutureDate: todayTime,
        nextPastPage: 1,
        nextFuturePage: 1,
      }
    }, {
      type: types.FIXTURES_RECEIVE_PAST_TEAM,
      teamID: 5,
      fixtures: [1,2,3,4,5],
      date: 10000,
    })).toEqual({
      5: {
        fetchingFuture: false,
        fetchingPast: false,
        pastFixtures:[5,4,3,2,1],
        todayFixtures: [],
        futureFixtures:[],
        lastPastDate: 10000,
        lastFutureDate: todayTime,
        nextPastPage: 2,
        nextFuturePage: 1,
      }
    })
  })

  it('FIXTURES_RECEIVE_TODAY_TEAM', () => {
    expect(fixtureIDsByTeamID({
      5: {
        fetchingFuture: true,
        fetchingPast: false,
        pastFixtures:[],
        todayFixtures: [],
        futureFixtures:[],
        lastPastDate: todayTime,
        lastFutureDate: todayTime,
        nextPastPage: 1,
        nextFuturePage: 1,
      }
    }, {
      type: types.FIXTURES_RECEIVE_TODAY_TEAM,
      teamID: 5,
      fixtureIDs: [1,2,3,4,5],
    })).toEqual({
      5: {
        fetchingFuture: true,
        fetchingPast: false,
        pastFixtures:[],
        todayFixtures: [1,2,3,4,5],
        futureFixtures:[],
        lastPastDate: todayTime,
        lastFutureDate: todayTime,
        nextPastPage: 1,
        nextFuturePage: 1,
      }
    })
  })

  it('FIXTURES_RECEIVE_FUTURE_TEAM', () => {
    expect(fixtureIDsByTeamID({
      5: {
        fetchingFuture: true,
        fetchingPast: false,
        pastFixtures:[],
        todayFixtures: [],
        futureFixtures:[],
        lastPastDate: todayTime,
        lastFutureDate: todayTime,
        nextPastPage: 1,
        nextFuturePage: 1,
      }
    }, {
      type: types.FIXTURES_RECEIVE_FUTURE_TEAM,
      teamID: 5,
      fixtures: [1,2,3,4,5],
      date: 10000,
    })).toEqual({
      5: {
        fetchingFuture: false,
        fetchingPast: false,
        pastFixtures:[],
        todayFixtures: [],
        futureFixtures:[1,2,3,4,5],
        lastPastDate: todayTime,
        lastFutureDate: 10000,
        nextPastPage: 1,
        nextFuturePage: 2,
      }
    })
  })


})
