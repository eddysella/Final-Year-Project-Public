
import {TopBar} from './TopBar';
import {Main} from './Main';

export const Screen = ({setFixtures, dates, leagueNames, leagueFixtures}) => {

  return (
    <View style={{flex:1}}>
      <TopBar topBarFlex={1} setFixtures={setFixtures} dates={dates}/>
      <Main screenFlex={8} leagueNames={leagueNames} leagueFixtures={leagueFixtures}/>
    </View>
  );
}
