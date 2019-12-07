import { combineReducers } from 'redux'
import {fixturesByDate, fixturesTopbarDates, fixturesCurrentDate} from './fixtures'

export default combineReducers({
  fixturesTopbarDates,
  fixturesByDate,
  fixturesCurrentDate,
})
