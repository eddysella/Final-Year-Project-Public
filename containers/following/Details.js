import React, { PureComponent } from 'react';
import { View, ActivityIndicator  } from 'react-native'
import { setTab } from '../../../redux/action/creators/creators'
import { connect } from 'react-redux'
import { TopBar } from '../../../screens/fixtures/details/TopBar'
import { Details }  from '../../../screens/fixtures/details/Details'

const mapStateToProps = state =>({
  topBar: state.specificFixture['topBar'],
  screen: state.specificFixture['screen'],
  tabDisplayed: state.specificFixture['tabDisplayed'],
  fetching: state.specificFixture['fetching'],
})

const mapDispatchToProps = dispatch => ({
  setTab: tab => dispatch(setTab(tab)),
})

const Screen = ({topBar, screen, tabDisplayed, setTab, fetching, ...props}) => (
  <View style={{ flex: 1}}>
      <TopBar TopBarFlex={1} currentTab={tabDisplayed} setTab={setTab} data={topBar}/>
      <Details ScreenFlex={3} currentTab={tabDisplayed} data={screen}/>
  </View>
)

export default connect(mapStateToProps, mapDispatchToProps)(Screen)
