import { ThemeProvider } from 'styled-components/native';
import { Loading } from '@components/Loading';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold
} from '@expo-google-fonts/roboto';

import { StatusBar } from 'react-native';
import theme from './src/theme';

import {Group} from '@screens/Group';

export default function App() {
  const [fontLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  });

  return (
    <ThemeProvider theme={theme}>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {fontLoaded ? <Group /> : <Loading />}
    </ThemeProvider>
  );
}

