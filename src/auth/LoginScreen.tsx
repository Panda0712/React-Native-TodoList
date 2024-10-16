/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {Lock, Sms} from 'iconsax-react-native';
import {colors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamiles';
import {GlobalStyles} from '../styles/GlobalStyles';

import auth from '@react-native-firebase/auth';
import Container from '../components/Container';
import Section from '../components/Section';
import TitleComponent from '../components/TitleComponent';
import Input from '../components/Input';
import Button from '../components/Button';
import Space from '../components/Space';
import TextComponent from '../components/TextComponent';

const LoginScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleLoginWithEmail = async () => {
    if (!email || !password) {
      setErrorText('Please provide email and password');
    } else {
      setErrorText('');
      setIsLoading(true);

      await auth()
        .signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;

          setIsLoading(false);
        })
        .catch((error: any) => {
          setIsLoading(false);
          setErrorText(error.message);
        });
    }
  };

  return (
    <View style={[GlobalStyles.container]}>
      <Container>
        <Section
          style={{
            justifyContent: 'center',
            flex: 1,
          }}>
          <TitleComponent
            text="Login"
            size={32}
            font={fontFamilies.bold}
            style={{textTransform: 'uppercase', flex: 0, textAlign: 'center'}}
          />

          <View style={{marginVertical: 20}}>
            <Input
              value={email}
              onChange={val => setEmail(val)}
              prefix={<Sms size={20} color={colors.desc} />}
              placeholder="Email"
              title="Email"
              allowClear
            />
            <Input
              value={password}
              onChange={val => setPassword(val)}
              prefix={<Lock size={20} color={colors.desc} />}
              placeholder="Password"
              title="Password"
              isPassword
            />
            {errorText && <TextComponent text={errorText} color="coral" />}
          </View>

          <Button
            text="Login"
            isLoading={isLoading}
            onPress={handleLoginWithEmail}
          />

          <Space height={20} />
          <Text
            style={[
              GlobalStyles.text,
              {
                textAlign: 'center',
              },
            ]}>
            You don't have an account?{' '}
            <Text
              style={{color: 'coral'}}
              onPress={() => navigation.navigate('SignUpScreen')}>
              Create an account
            </Text>
          </Text>
        </Section>
      </Container>
    </View>
  );
};

export default LoginScreen;
