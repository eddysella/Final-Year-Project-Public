import React,{Component}from 'react';
import { addLeagueToStandings, removeLeagueFromStandings } from '../../../redux/action/creators/creators'
import { connect } from 'react-redux'
import { Screen } from '../../../screens/standings/main/Main'

const mapStateToProps = state => ({
    standingsInOrder: state.standings['standingsInOrder'],
})

const mapDispatchToProps = dispatch => ({

  addLeague: league => dispatch(addLeagueToStandings(league)),
  removeLeague: league => dispatch(removeLeagueFromStandings(league)),
})

const Screen = ({standingsInOrder, addLeague, removeLeague, ...props}) => (
  <Screen standings={standingsInOrder} addLeague={addLeague} removeLeague={removeLeague} navigation={props.navigation}/>
)

export default connect(mapStateToProps,mapDispatchToProps)(Screen);
