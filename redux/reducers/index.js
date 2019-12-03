import { combineReducers } from 'redux'
import {fixturesByDate, fixturesTopbarDates} from './fixtures'

export default combineReducers({
  fixturesTopbarDates,
  fixturesByDate
})
