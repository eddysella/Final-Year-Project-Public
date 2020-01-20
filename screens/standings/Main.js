import React, { PureComponent } from 'react';
import { Button, View, Text, ActivityIndicator} from 'react-native';
import SquareGrid from "react-native-square-grid";
import { Avatar } from 'react-native-elements';

export const Screen = props => {

    function renderItem(item, index) {
        return (
            <View style={{borderWidth: 3, margin: 5, padding: 10, alignItems: 'center',  alignSelf: 'stretch'}}>
                <Avatar
                    size = 'large'
                    source={{ uri: `${item.logo}`}}
                    rounded
                />
                <Text h3>
                    {item.name}
                </Text>
            </View>
        );

        // <Button
        //     title="Go to Details"
        //     onPress={() => props.navigation.navigate('Inner')}
        // />
    }

    return (
        <View style={{flex:1}}>
            <SquareGrid
                rows={0}
                columns={3}
                items={props.leaguesList}
                renderItem={renderItem}
            />
        </View>
    );
}


//get seasons available from leagueID then get newest one
