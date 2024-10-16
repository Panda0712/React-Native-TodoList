import React from 'react';
import CircularProgress from 'react-native-circular-progress-indicator';
import {colors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamiles';

interface Props {
  color?: string;
  value: number;
  maxValue?: number;
  radius?: number;
  size?: number;
}

const Progress = (props: Props) => {
  const {color, value, maxValue, radius, size} = props;

  return (
    <CircularProgress
      value={value}
      maxValue={maxValue}
      title={`${value}%`}
      radius={radius ?? 46}
      showProgressValue={false}
      activeStrokeColor={color ?? colors.blue}
      inActiveStrokeColor="#3C444A"
      titleColor={colors.text}
      titleFontSize={size ?? 24}
      titleStyle={{
        fontFamily: fontFamilies.semiBold,
      }}
    />
  );
};

export default Progress;
