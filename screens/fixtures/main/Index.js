import Screen from '../../../screens/fixtures/main/Main';
import TopBar from '../../../screens/fixtures/main/TopBar';

export const Screen = ({TopBarFlex, ScreenFlexsetFixtures, leagueNames, leagueFixtures}) => {

  return (
    <View style={{flex:1}}>
      <TopBar TopBarFlex={1} setFixtures={setFixtures}/>
      <Screen ScreenFlex={8} navigation={this.props.navigation} leagueNames={leagueNames} leagueFixtures={leagueFixtures}/>
    </View>
  );
}

import Screen from '../../../screens/fixtures/main/Main';
import TopBar from '../../../screens/fixtures/main/TopBar';

export const Screen = ({topBarFlex, screenFlex, setFixtures, leagueNames, leagueFixtures}) => {

  return (
    <View style={{flex:1}}>
      <TopBar TopBarFlex={topBarFlex} setFixtures={setFixtures}/>
      <Screen ScreenFlex={screenFlex} navigation={this.props.navigation} leagueNames={leagueNames} leagueFixtures={leagueFixtures}/>
    </View>
  );
}
