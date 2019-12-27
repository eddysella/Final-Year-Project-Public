import React,{Component}from 'react';
import { addLeagueToStandings, removeLeagueFromStandings } from '../../../redux/action/creators/creators'
import { connect } from 'react-redux'
import { Screen } from '../../../screens/standings/main/Main'

const mapStateToProps = state => ({
    leagues: state.standings['leagues'],
    standingsInOrder: state.standings['standingsInOrder'],
})

const mapDispatchToProps = dispatch => ({

  addLeague: league => dispatch(addLeagueToStandings(league)),
  removeLeague: league => dispatch(removeLeagueFromStandings(league)),
})

const Screen = ({fetchSpecificFixture, setFixtures, dates, leagueNames, fixturesInOrder, ...props}) => (
  <Screen leagueID={leagues}
)


export default connect(mapStateToProps,mapDispatchToProps)(Screen);

export default class Container extends PureComponent {
    constructor(props){
        super(props);
    }

    state = {
        loading: true,
        leaguesList: [],
    }

    static navigationOptions = {
        headerTitle: 'Standings',
        headerRight:
          <Button
            onPress={() => alert('This is a button!')}
            title="Edit"
            color="black"
          />
        ,
      };

    async componentDidMount() {
        try {
            const arr = await AsyncStorage.getItem( 'PREFSTANDINGS' );
            console.log( "Im getting called" );
            if ( value !== null ) {
                console.log( "Found saved standings" );
                let collect = [];
                for ( value in JSON.parse( arr ) ) {
                    getLeagueByID( value ).then( data => collect.push(data));
                }
                this.setState({
                    leaguesList: collect,
                    loading: false,
                });
            }
        } catch ( e ) {
            try {
                console.log( "Init default standings" );
                await AsyncStorage.setItem( 'PREFSTANDINGS', JSON.stringify( [ 1 ] ) );
                console.log( 'retrievingData' );
                getLeagueByID( '1' ).then( data =>
                    this.setState( {
                        leaguesList: data,
                        loading: false,
                    } )
                );
            } catch ( error ) {
                // Error saving data
            }
        }
    }

    render(){
        if (this.state.loading) {
            return (
                <View style={{ flex: 1}}>
                    <ActivityIndicator />
                </View>
            );
        }else{
            return <Screen leaguesList={this.state.leaguesList} navigation={this.props.navigation} />;
        }
    }
}
