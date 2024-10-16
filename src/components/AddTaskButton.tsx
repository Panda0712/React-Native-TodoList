/* eslint-disable react-native/no-inline-styles */
import {Add} from 'iconsax-react-native';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {colors} from '../constants/colors';
import {GlobalStyles} from '../styles/GlobalStyles';
import TextComponent from './TextComponent';
import {useNavigation} from '@react-navigation/native';

const AddTaskButton = () => {
  const navigation: any = useNavigation();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('AddNewTask')}
        style={[
          GlobalStyles.row,
          {
            backgroundColor: colors.blue,
            padding: 10,
            borderRadius: 100,
            width: '80%',
            alignItems: 'center',
          },
        ]}>
        <TextComponent text="Add new task" flex={0} />
        <Add size={22} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

export default AddTaskButton;
