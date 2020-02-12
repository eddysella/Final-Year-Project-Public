import React,{ Component }from 'react';
import { fetchFollowingFutureFixtures, } from '../../redux/creators/futureFixtures'
import { fetchFollowingPastFixtures , } from '../../redux/creators/pastFixtures'
import { fetchSpecificFixture , } from '../../redux/creators/fixturesSpecific'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Main } from '../../screens/fixturesV2/main/Main';

const mapStateToProps = state => ({
    curPastDates: state.fixturesStatus['currentPastDates'],
    curFutureDates: state.fixturesStatus['currentFutureDates'],
    futureFetch: state.fixturesStatus['futureFetch'],
    pastFetch: state.fixturesStatus['pastFetch'],
    fixturesByID: state.fixturesByID,
    fixtureIDs: state.fixtureIDsByDateLeague,
})

const mapDispatchToProps = dispatch => ({
  fetchSpecificFixture: (input) => dispatch(fetchSpecificFixture(input)),
  fetchMoreFuture: () => dispatch(fetchFollowingFutureFixtures()),
  fetchMorePast: () => dispatch(fetchFollowingPastFixtures()),
})

// forgot to add functions ^^ !!!!!!!!
const Screen = ({curPastDates, curFutureDates, futureFetch, pastFetch,
  fixturesByID, fixtureIDs, fetchSpecificFixture, ...props}) => (
  <Main topBarFlex={1} screenFlex={7} curPastDates={curPastDates}
  curFutureDates={curFutureDates} fetchSpecificFixture={fetchSpecificFixture}
    futureFetch={futureFetch} pastFetch={pastFetch}
    fixturesByID={fixturesByID} fixtureIDs={fixtureIDs}
    navigation={props.navigation}/>
)


export default connect(mapStateToProps,mapDispatchToProps)(Screen);
