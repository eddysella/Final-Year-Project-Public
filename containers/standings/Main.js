import React,{Component}from 'react';
import { removeLeagueFromStandings, fetchStandings } from '../../redux/creators/standings'
import { connect } from 'react-redux'
import { View } from '../../screens/standings/main/Main'

const mapStateToProps = state => ({
    leagueIDs: state.standingsLeagueIDs,
    leagues: state.leaguesByID,
})

const mapDispatchToProps = dispatch => ({
  fetchStandings: league => dispatch( fetchStandings(league)),
  removeLeague: league => dispatch( removeLeagueFromStandings(league)),
})

const Screen = ({leagueIDs, leagues, removeLeague, fetchStandings, ...props}) => (
  <View leagueIDs={leagueIDs} leagues={leagues} fetchStandings={fetchStandings} removeLeague={removeLeague} navigation={props.navigation}/>
)

export default connect(mapStateToProps,mapDispatchToProps)(Screen);

    //
    // async componentDidMount() {
    //     try {
    //         const arr = await AsyncStorage.getItem( 'PREFSTANDINGS' );
    //         console.log( "Im getting called" );
    //         if ( value !== null ) {
    //             console.log( "Found saved standings" );
    //             let collect = [];
    //             for ( value in JSON.parse( arr ) ) {
    //                 getLeagueByID( value ).then( data => collect.push(data));
    //             }
    //             this.setState({
    //                 leaguesList: collect,
    //                 loading: false,
    //             });
    //         }
    //     } catch ( e ) {
    //         try {
    //             console.log( "Init default standings" );
    //             await AsyncStorage.setItem( 'PREFSTANDINGS', JSON.stringify( [ 1 ] ) );
    //             console.log( 'retrievingData' );
    //             getLeagueByID( '1' ).then( data =>
    //                 this.setState( {
    //                     leaguesList: data,
    //                     loading: false,
    //                 } )
    //             );
    //         } catch ( error ) {
    //             // Error saving data
    //         }
    //     }
    // }
