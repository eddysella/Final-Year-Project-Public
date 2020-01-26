import React,{ Component }from 'react';
import { connect } from 'react-redux'
import { View } from 'react-native'
import { fetchFixtures, fetchTeams } from '../../redux/creators/leagues'
import { fetchStandings, } from '../../redux/creators/standings'
import { Main } from '../../screens/league/Main';
import { TopBar } from '../../screens/league/TopBar';

const mapStateToProps = state => ({
    leaguesByID: state.leaguesByID,
    teams: state.teamsByID,
    standings: state.standingsSpecific,
)};

const mapDispatchToProps = dispatch => ({
  fetchFixtures: input => dispatch(fetchFixtures(input)),
  fetchTeams: input => dispatch(fetchTeams(input)),
  fetchStandings: input => dispatch(fetchStandings(input)),
})

const Screen = ({leaguesByID, teams, standings, fetchStandings, fetchTeams, fetchFixtures, ...props}) => (
  <View style={{flex:1}}>
    <Main screenFlex={8} topBarFlex={1} leaguesByID={leaguesByID} teams={teams}
    standings={standings} fetchStandings={fetchStandings} fetchTeams={fetchTeams}
    fetchFixtures={fetchFixtures} navigation={props.navigation}/>
  </View>
)

export default connect(mapStateToProps,mapDispatchToProps)(Screen);
