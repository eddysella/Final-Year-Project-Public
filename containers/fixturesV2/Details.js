import React from 'react';
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Main } from '../../screens/fixturesV2/details/Main'
import { Header } from '../../screens/fixturesV2/details/Header'
import { fetchSpecificFixture , } from '../../redux/creators/fixturesSpecific'
import header from '../../screens/styles/header';

const mapStateToProps = state =>({
  fixturesByID: state.fixturesByID,
  fetching: state.fixturesByID['fetching'],
})

const mapDispatchToProps = dispatch => ({
  fetchSpecificFixture: (input) => dispatch(fetchSpecificFixture(input)),
})

const Screen = ({fixturesByID, fetching, fetchSpecificFixture, ...props}) => (
  <View style={{flex:1}}>
    <Header headerFlex={1} fixturesByID={fixturesByID} navigation={props.navigation}/>
    <Main viewFlex={2} screenFlex={9} fetchSpecificFixture={fetchSpecificFixture} topBarFlex={2} fixturesByID={fixturesByID}
    fetching ={fetching} navigation={props.navigation}/>
  </View>
)


Screen.navigationOptions = (props) => ({
  title: props.navigation.getParam('name'),
  headerStyle: header.headerStyle,
  headerTitleStyle: header.headerTitleStyle,
  headerTitleContainerStyle: header.headerTitleContainerStyle,
})

export default connect(mapStateToProps,mapDispatchToProps)(Screen)
