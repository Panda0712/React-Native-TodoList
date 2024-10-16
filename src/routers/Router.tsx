import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

import {useLinkTo} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';

import Notifications from '../Notifications';
import SearchScreen from '../SearchScreen';
import LoginScreen from '../auth/LoginScreen';
import SignUpScreen from '../auth/SignUpScreen';
import HomeScreen from '../home/HomeScreen';
import AddNewTask from '../tasks/AddNewTask';
import ListTasks from '../tasks/ListTasks';
import TaskDetail from '../tasks/TaskDetail';

const Router = () => {
  const [isLogin, setIsLogin] = useState(false);

  const linkTo = useLinkTo();

  const Stack = createNativeStackNavigator();

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    });

    messaging().onNotificationOpenedApp((mess: any) => {
      const data = mess.data;
      const taskId = data.taskid;

      linkTo(`todoapp://app/task-detail/${taskId}`);
    });
  }, []);

  const MainRouter = (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AddNewTask" component={AddNewTask} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetail} />
      <Stack.Screen name="ListTasks" component={ListTasks} />
      <Stack.Screen name="Notifications" component={Notifications} />
    </Stack.Navigator>
  );
  const AuthRouter = (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
    </Stack.Navigator>
  );

  return isLogin ? MainRouter : AuthRouter;
};

export default Router;
