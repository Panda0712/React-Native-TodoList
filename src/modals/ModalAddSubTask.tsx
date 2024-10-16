/* eslint-disable react-native/no-inline-styles */
import firestore from '@react-native-firebase/firestore';
import React, {useState} from 'react';
import {Modal, TouchableOpacity, View} from 'react-native';
import {colors} from '../constants/colors';
import {GlobalStyles} from '../styles/GlobalStyles';

import Button from '../components/Button';
import Input from '../components/Input';
import Row from '../components/Row';
import TextComponent from '../components/TextComponent';
import TitleComponent from '../components/TitleComponent';

interface Props {
  visible: boolean;
  subTasks?: any;
  onClose: () => void;
  taskId: string;
}

const initialValue = {
  title: '',
  description: '',
  isCompleted: false,
};

const ModalAddSubTask = (props: Props) => {
  const {visible, subTasks, onClose, taskId} = props;
  const [subTaskForm, setSubTaskForm] = useState(initialValue);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveToDatabase = async () => {
    const data = {
      ...subTaskForm,
      taskId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setIsUpdating(true);

    try {
      await firestore().collection('subTasks').add(data);
      console.log('Done');
      handleCloseModal();
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setSubTaskForm(initialValue);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      style={[GlobalStyles.modal]}
      transparent
      animationType="slide">
      <View style={[GlobalStyles.modalContainer]}>
        <View
          style={[
            GlobalStyles.modalContent,
            {
              backgroundColor: colors.gray,
            },
          ]}>
          <TitleComponent text="Add new subtask" />
          <View style={{paddingVertical: 16}}>
            <Input
              title="Title"
              placeholder="Title"
              value={subTaskForm.title}
              color={'#212121'}
              allowClear
              onChange={val => setSubTaskForm({...subTaskForm, title: val})}
            />
            <Input
              title="Description"
              placeholder="Description"
              value={subTaskForm.description}
              color={'#212121'}
              onChange={val =>
                setSubTaskForm({...subTaskForm, description: val})
              }
              numberOfLines={3}
              multible
              allowClear
            />
          </View>
          <Row>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={handleCloseModal}>
                <TextComponent text="Close" flex={0} />
              </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>
              <Button
                isLoading={isUpdating}
                text="Save"
                onPress={handleSaveToDatabase}
              />
            </View>
          </Row>
        </View>
      </View>
    </Modal>
  );
};

export default ModalAddSubTask;
