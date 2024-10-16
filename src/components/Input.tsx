/* eslint-disable react-native/no-inline-styles */
import {Eye, EyeSlash} from 'iconsax-react-native';
import React, {ReactNode, useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors} from '../constants/colors';
import {GlobalStyles} from '../styles/GlobalStyles';

import Row from './Row';
import TitleComponent from './TitleComponent';

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  title?: string;
  prefix?: ReactNode;
  affix?: ReactNode;
  allowClear?: boolean;
  multible?: boolean;
  numberOfLines?: number;
  isPassword?: boolean;
  color?: string;
}

const Input = (props: Props) => {
  const {
    value,
    onChange,
    placeholder,
    title,
    prefix,
    affix,
    allowClear,
    multible,
    numberOfLines,
    isPassword,
    color,
  } = props;

  const [showPass, setShowPass] = useState(false);

  return (
    <View style={{marginBottom: 16}}>
      {title && <TitleComponent text={title} />}
      <Row
        styles={[
          GlobalStyles.inputContainer,
          {
            marginTop: title ? 8 : 0,
            minHeight: multible && numberOfLines ? 32 * numberOfLines : 32,
            paddingVertical: 14,
            paddingHorizontal: 10,
            alignItems: 'flex-start',
            backgroundColor: color ?? colors.gray,
          },
        ]}>
        {prefix && prefix}
        <View
          style={{
            flex: 1,
            paddingLeft: prefix ? 8 : 0,
            paddingRight: affix ? 8 : 0,
          }}>
          <TextInput
            style={[
              GlobalStyles.text,
              {
                margin: 0,
                padding: 0,
                flex: 1,
              },
            ]}
            placeholder={placeholder ?? ''}
            placeholderTextColor={'#676767'}
            value={value}
            onChangeText={val => onChange(val)}
            multiline={multible}
            numberOfLines={numberOfLines}
            secureTextEntry={isPassword ? !showPass : false}
            autoCapitalize="none"
          />
        </View>
        {affix && affix}
        {allowClear && value && (
          <TouchableOpacity onPress={() => onChange('')}>
            <AntDesign name="close" size={20} color={colors.white} />
          </TouchableOpacity>
        )}

        {isPassword && (
          <TouchableOpacity onPress={() => setShowPass(show => !show)}>
            {showPass ? (
              <EyeSlash size={20} color={colors.desc} />
            ) : (
              <Eye size={20} color={colors.desc} />
            )}
          </TouchableOpacity>
        )}
      </Row>
    </View>
  );
};

export default Input;
