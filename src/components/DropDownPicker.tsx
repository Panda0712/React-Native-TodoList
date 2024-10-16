/* eslint-disable react-native/no-inline-styles */
import {View, Text, Modal, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SelectModel} from '../models/SelectModel';
import TitleComponent from './TitleComponent';
import Row from './Row';
import {GlobalStyles} from '../styles/GlobalStyles';
import TextComponent from './TextComponent';
import {colors} from '../constants/colors';
import {ArrowDown2, SearchNormal1, TickCircle} from 'iconsax-react-native';
import Button from './Button';
import Input from './Input';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Space from './Space';

interface Props {
  title?: string;
  items: SelectModel[];
  selected?: string[];
  onSelect: (value: string[]) => void;
  multible?: boolean;
}

const DropDownPicker = (props: Props) => {
  const {title, items, selected, onSelect, multible} = props;

  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SelectModel[]>([]);
  const [dataSelected, setDataSelected] = useState([]);

  const handleSelected = (id: string) => {
    if (multible) {
      const data = [...dataSelected];

      const index = data.findIndex(item => item === id);
      if (index !== -1) {
        data.splice(index, 1);
      } else {
        data.push(id);
      }

      setDataSelected(data);
    } else {
      setDataSelected([id]);
    }
  };

  const handleConfirm = () => {
    onSelect(dataSelected);
    setIsVisible(false);
    setDataSelected([]);
  };

  const handleRemove = (index: number) => {
    if (selected) {
      selected.splice(index, 1);

      onSelect(selected);
    }
  };

  const renderSelectedItem = (item: string, index: number) => {
    const id = items.find(element => element.value === item);

    return (
      id && (
        <Row
          onPress={() => handleRemove(index)}
          key={index}
          styles={{
            marginRight: 4,
            marginBottom: 8,
            padding: 4,
            borderRadius: 100,
            borderWidth: 0.5,
            borderColor: colors.gray2,
          }}>
          <TextComponent text={id.label} flex={0} />
          <Space width={8} />
          <AntDesign name="close" size={14} color={colors.text} />
        </Row>
      )
    );
  };

  useEffect(() => {
    selected && setDataSelected(selected);
  }, [selected]);

  useEffect(() => {
    if (!searchQuery) {
      setResults([]);
    } else {
      const data = items.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      setResults(data);
    }
  }, [searchQuery, items]);

  return (
    <View style={{marginBottom: 16}}>
      {title && <TitleComponent text={title} />}
      <Row
        onPress={() => setIsVisible(true)}
        styles={[
          GlobalStyles.inputContainer,
          {
            marginTop: title ? 8 : 0,
            paddingVertical: 16,
          },
        ]}>
        <View style={{flex: 1, paddingRight: 12}}>
          {selected && selected?.length > 0 ? (
            <Row justify="flex-start" styles={{flexWrap: 'wrap'}}>
              {selected.map((item, index) => renderSelectedItem(item, index))}
            </Row>
          ) : (
            <TextComponent text="Select" color={colors.gray2} flex={0} />
          )}
        </View>
        <ArrowDown2 size={20} color={colors.text} />
      </Row>

      <Modal
        visible={isVisible}
        style={{flex: 1}}
        transparent
        animationType="slide"
        statusBarTranslucent>
        <View
          style={[
            GlobalStyles.container,
            {
              padding: 20,
              paddingVertical: 60,
            },
          ]}>
          <FlatList
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Row styles={{alignItems: 'center', justifyContent: 'center'}}>
                <View style={{flex: 1, marginRight: 12}}>
                  <Input
                    value={searchQuery}
                    onChange={val => setSearchQuery(val)}
                    placeholder="Search"
                    prefix={<SearchNormal1 size={20} color={colors.gray2} />}
                    allowClear
                  />
                </View>
                <TouchableOpacity onPress={() => setIsVisible(false)}>
                  <TextComponent text="Cancel" color="coral" flex={0} />
                </TouchableOpacity>
              </Row>
            }
            style={{flex: 1}}
            data={searchQuery ? results : items}
            renderItem={({item}) => (
              <Row
                onPress={() => handleSelected(item.value)}
                key={item.value}
                styles={{paddingVertical: 16}}>
                <TextComponent
                  size={16}
                  text={item.label}
                  color={
                    dataSelected.includes(item.value) ? 'coral' : colors.text
                  }
                />
                {dataSelected.includes(item.value) && (
                  <TickCircle size={22} color="coral" />
                )}
              </Row>
            )}
          />
          <Button text="Confirm" onPress={handleConfirm} />
        </View>
      </Modal>
    </View>
  );
};

export default DropDownPicker;
