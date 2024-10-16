/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import {fontFamilies} from '../constants/fontFamiles';
import TextComponent from './TextComponent';

interface Props {
  text: string;
  font?: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
  flex?: number;
}

const TitleComponent = (props: Props) => {
  const {text, font, size, color, style, flex} = props;

  return (
    <TextComponent
      text={text}
      size={size ?? 20}
      font={font ?? fontFamilies.semiBold}
      color={color}
      flex={flex ?? 0}
      style={[style, {flex: 0}]}
    />
  );
};

export default TitleComponent;
