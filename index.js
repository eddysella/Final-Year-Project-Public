import React, { Component } from 'react';

import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers/index'
import { setFixtureDates, initCurrentDate, setTodaysFixtures } from './redux/action/creators/creators'

import App from './App'

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
  )
)

store.dispatch(setFixtureDates());
store.dispatch(initCurrentDate());
// store.dispatch(setTodaysFixtures());
// console.log(store.getState());


export default class Index extends Component{
  render(){
    return(

      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
    );
  }
}
