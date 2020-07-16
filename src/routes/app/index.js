import { createAppContainer } from 'react-navigation';
import { enableScreens } from 'react-native-screens';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

enableScreens();

//Screens
import Home from '../../screens/app/home';
import Details from '../../screens/app/details';

const appStackNavigator = createSharedElementStackNavigator(
  {
    Home: { screen: Home },
    Details: { screen: Details },
  },
  {
    initialRouteName: 'Home',
    debug: true,
    defaultNavigationOptions: {
      headerShown: null,
    },
  },
);

export const HomeNavigator = createAppContainer(appStackNavigator);
