/* eslint-disable react-native/no-inline-styles */
import React, {ReactNode} from 'react';
import {ImageBackground, TouchableOpacity, View} from 'react-native';
import {GlobalStyles} from '../styles/GlobalStyles';

interface Props {
  children: ReactNode;
  color?: string;
  onPress?: () => void;
}

const CardImage = (props: Props) => {
  const {children, color, onPress} = props;

  const renderCard = (
    <ImageBackground
      source={require('../assets/images/card-background.jpg')}
      imageStyle={{borderRadius: 12}}
      style={[GlobalStyles.card]}>
      <View
        style={{
          backgroundColor: color ?? 'rgba(113,77,217,0.9)',
          borderRadius: 12,
          flex: 1,
          padding: 12,
        }}>
        {children}
      </View>
    </ImageBackground>
  );

  return onPress ? (
    <TouchableOpacity onPress={onPress}>{renderCard}</TouchableOpacity>
  ) : (
    renderCard
  );
};

export default CardImage;
