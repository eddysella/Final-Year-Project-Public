import React, { Component } from 'react'
import { AsyncStorage, FlatList, ScrollView, StyleSheet, View, StatusBar, ActivityIndicator} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { SearchBar, ListItem} from 'react-native-elements';
import { MaterialIndicator,} from 'react-native-indicators';

export const Screen = props => {

    return (
     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
       <MaterialIndicator />
    </View>
    );
}
