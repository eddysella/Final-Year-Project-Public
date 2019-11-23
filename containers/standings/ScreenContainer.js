import React, { PureComponent } from 'react';
import { Button, BackHandler, AsyncStorage, ScrollView, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import SquareGrid from "react-native-square-grid";
import { Avatar } from 'react-native-elements';
import { getLeagueByID } from '../../fetch/League';
import { Screen } from '../../screens/standings/Standings'

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
        if (this.state.isLoading) {
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
