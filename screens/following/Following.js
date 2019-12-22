import React, {Component} from 'react';
import { ExpoConfigView } from '@expo/samples';

export default function FollowingScreen() {
  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
  return <ExpoConfigView />;
}

FollowingScreen.navigationOptions = {
  title: 'Follow',
};



// import React, {Component} from 'react';
// import { ExpoConfigView } from '@expo/samples';
// import {TouchableHighlight, BackHandler, AsyncStorage, FlatList, View, ActivityIndicator, Text, Dimensions, Button } from 'react-native';
// import {Card, Avatar} from 'react-native-elements';
// import SquareGrid from "react-native-square-grid";
// import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
//
// const screenWidth = Math.round(Dimensions.get('window').width);
// const screenHeight = Math.round(Dimensions.get('window').height);
//
// export const Screen = props => {
//
//     function renderItem(item, index) {
//         return (
//             <View style={{borderWidth: 3, margin: 5, padding: 10, alignItems: 'center',  alignSelf: 'stretch'}}>
//                 <Avatar
//                     size = 'large'
//                     source={{ uri: `${item.logo}`}}
//                     rounded
//                 />
//                 <Text h3>
//                     {item.name}
//                 </Text>
//             </View>
//         );
//     }
//
//   function renderCards(data) {
//       return (
//           <Card title={data.title}>
//           {
//               <View key={data.title} style={{justifyContent: 'center', alignItems: 'center'}}>
//                 <SquareGrid
//                     rows={0}
//                     columns={3}
//                     items={data.items}
//                     renderItem={renderItem}
//                 />
//               </View>
//           }
//           </Card>
//       );
//   };
//
//     return (
//         <View style={{flex:1}}>
//           <FlatList
//           // showsVerticalScrollIndicator={false}
//           data={props.leaguesAndTeams}
//           renderItem={renderCards}
//           keyExtractor={(item,index) =>  index.toString()}
//           />
//         </View>
//     );
// }
//
//
// //get seasons available from leagueID then get newest one
