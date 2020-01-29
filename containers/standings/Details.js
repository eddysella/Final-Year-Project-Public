import React,{Component}from 'react';
import { connect } from 'react-redux'
import { View } from '../../screens/standings/details/Main'

const mapStateToProps = state => ({
  standingsInOrder: state.specificStandings['standingsInOrder'],
  teamNames: state.specificStandings['teamNames'],
})

const Screen = ({standingsInOrder, teamNames, ...props}) => (
  <View standings={standingsInOrder} teamNames={teamNames} navigation={props.navigation}/>
)

export default connect(mapStateToProps)(Screen);
