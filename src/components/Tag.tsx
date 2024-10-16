import React from 'react';
import {StyleProp, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';
import {GlobalStyles} from '../styles/GlobalStyles';
import {colors} from '../constants/colors';

import TextComponent from './TextComponent';

interface Props {
  text: string;
  color?: string;
  tagStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}

const Tag = (props: Props) => {
  const {text, color, tagStyle, textStyle, onPress} = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[
        GlobalStyles.tag,
        tagStyle,
        {backgroundColor: color ?? colors.blue},
      ]}>
      <TextComponent text={text} style={textStyle} />
    </TouchableOpacity>
  );
};

export default Tag;
