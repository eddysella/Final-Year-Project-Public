import { combineReducers } from 'redux'
import {fixturesByDate, fixturesTopbarDates, fixturesCurrentDate, specificFixture} from './fixtures'
import {standingsByLeague,} from './standings'

export default combineReducers({
  fixturesTopbarDates,
  fixturesByDate,
  fixturesCurrentDate,
  specificFixture,
  standingsByLeague,
})
