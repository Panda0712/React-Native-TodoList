/* eslint-disable react-native/no-inline-styles */
import {
  ScrollView,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {ReactNode} from 'react';
import {GlobalStyles} from '../styles/GlobalStyles';
import Row from './Row';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeft2} from 'iconsax-react-native';
import {colors} from '../constants/colors';
import TextComponent from './TextComponent';
import {fontFamilies} from '../constants/fontFamiles';

interface Props {
  title?: string;
  back?: boolean;
  right?: ReactNode;
  children: ReactNode;
  isScroll?: boolean;
}

const Container = (props: Props) => {
  const {title, back, right, children, isScroll} = props;

  const navigation: any = useNavigation();

  return (
    <>
      {back && (
        <View style={[GlobalStyles.container, {flex: 0}]}>
          {/* Header container */}

          <Row
            styles={{
              paddingHorizontal: 16,
              paddingBottom: 16,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft2 size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={{flex: 1, zIndex: -1}}>
              {title && (
                <TextComponent
                  flex={0}
                  font={fontFamilies.bold}
                  size={16}
                  text={title}
                  style={{textAlign: 'center', marginLeft: back ? -24 : 0}}
                />
              )}
            </View>
          </Row>
        </View>
      )}
      {isScroll ? (
        <ScrollView style={GlobalStyles.container}>{children}</ScrollView>
      ) : (
        <View style={[GlobalStyles.container, {flex: 1}]}>{children}</View>
      )}
    </>
  );
};

export default Container;
