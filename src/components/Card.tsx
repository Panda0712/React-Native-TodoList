/* eslint-disable react-native/no-inline-styles */
import React, {ReactNode} from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {colors} from '../constants/colors';
import {GlobalStyles} from '../styles/GlobalStyles';

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
