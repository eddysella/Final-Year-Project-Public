import React,{ Component }from 'react';
import { connect } from 'react-redux'
import { View } from 'react-native'
import { fetchStandings, } from '../../redux/creators/standings'
import { fetchFixtures, } from '../../redux/creators/leagues'
import { Main } from '../../screens/following/Following';

const mapStateToProps = state => ({
    leaguesByID: state.leaguesByID,
    standings: state.standingsSpecific,
)};

const mapDispatchToProps = dispatch => ({
  fetchStandings: fetchStandings,
  fetchFixtures: fetchFixtures,
})

const Screen = ({leaguesByID, standings, fetchStandings, fetchFixtures, ...props}) => (
  <View style={{flex:1}}>
    <Main screenFlex={9} topBarFlex={1} leaguesByID={leaguesByID} standings={standings}
    fetchStandings={fetchStandings} fetchFixtures={fetchFixtures} navigation={props.navigation}/>
  </View>
)

export default connect(mapStateToProps,mapDispatchToProps)(Screen);
