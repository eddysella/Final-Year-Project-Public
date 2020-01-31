import React,{ Component }from 'react';
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Main } from '../../screens/player/Main';
import { fetchPlayerStatistics, } from '../../redux/creators/statistics'

const mapStateToProps = state => ({
  playerStats: state.playerStatsByID,
  players: state.playersByID,
  fetching: state.playerStatsByID['fetching'],
});

const mapDispatchToProps = dispatch => ({
  fetchStatistics: input => dispatch(fetchPlayerStatistics(input)),
})

const Screen = ({fetchStatistics, fetching, players, playerStats, ...props}) => (
  <Main screenFlex={9} topBarFlex={1} playerStats={playerStats}
  fetchStatistics={fetchStatistics} players={players} fetching={fetching} navigation={props.navigation}/>
)

export default connect(mapStateToProps, mapDispatchToProps)(Screen);
