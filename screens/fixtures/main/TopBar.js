import React, {Component} from 'react';
import { TouchableHighlight, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import SquareGrid from "react-native-square-grid";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const itemWidth = scale(screenWidth/5) - scale(3);
const itemHorizontalPadding = (itemWidth/5);
const itemVerticalPadding = scale(15);

export const TopBar = props => {
  function renderItem(item) {
    leftBorder = 0;
    rightBorder = 0;
    if(item.index == 0){
      leftBorder = 3
    }
    if(item.index == 10){
      rightBorder = 3
    }
    return (
        <TouchableHighlight onPress={() => {
            props.setFixtures(item.item);
            goIndex(item.index);
        }}>
        <View style={{width: itemWidth, borderBottomWidth:scale(3), borderTopWidth: scale(3),  borderLeftWidth: leftBorder, borderRightWidth: rightBorder, paddingHorizontal: itemHorizontalPadding, paddingVertical: itemVerticalPadding, justifyContent: 'center', alignItems: 'center'}}>
          <Text> {item.item} </Text>
        </View>
      </TouchableHighlight>
    );
  };

  function flatListItemSeparator(){
    return (
      <View
        style={{
          height: '100%',
          width: scale(3),
          backgroundColor: "#000",
        }}
      />
    );
  };


  return (
    <View style={{flex:props.topBarFlex}} onLayout={() => {goIndex(5)}} >
      <FlatList
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={flatListItemSeparator}
        // initialScrollIndex={4}
        horizontal
        ref={ref => {
            this.flatList_Ref = ref;  // <------ ADD Ref for the Flatlist
        }}
        data={props.dates}
        renderItem={renderItem}
        keyExtractor={(item,index) => index.toString()}
      />
    </View>
  );
}

goIndex = (index) => {
 this.flatList_Ref.scrollToIndex({animated: false,index:index,viewPosition:0.5});
};
