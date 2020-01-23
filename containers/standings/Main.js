import React,{Component}from 'react';
import { removeLeagueFromStandings, fetchStandings } from '../../redux/creators/standings'
import { connect } from 'react-redux'
import { View } from '../../screens/standings/main/Main'

const mapStateToProps = state => ({
    leagueIDs: state.standingsLeagueIDs,
    leagues: state.leaguesByID,
})

const mapDispatchToProps = dispatch => ({
  fetchStandings: league => dispatch( fetchStandings(league)),
  removeLeague: league => dispatch( removeLeagueFromStandings(league)),
})

const Screen = ({leagueIDs, leagues, removeLeague, fetchStandings, ...props}) => (
  <View leagueIDs={leagueIDs} leagues={leagues} fetchStandings={fetchStandings} removeLeague={removeLeague} navigation={props.navigation}/>
)

export default connect(mapStateToProps,mapDispatchToProps)(Screen);
