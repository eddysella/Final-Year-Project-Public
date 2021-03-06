import React from 'react';
import { fetchFollowingFutureFixtures, } from '../../redux/creators/futureFixtures'
import { fetchFollowingPastFixtures , } from '../../redux/creators/pastFixtures'
import { fetchSpecificFixture , } from '../../redux/creators/fixturesSpecific'
import { connect } from 'react-redux'
import { Main } from '../../screens/fixturesV2/main/Main';
import header from '../../screens/styles/header';

const mapStateToProps = state => ({
    curPastDates: state.fixturesStatus['currentPastDates'],
    curFutureDates: state.fixturesStatus['currentFutureDates'],
    fetchingFuture: state.fixturesStatus['futureFetch'],
    fetchingPast: state.fixturesStatus['pastFetch'],
    fixturesByID: state.fixturesByID,
    fixtureIDs: state.fixtureIDsByDateLeague,
    leaguesByID: state.leaguesByID,
    followedTeams: state.followingTeamIDs,
    followedLeagues: state.followingLeagueIDs,
})

const mapDispatchToProps = dispatch => ({
  fetchSpecificFixture: (input) => dispatch(fetchSpecificFixture(input)),
  fetchMoreFuture: () => dispatch(fetchFollowingFutureFixtures()),
  fetchMorePast: () => dispatch(fetchFollowingPastFixtures()),
})

const Screen = ({curPastDates, curFutureDates, fetchingFuture, fetchingPast,
  fixturesByID, fixtureIDs, fetchSpecificFixture, fetchMorePast,
  fetchMoreFuture, leaguesByID,followedTeams, followedLeagues, ...props}) => (
  <Main topBarFlex={1} screenFlex={7} curPastDates={curPastDates}
  curFutureDates={curFutureDates} fetchSpecificFixture={fetchSpecificFixture}
  followedTeams={followedTeams} followedLeagues={followedLeagues}
  fetchingFuture={fetchingFuture} fetchingPast={fetchingPast}
  fixturesByID={fixturesByID} fixtureIDs={fixtureIDs}
  fetchMorePast={fetchMorePast} fetchMoreFuture={fetchMoreFuture}
  leaguesByID={leaguesByID} navigation={props.navigation}/>
)

Screen.navigationOptions = () => ({
  title: "Fixtures",
  headerStyle: header.headerStyle,
  headerTitleStyle: header.headerTitleStyle,
  headerTitleContainerStyle: header.headerTitleContainerStyle,
})

export default connect(mapStateToProps,mapDispatchToProps)(Screen);
