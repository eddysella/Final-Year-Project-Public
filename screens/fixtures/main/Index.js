import React,{Component} from 'react'
import {View} from 'react-native'
import {TopBar} from './TopBar';
import {Main} from './Main';

export const Screen = ({setFixtures, dates, leagueNames, fixturesInOrder}) => (
  <View style={{flex:1}}>
    <TopBar topBarFlex={1} setFixtures={setFixtures} dates={dates}/>
    <Main screenFlex={8} leagueNames={leagueNames} leagueFixtures={fixturesInOrder}/>
  </View>
)
