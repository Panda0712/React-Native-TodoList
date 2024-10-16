/* eslint-disable react-native/no-inline-styles */
import {SearchNormal1} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {colors} from '../constants/colors';
import {TaskModel} from '../models/TaskModel';

import Container from '../components/Container';
import Input from '../components/Input';
import Section from '../components/Section';
import TextComponent from '../components/TextComponent';
import TitleComponent from '../components/TitleComponent';

const ListTasks = ({navigation, route}: any) => {
  const {tasks}: {tasks: TaskModel[]} = route.params;

  const [searchKey, setSearchKey] = useState('');
  const [results, setResults] = useState<TaskModel[]>([]);

  useEffect(() => {
    if (!searchKey) {
      setResults([]);
    } else {
      const items = tasks.filter(element =>
        element.title.toLowerCase().includes(searchKey.toLowerCase()),
      );

      setResults(items);
    }
  }, [searchKey, tasks]);

  return (
    <Container back>
      <Section>
        <Input
          value={searchKey}
          onChange={val => setSearchKey(val)}
          allowClear
          prefix={<SearchNormal1 size={20} color={colors.gray2} />}
          placeholder="Search"
        />
      </Section>
      <FlatList
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        data={searchKey ? results : tasks}
        ListEmptyComponent={
          <Section>
            <TextComponent text="Data not found" />
          </Section>
        }
        renderItem={({item}) => {
          <TouchableOpacity
            style={{
              marginBottom: 20,
              paddingHorizontal: 16,
            }}
            onPress={() =>
              navigation.navigate('TaskDetail', {
                id: item.id,
              })
            }
            key={item.id}>
            <TitleComponent text={item.title} />
            <TextComponent
              text={item.description}
              color={colors.white}
              line={3}
            />
          </TouchableOpacity>;
        }}
      />
    </Container>
  );
};

export default ListTasks;
