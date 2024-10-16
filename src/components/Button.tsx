/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import {fontFamilies} from '../constants/fontFamiles';
import TextComponent from './TextComponent';
import {colors} from '../constants/colors';

interface Props {
  text: string;
  isLoading?: boolean;
  onPress: () => void;
  color?: string;
}

const Button = (props: Props) => {
  const {text, isLoading, onPress, color} = props;

  return (
    <TouchableOpacity
      disabled={isLoading}
      onPress={onPress}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color ? color : isLoading ? colors.gray : colors.blue,
        padding: 14,
        borderRadius: 14,
      }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <TextComponent
          text={text}
          flex={0}
          style={{textTransform: 'uppercase'}}
          size={16}
          font={fontFamilies.semiBold}
        />
      )}
    </TouchableOpacity>
  );
};

export default Button;
