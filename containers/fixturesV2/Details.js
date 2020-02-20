import React, { PureComponent } from 'react';
import { View, ActivityIndicator  } from 'react-native'
import { connect } from 'react-redux'
import { Main } from '../../screens/fixturesV2/details/Main'
import { Header } from '../../screens/fixturesV2/details/Header'

const mapStateToProps = state =>({
  fixturesByID: state.fixturesByID,
  fetching: state.fixturesByID['fetching'],
})


const Screen = ({fixturesByID, fetching, ...props}) => (
  <View style={{flex:1}}>
    <Header headerFlex={2} fixturesByID={fixturesByID} navigation={props.navigation}/>
    <Main viewFlex={5} screenFlex={6} topBarFlex={1} fixturesByID={fixturesByID}
    fetching ={fetching} navigation={props.navigation}/>
  </View>
)

export default connect(mapStateToProps)(Screen)
