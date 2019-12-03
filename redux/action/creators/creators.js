import * from '../types/types'

export const setFixtureDates = () => ({
  type: 'SET_FIXTURE_DATES',
})

export const getFixturesByDate = date => ({
  type: 'GET_FIXTURES_BY_DATE',
  date: date,
})

export const setFixturesByDate = date => ({
  type: 'SET_FIXTURES_BY_DATE',
  date: date,
})

export const getFixtureByID = id => ({
  type: 'GET_FIXTURE_BY_ID',
  id: id,
})

export const setFixtureByID = fixture => ({
  type: 'SET_FIXTURE_BY_ID',
  fixture: fixture,
})

export const selectFixtureTab = tab => ({
  type: 'SELECT_FIXTURE_TAB',
  tab: tab,
})
