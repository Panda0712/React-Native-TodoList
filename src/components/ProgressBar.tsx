/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import React from 'react';
import {colors} from '../constants/colors';
import Row from './Row';
import TextComponent from './TextComponent';
import {fontFamilies} from '../constants/fontFamiles';

interface Props {
  size?: 'small' | 'default' | 'large';
  color?: string;
  percent: any;
}

const ProgressBar = (props: Props) => {
  const {size, color, percent} = props;

  const heightContent = size === 'small' ? 6 : size === 'default' ? 8 : 10;

  return (
    <View style={{marginTop: 12, marginBottom: 16}}>
      <View
        style={{
          height: heightContent,
          width: '100%',
          backgroundColor: '#563D9F',
          borderRadius: 100,
        }}>
        <View
          style={{
            backgroundColor: color ?? colors.blue,
            width: percent,
            height: heightContent,
            borderRadius: 100,
          }}
        />
      </View>
      <Row justify="space-between" styles={{marginTop: 4}}>
        <TextComponent text="Progress" size={12} />
        <TextComponent text={percent} font={fontFamilies.bold} flex={0} />
      </Row>
    </View>
  );
};

export default ProgressBar;
