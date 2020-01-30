import React, { PureComponent } from 'react';
import { View, ActivityIndicator  } from 'react-native'
import { connect } from 'react-redux'
import { TopBar } from '../../screens/fixtures/details/TopBar'
import { Details }  from '../../screens/fixtures/details/Main'

const mapStateToProps = state =>({
  topBar: state.fixturesSpecific['topBar'],
  screen: state.fixturesSpecific['screen'],
  fetching: state.fixturesSpecific['fetching'],
})

const Screen = ({topBar, screen, fetching, ...props}) => (
    <Details fetching={fetching} screenFlex={5} topBarFlex={2} topBar={topBar}
    screen={screen} />
)

export default connect(mapStateToProps)(Screen)
