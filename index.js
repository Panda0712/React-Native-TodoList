/**
 * @format
 */

import messaging from '@react-native-firebase/messaging';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

messaging().setBackgroundMessageHandler(async mess => {
  //   console.log(mess);
});

AppRegistry.registerComponent(appName, () => App);
