/* eslint-disable react-native/no-inline-styles */
import {Lock, Sms} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {colors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamiles';
import {GlobalStyles} from '../styles/GlobalStyles';

import auth from '@react-native-firebase/auth';
import Button from '../components/Button';
import Container from '../components/Container';
import Input from '../components/Input';
import Section from '../components/Section';
import Space from '../components/Space';
import TitleComponent from '../components/TitleComponent';
import TextComponent from '../components/TextComponent';
import {HandleUser} from '../utils/handleUser';

const SignUpScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (email || password) {
      setErrorText('');
    }
  }, [email, password]);

  const handleSignUp = async () => {
    if (!email || !password) {
      setErrorText('Please enter your email and your password');
    } else {
      setErrorText('');
      setIsLoading(true);

      await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;

          HandleUser.SaveToDatabase(user);
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
            text="Sign Up"
            size={32}
            font={fontFamilies.bold}
            style={{textTransform: 'uppercase', flex: 0, textAlign: 'center'}}
          />

          <View style={{marginVertical: 20}}>
            <Input
              value={email}
              onChange={val => setEmail(val)}
              prefix={<Sms size={25} color={colors.desc} />}
              placeholder="Email"
              title="Email"
              allowClear
            />
            <Input
              value={password}
              onChange={val => setPassword(val)}
              prefix={<Lock size={25} color={colors.desc} />}
              placeholder="Password"
              title="Password"
              isPassword
            />
            {errorText && (
              <TextComponent text={errorText} color="coral" flex={0} />
            )}
          </View>

          <Button text="Sign Up" isLoading={isLoading} onPress={handleSignUp} />

          <Space height={20} />
          <Text
            style={[
              GlobalStyles.text,
              {
                textAlign: 'center',
              },
            ]}>
            Have an account?{' '}
            <Text
              style={{color: 'coral'}}
              onPress={() => navigation.navigate('LoginScreen')}>
              SignIn
            </Text>
          </Text>
        </Section>
      </Container>
    </View>
  );
};

export default SignUpScreen;
