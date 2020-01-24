import React, { PureComponent } from 'react';
import { View, ActivityIndicator  } from 'react-native'
import { setTab } from '../../redux/creators/fixturesSpecific'
import { connect } from 'react-redux'
import { TopBar } from '../../screens/fixtures/details/TopBar'
import { Details }  from '../../screens/fixtures/details/Main'

const mapStateToProps = state =>({
  topBar: state.fixturesSpecific['topBar'],
  screen: state.fixturesSpecific['screen'],
  tabDisplayed: state.fixturesSpecific['tabDisplayed'],
  fetching: state.fixturesSpecific['fetching'],
})

const mapDispatchToProps = dispatch => ({
  setTab: tab => dispatch(setTab(tab)),
})

const Screen = ({topBar, screen, tabDisplayed, setTab, fetching, ...props}) => (
  <View style={{ flex: 1}}>
      <TopBar TopBarFlex={2} currentTab={tabDisplayed} setTab={setTab} data={topBar}/>
      <Details ScreenFlex={5} currentTab={tabDisplayed} data={screen}/>
  </View>
)

export default connect(mapStateToProps, mapDispatchToProps)(Screen)
