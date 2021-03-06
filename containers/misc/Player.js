import React from 'react';
import { connect } from 'react-redux'
import { Main } from '../../screens/player/Main';
import { fetchPlayerStatistics, } from '../../redux/creators/statistics'
import header from '../../screens/styles/header';

const mapStateToProps = state => ({
  playerStats: state.playerStatsByID,
  players: state.playersByID,
  fetching: state.playerStatsByID['fetching'],
});

const mapDispatchToProps = dispatch => ({
  fetchStatistics: input => dispatch(fetchPlayerStatistics(input)),
})

const Screen = ({fetchStatistics, fetching, players, playerStats, ...props}) => (
  <Main screenFlex={1} playerStats={playerStats}
  fetchStatistics={fetchStatistics} players={players} fetching={fetching} navigation={props.navigation}/>
)

Screen.navigationOptions = (props) => ({
  title: props.navigation.getParam('name'),
  headerStyle: header.headerStyle,
  headerTitleStyle: header.headerTitleStyle,
  headerTitleContainerStyle: header.headerTitleContainerStyle,
})

export default connect(mapStateToProps, mapDispatchToProps)(Screen);
