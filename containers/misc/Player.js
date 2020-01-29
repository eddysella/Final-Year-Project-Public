import React,{ Component }from 'react';
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Main } from '../../screens/player/Main';

const mapStateToProps = state => ({
  teams: state.teamsByID,
  playerStats: state.playerStatsByID,
)};

const Screen = ({teams, playerStats, ...props}) => (
  <Main screenFlex={9} topBarFlex={1} teams={teams} playerStats={playerStats}
  navigation={props.navigation}/>
)


export default connect(mapStateToProps,mapDispatchToProps)(Screen);
