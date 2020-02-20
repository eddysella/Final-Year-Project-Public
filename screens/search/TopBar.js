import React from 'react';
import { View } from 'react-native';
import {SearchBar} from 'react-native-elements';

export const TopBar = props => {

  onChangeText = text => {
    props.update(text)
    props.search(text);
  }

  return (
    <View style={{flex:props.topBarFlex}}>
      <SearchBar
      platform={"android"}
       onChangeText={onChangeText}
       onClear={() => props.clear()}
       placeholder="search Team or League..."
       value={props.input}
      />
    </View>
  );
}
