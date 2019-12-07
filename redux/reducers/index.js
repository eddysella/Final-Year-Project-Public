import { combineReducers } from 'redux'
import {fixturesByDate, fixturesTopbarDates, fixturesCurrentDate, specificFixture} from './fixtures'

export default combineReducers({
  fixturesTopbarDates,
  fixturesByDate,
  fixturesCurrentDate,
  specificFixture,
})
