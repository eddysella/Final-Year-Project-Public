import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers/index'

export default store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
  )
)
