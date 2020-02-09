import React,{ Component }from 'react';
import { fetchFollowingFutureFixtures, } from '../../redux/creators/futureFixtures'
import { fetchFollowingPastFixtures , } from '../../redux/creators/pastFixtures'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Main } from '../../screens/fixtures/main/Main';

const mapStateToProps = state => ({
    curPastDates: state.fixturesStatus['currentPastDates'],
    curFutureDates: state.fixturesStatus['currentFutureDates'],
    futureFetch: state.fixturesStatus['futureFetch'],
    pastFetch: state.fixturesStatus['pastFetch'],
    fixturesByID: state.fixturesByID,
    fixtureIDs: state.fixturesIDsByDateLeague,
})

const mapDispatchToProps = dispatch => ({
  fetchMoreFuture: () => dispatch(fetchFollowingFutureFixtures()),
  fetchMorePast: () => dispatch(fetchFollowingPastFixtures()),
})

const Screen = ({curPastDates, curFutureDates, futureFetch, pastFetch,
  fixturesByID, fixtureIDs, ...props}) => (
  <Main topBarFlex={1} screenFlex={7} curPastDates={curPastDates}
    futureFetch={futureFetch} pastFetch={pastFetch}
    fixturesByID={fixturesByID} fixtureIDs={fixtureIDs}
    navigation={props.navigation}/>
)


export default connect(mapStateToProps,mapDispatchToProps)(Screen);
