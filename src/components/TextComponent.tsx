import {StyleProp, Text, TextStyle} from 'react-native';
import React from 'react';
import {GlobalStyles} from '../styles/GlobalStyles';
import {fontFamilies} from '../constants/fontFamiles';
import {colors} from '../constants/colors';

interface Props {
  text: string;
  size?: number;
  font?: string;
  color?: string;
  flex?: number;
  style?: StyleProp<TextStyle>;
  line?: number;
}

const TextComponent = (props: Props) => {
  const {text, size, font, color, flex, style, line} = props;

  return (
    <Text
      numberOfLines={line}
      style={[
        GlobalStyles.text,
        {
          flex: flex ?? 1,
          fontFamily: font ?? fontFamilies.regular,
          fontSize: size ?? 14,
          color: color ?? colors.desc,
        },
        style,
      ]}>
      {text}
    </Text>
  );
};

export default TextComponent;
