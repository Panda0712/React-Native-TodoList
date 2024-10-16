import React, {ReactNode} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {GlobalStyles} from '../styles/GlobalStyles';

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Section = (props: Props) => {
  const {children, style} = props;

  return <View style={[GlobalStyles.section, style]}>{children}</View>;
};

export default Section;
