/* eslint-disable react-native/no-inline-styles */
import {ArrowDown2} from 'iconsax-react-native';
import React, {useState} from 'react';
import {Button, Modal, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {colors} from '../constants/colors';
import {GlobalStyles} from '../styles/GlobalStyles';
import Row from './Row';
import Space from './Space';
import TextComponent from './TextComponent';
import TitleComponent from './TitleComponent';

interface Props {
  type?: 'date' | 'time' | 'datetime';
  title?: string;
  placeholder?: string;
  selected?: Date;
  onSelect: (val: Date) => void;
}

const DateTimePickerComponent = (props: Props) => {
  const {type, title, placeholder, selected, onSelect} = props;

  const [date, setDate] = useState(selected ?? new Date());

  const [active, setActive] = useState(false);

  return (
    <>
      <View style={{marginBottom: 16}}>
        {title && <TitleComponent text={title} />}
        <Row
          onPress={() => setActive(true)}
          styles={[
            GlobalStyles.inputContainer,
            {
              marginTop: title ? 8 : 0,
              paddingVertical: 16,
            },
          ]}>
          <TextComponent
            flex={1}
            text={
              selected
                ? type === 'time'
                  ? `${selected.getHours()}:${selected.getMinutes()}`
                  : `${selected.getDate()}/${
                      selected.getMonth() + 1
                    }/${selected.getFullYear()}`
                : placeholder
                ? placeholder
                : ''
            }
            color={selected ? colors.text : '#676767'}
          />
          <ArrowDown2 size={20} color={colors.text} />
        </Row>
      </View>

      <Modal visible={active} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,.5)',
          }}>
          <View
            style={{
              margin: 20,
              width: '90%',
              backgroundColor: colors.white,
              padding: 20,
              borderRadius: 20,
            }}>
            <View>
              <TextComponent text="Date time picker" />
              <DatePicker
                mode={type ? type : 'datetime'}
                date={date}
                onDateChange={val => setDate(val)}
                locale="vi"
              />
            </View>
            <Space height={20} />
            <Button
              title="Confirm"
              onPress={() => {
                onSelect(date);
                setActive(false);
              }}
            />
            <Button title="Close" onPress={() => setActive(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DateTimePickerComponent;
