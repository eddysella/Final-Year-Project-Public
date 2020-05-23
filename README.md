The Repo of my final year project for BSc at the University of Sussex in Brighton, UK.

#Compilation Guide

Dependencies:

    "@expo/samples": "~3.0.3",
    "@expo/vector-icons": "^10.0.3",
    "@react-navigation/web": "^1.0.0-alpha.9",
    "array-sort-by": "^1.2.1",
    "deepmerge": "^4.2.2",
    "expo": "^35.0.0",
    "expo-asset": "^7.0.0",
    "expo-constants": "^7.0.0",
    "expo-font": "^7.0.0",
    "expo-web-browser": "^7.0.0",
    "nachos-ui": "^0.2.0-beta.1",
    "object-hash": "^2.0.1",
    "react": "16.8.3",
    "react-dom": "16.8.3",
    "react-horizontal-scrolling-menu": "^0.7.3",
    "react-infinite-scroll-component": "^5.0.4",
    "react-native": "https://github.com/expo/react-native/archive/sdk-35.0.0.tar.gz",
    "react-native-elements": "^1.2.7",
    "react-native-gesture-handler": "~1.3.0",
    "react-native-indicators": "^0.17.0",
    "react-native-parallax-header": "^1.1.3",
    "react-native-restart": "0.0.14",
    "react-native-size-matters": "^0.2.1",
    "react-native-square-grid": "^1.0.5",
    "react-native-super-grid": "^3.1.2",
    "react-native-svg": "9.9.5",
    "react-native-table-component": "^1.2.1",
    "react-native-web": "^0.11.7",
    "react-navigation": "^3.12.0",
    "react-redux": "^7.1.3",
    "redux": "^4.0.5",
    "redux-thunk": "^2.3.0"
    
For the application to work a subscription must be made to the following API to receive an authentication key. A 'PRO' subscription is preferable but not necessary. 

****
BE CAREFUL AS THERE ARE NO RESTRICTIONS ON THE NUMBER OF API CALLS ALLOWED AND YOU WILL BE CHARGED FOR GOING OVER THE QUOTA!!!
****

The key must be inserted into a file called authorizationKey.js in the directory "Fetch" in the following template:

-----------------------------------------------------------

const dict = {
  key : *INSERT KEY HERE*,
}
export default dict

-----------------------------------------------------------

Once this is done the application can be run from an EXPO terminal, i.e. expo start *project*

#Usage Guide

![PDF1](https://github.com/eddysella/Final-Year-Project-Public/blob/fixturesV2/readmeImages/one-1.jpg)
![PDF2](https://github.com/eddysella/Final-Year-Project-Public/blob/fixturesV2/readmeImages/two-1.jpg)
