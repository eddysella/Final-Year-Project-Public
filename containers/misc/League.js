import React,{ Component }from 'react';
import { connect } from 'react-redux'
import { View } from 'react-native'
import { fetchFixtures, fetchTeams } from '../../redux/creators/leagues'
import { fetchStandings, } from '../../redux/creators/standings'
import { Main } from '../../screens/league/Main';

const mapStateToProps = state => ({
    leagues: state.leaguesByID,
    teams: state.teamsByID,
    standings: state.standingsSpecific,
    fetchingExtraLeagueData: state.leaguesByID['fetching'],
    fetchingStandings: state.standingsSpecific['isFetching'],
});

const mapDispatchToProps = dispatch => ({
  fetchFixtures: input => dispatch(fetchFixtures(input)),
  fetchTeams: input => dispatch(fetchTeams(input)),
  fetchStandings: input => dispatch(fetchStandings(input)),
})

const Screen = ({leagues, teams, standings, fetchingExtraLeagueData, fetchingStandings, fetchStandings, fetchTeams, fetchFixtures, ...props}) => (
  <View style={{flex:1}}>
    <Main ScreenFlex={7} TopBarFlex={1} leagues={leagues} teams={teams} fetchingExtraLeagueData={fetchingExtraLeagueData}
    fetchingStandings={fetchingStandings} standings={standings} fetchStandings={fetchStandings} fetchTeams={fetchTeams}
    fetchFixtures={fetchFixtures} navigation={props.navigation}/>
  </View>
)

export default connect(mapStateToProps,mapDispatchToProps)(Screen);
