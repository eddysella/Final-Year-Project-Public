import { combineReducers } from 'redux'
import {fixturesByDate, fixturesTopbarDates, currentDate} from './fixtures'

export default combineReducers({
  fixturesTopbarDates,
  fixturesByDate,
  currentDate,
})
