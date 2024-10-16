/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, View} from 'react-native';
import {SelectModel} from '../models/SelectModel';
import {Attachment, TaskModel} from '../models/TaskModel';
import {HandleNotification} from '../utils/handleNotification';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Button from '../components/Button';
import Container from '../components/Container';
import DateTimePickerComponent from '../components/DateTimePickerComponent';
import DropDownPicker from '../components/DropDownPicker';
import Input from '../components/Input';
import Row from '../components/Row';
import Section from '../components/Section';
import Space from '../components/Space';
import TextComponent from '../components/TextComponent';
import TitleComponent from '../components/TitleComponent';
import UploadFileComponent from '../components/UploadFileComponent';

const initValue: TaskModel = {
  title: '',
  description: '',
  dueDate: new Date(),
  from: new Date(),
  to: new Date(),
  uids: [],
  isUrgent: false,
  attachment: [],
};

const AddNewTask = ({navigation}: any) => {
  const [tasks, setTasks] = useState<TaskModel>(initValue);
  const [userSelects, setUserSelects] = useState<SelectModel[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const user = auth().currentUser;

  useEffect(() => {
    handleGetUsers();
  }, []);

  useEffect(() => {
    user && setTasks({...tasks, uids: [user.uid]});
  }, [user]);

  const handleGetUsers = async () => {
    await firestore()
      .collection('users')
      .get()
      .then(snap => {
        if (snap.empty) {
          console.log('Users data not found');
        } else {
          const items: SelectModel[] = [];

          snap.forEach(item => {
            items.push({
              label: item.data().name,
              value: item.id,
            });
          });

          setUserSelects(items);
        }
      })
      .catch((err: any) => {
        console.log(`Cannot get users, ${err.message}`);
      });
  };

  const handleChangeValue = (id: string, value: string | string[] | Date) => {
    const item: any = {...tasks};

    item[`${id}`] = value;
    setTasks(item);
  };

  const handleAddNewTask = async () => {
    if (user) {
      const data = {
        ...tasks,
        attachments,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await firestore()
        .collection('tasks')
        .add(data)
        .then(snap => {
          if (userSelects.length > 0) {
            userSelects.forEach(member => {
              member.value !== user.uid &&
                HandleNotification.SendNotification({
                  title: 'New task',
                  body: 'You have a new task assign',
                  taskId: snap.id,
                  memberId: member.value,
                });
            });
          }
          navigation.goBack();
        })
        .catch(err => console.log(err));
    } else {
      Alert.alert('You are not logged in!');
    }
  };

  return (
    <ScrollView>
      <Container isScroll back title="Add new task">
        <Section>
          <Input
            value={tasks.title}
            onChange={val => handleChangeValue('title', val)}
            title="Title"
            allowClear
            numberOfLines={1}
            multible
            placeholder="Title of task"
          />
          <Input
            value={tasks.description}
            onChange={val => handleChangeValue('description', val)}
            title="Description"
            allowClear
            placeholder="Description"
            multible
            numberOfLines={3}
          />
          <DateTimePickerComponent
            selected={tasks.dueDate}
            onSelect={val => handleChangeValue('dueDate', val)}
            placeholder="Select"
            title="Due date"
            type="date"
          />

          <Row>
            <View style={{flex: 1}}>
              <DateTimePickerComponent
                selected={tasks.from}
                type="time"
                onSelect={val => handleChangeValue('from', val)}
                title="From"
              />
            </View>
            <Space width={10} />
            <View style={{flex: 1}}>
              <DateTimePickerComponent
                selected={tasks.to}
                type="time"
                onSelect={val => handleChangeValue('to', val)}
                title="To"
              />
            </View>
          </Row>

          <DropDownPicker
            selected={tasks.uids}
            items={userSelects}
            onSelect={val => handleChangeValue('uids', val)}
            multible
            title="Members"
          />

          <View>
            <Row justify="flex-start">
              <TitleComponent text="Attachments" flex={0} />
              <Space width={8} />
              <UploadFileComponent
                onUpload={file =>
                  file && setAttachments([...attachments, file])
                }
              />
            </Row>
            {attachments.length > 0 &&
              attachments.map((item, index) => (
                <Row key={index} styles={{paddingVertical: 12}}>
                  <TextComponent text={item.name ?? ''} />
                </Row>
              ))}
          </View>
        </Section>

        <Section>
          <Button text="Save" onPress={handleAddNewTask} />
        </Section>
      </Container>
    </ScrollView>
  );
};

export default AddNewTask;
