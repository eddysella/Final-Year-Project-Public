import React,{ Component }from 'react';
import { fetchFutureTeamFixtures} from '../../redux/creators/futureFixtures'
import { fetchPastTeamFixtures} from '../../redux/creators/pastFixtures'
import { fetchSpecificFixture , } from '../../redux/creators/fixturesSpecific'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Main } from '../../screens/team/Fixtures';


const mapStateToProps = (state, props) => ({
    fetchingPast: state.fixtureIDsByTeamID[props.teamID]['fetchingPast'],
    fetchingFuture: state.fixtureIDsByTeamID[props.teamID]['fetchingFuture'],
    pastFixtureIDs: state.fixtureIDsByTeamID[props.teamID]['pastFixtures'],
    todayIDs: state.fixtureIDsByTeamID[props.teamID]['todayFixtures'],
    futureFixtureIDs: state.fixtureIDsByTeamID[props.teamID]['futureFixtures'],
    fixturesByID: state.fixturesByID,
    teamID: props.teamID,
})

const mapDispatchToProps = dispatch => ({
  fetchSpecificFixture: (input) => dispatch(fetchSpecificFixture(input)),
  fetchMoreFuture: (input) => dispatch(fetchFutureTeamFixtures(input, true)),
  fetchMorePast: (input) => dispatch(fetchPastTeamFixtures(input, true)),
})

const Screen = ({pastFixtureIDs, futureFixtureIDs, fetchingFuture, fetchingPast,
  fixturesByID, fetchSpecificFixture, fetchMorePast,
  fetchMoreFuture, teamID, todayIDs, ...props}) => (
  <Main topBarFlex={1} screenFlex={7} pastFixtureIDs={pastFixtureIDs}
  futureFixtureIDs={futureFixtureIDs} fetchSpecificFixture={fetchSpecificFixture}
    fetchingFuture={fetchingFuture} fetchingPast={fetchingPast}
    fixturesByID={fixturesByID}
    teamID={teamID} todayIDs={todayIDs}
    fetchMoreFuture={fetchMoreFuture} fetchMorePast={fetchMorePast}  navigation={props.navigation}/>
)


export default connect(mapStateToProps,mapDispatchToProps)(Screen);
