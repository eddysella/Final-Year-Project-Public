import React,{ Component }from 'react';
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Main } from '../../screens/following/Following';

const mapStateToProps = state => ({
    teams: state.teamsByID,
    playerStats: state.playerStatsByID,
)};

const Screen = ({teams, playerStats, ...props}) => (
  <View style={{flex:1}}>
    <Main screenFlex={9} topBarFlex={1} teams={teams} playerStats={playerStats}
    navigation={props.navigation}/>
  </View>
)


export default connect(mapStateToProps,mapDispatchToProps)(Screen);
