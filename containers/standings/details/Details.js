import React,{Component}from 'react';
import { connect } from 'react-redux'
import { Screen } from '../../../screens/standings/details/Details'

const mapStateToProps = state => ({
    standingsInOrder: state.specificStandings['standingsInOrder'],
    teamNames: state.specificStandings['teamNames'],
})

const Screen = ({standingsInOrder, teamNames, ...props}) => (
  <Screen standings={standingsInOrder} teamNames={teamNames} navigation={props.navigation}/>
)

export default connect(mapStateToProps,mapDispatchToProps)(Screen);
