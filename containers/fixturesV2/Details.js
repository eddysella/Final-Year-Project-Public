import React from 'react';
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Main } from '../../screens/fixturesV2/details/Main'
import { Header } from '../../screens/fixturesV2/details/Header'

const mapStateToProps = state =>({
  fixturesByID: state.fixturesByID,
  fetching: state.fixturesByID['fetching'],
})

const Screen = ({fixturesByID, fetching, ...props}) => (
  <View style={{flex:1}}>
    <Header headerFlex={1} fixturesByID={fixturesByID} navigation={props.navigation}/>
    <Main viewFlex={2} screenFlex={9} topBarFlex={2} fixturesByID={fixturesByID}
    fetching ={fetching} navigation={props.navigation}/>
  </View>
)


Screen.navigationOptions = (props) => ({
  title: props.navigation.getParam('name')
})

export default connect(mapStateToProps)(Screen)
