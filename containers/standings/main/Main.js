import React,{Component}from 'react';
import { addLeagueToStandings, removeLeagueFromStandings } from '../../../redux/action/creators/creators'
import { connect } from 'react-redux'
import { Screen } from '../../../screens/standings/main/Main'

const mapStateToProps = state => ({
    leagueIDs: state.standingsLeagues,
    leagues: state.leaguesByIDs,
})

const mapDispatchToProps = dispatch => ({
  addLeague: league => dispatch(addLeagueToStandings(league)),
  removeLeague: league => dispatch(removeLeagueFromStandings(league)),
})

const Screen = ({leagueIDs, leagues, addLeagues, removeLeagues, ...props}) => (
  <Screen leagueIDs={leagueIDs} leagues={leagues} addLeagues={addLeagues} removeLeagues={removeLeagues} navigation={props.navigation}/>
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
