/* eslint-disable react-native/no-inline-styles */
import {View, Text, StyleProp, ViewStyle, TouchableOpacity} from 'react-native';
import React, {ReactNode} from 'react';
import {GlobalStyles} from '../styles/GlobalStyles';
import {colors} from '../constants/colors';

interface Props {
  children: ReactNode;
  bgColor?: string;
  styles?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const Card = (props: Props) => {
  const {children, bgColor, styles, onPress} = props;

  return onPress ? (
    <TouchableOpacity
      onPress={onPress}
      style={[
        GlobalStyles.inputContainer,
        {
          padding: 12,
          backgroundColor: bgColor ?? colors.gray,
        },
        styles,
      ]}>
      {children}
    </TouchableOpacity>
  ) : (
    <View
      style={[
        GlobalStyles.inputContainer,
        {
          padding: 12,
          backgroundColor: bgColor ?? colors.gray,
        },
        styles,
      ]}>
      {children}
    </View>
  );
};

export default Card;
