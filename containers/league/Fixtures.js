import React from 'react';
import { fetchFutureLeagueFixtures, setShouldFetchFutureTrue} from '../../redux/creators/futureFixtures'
import { fetchPastLeagueFixtures , setShouldFetchPastTrue} from '../../redux/creators/pastFixtures'
import { fetchSpecificFixture , } from '../../redux/creators/fixturesSpecific'
import { connect } from 'react-redux'
import { Main } from '../../screens/league/Fixtures';


const mapStateToProps = (state, props) => ({
    fetchingPast: state.fixtureIDsByLeagueID[props.leagueID]['fetchingPast'],
    fetchingFuture: state.fixtureIDsByLeagueID[props.leagueID]['fetchingFuture'],
    shouldFetchPast: state.fixtureIDsByLeagueID[props.leagueID]['shouldFetchPast'],
    shouldFetchFuture: state.fixtureIDsByLeagueID[props.leagueID]['shouldFetchFuture'],
    curPastDates: state.fixtureIDsByLeagueID[props.leagueID]['pastDates'],
    todayIDs: state.fixtureIDsByLeagueID[props.leagueID]['todayFixtures'],
    curFutureDates: state.fixtureIDsByLeagueID[props.leagueID]['futureDates'],
    fixturesByID: state.fixturesByID,
    fixturesByDate: state.fixtureIDsByLeagueID[props.leagueID]['fixturesByDate'],
    leagueID: props.leagueID,
})

const mapDispatchToProps = dispatch => ({
  fetchSpecificFixture: (input) => dispatch(fetchSpecificFixture(input)),
  fetchMoreFuture: (input) => dispatch(fetchFutureLeagueFixtures(input, true)),
  fetchMorePast: (input) => dispatch(fetchPastLeagueFixtures(input, true)),
  setShouldFetchPastTrue: () => dispatch(setShouldFetchPastTrue()),
  setShouldFetchFutureTrue: () => dispatch(setShouldFetchFutureTrue()),
})

const Screen = ({curPastDates, curFutureDates, fetchingFuture, fetchingPast,
  fixturesByID, fixtureIDs, fetchSpecificFixture, fetchMorePast,
  fetchMoreFuture, leagueID, todayIDs, fixturesByDate, shouldFetchPast,shouldFetchFuture,
  setShouldFetchFutureTrue, setShouldFetchPastTrue, ...props}) => (
  <Main topBarFlex={1} screenFlex={7} curPastDates={curPastDates}
  curFutureDates={curFutureDates} fetchSpecificFixture={fetchSpecificFixture}
    fetchingFuture={fetchingFuture} fetchingPast={fetchingPast}
    fixturesByID={fixturesByID} fetchMorePast={fetchMorePast}
    leagueID={leagueID} todayIDs={todayIDs} fixturesByDate={fixturesByDate}
    fetchMoreFuture={fetchMoreFuture} shouldFetchPast={shouldFetchPast}
    shouldFetchFuture={shouldFetchFuture} setShouldFetchPastTrue={setShouldFetchPastTrue}
    setShouldFetchFutureTrue={setShouldFetchFutureTrue} navigation={props.navigation}/>
)

export default connect(mapStateToProps,mapDispatchToProps)(Screen);
