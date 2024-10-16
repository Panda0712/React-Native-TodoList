/* eslint-disable react-native/no-inline-styles */
import {
  AddSquare,
  ArrowLeft2,
  CalendarEdit,
  Clock,
  TickCircle,
  TickSquare,
} from 'iconsax-react-native';
import {Alert, ScrollView, TouchableOpacity, View} from 'react-native';
import {colors} from '../constants/colors';
import {Attachment, SubTasks, TaskModel} from '../models/TaskModel';
import {HandleDateTime} from '../utils/handleDateTime';

import {Slider} from '@miblanchard/react-native-slider';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import AvatarGroup from '../components/AvatarGroup';
import Button from '../components/Button';
import Card from '../components/Card';
import Row from '../components/Row';
import Section from '../components/Section';
import Space from '../components/Space';
import TextComponent from '../components/TextComponent';
import TitleComponent from '../components/TitleComponent';
import UploadFileComponent from '../components/UploadFileComponent';
import {fontFamilies} from '../constants/fontFamiles';
import ModalAddSubTask from '../modals/ModalAddSubTask';
import {calcFileSize} from '../utils/calclFileSize';
import {HandleNotification} from '../utils/handleNotification';
import auth from '@react-native-firebase/auth';

const TaskDetail = ({navigation, route}: any) => {
  const {id, color}: {id: string; color?: string} = route.params;
  const [taskDetail, setTaskDetail] = useState<TaskModel>();
  const [progress, setProgress] = useState(0);
  const [fileUrls, setFileUrls] = useState<Attachment[]>([]);
  const [subTasks, setSubTasks] = useState<SubTasks[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [isVisibleModalSubtask, setIsVisibleModalSubtask] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  const user = auth().currentUser;

  const getTaskDetail = () => {
    firestore()
      .doc(`tasks/${id}`)
      .onSnapshot((snap: any) => {
        if (snap.exists) {
          setTaskDetail({
            id,
            ...snap.data(),
          });
        } else {
          console.log('Task not found');
        }
      });
  };

  const getSubTaskById = () => {
    firestore()
      .collection('subTasks')
      .where('taskId', '==', id)
      .onSnapshot(snap => {
        if (snap.empty) {
          console.log('SubTask not found');
        } else {
          const items: SubTasks[] = [];
          snap.forEach((item: any) => {
            items.push({
              id: item.id,
              ...item.data(),
            });
          });

          setSubTasks(items);
        }
      });
  };

  const handleUpdateTask = async () => {
    const data = {...taskDetail, progress, fileUrls, updatedAt: Date.now()};

    await firestore()
      .doc(`tasks/${id}`)
      .update(data)
      .then(() => {
        Alert.alert('Task updated');
      })
      .catch(err => console.log(err));
  };

  const handleUpdateSubTask = async (id: string, isCompleted: boolean) => {
    try {
      await firestore()
        .doc(`subTasks/${id}`)
        .update({isCompleted: !isCompleted});
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTaskDetail();
    getSubTaskById();
  }, [id]);

  useEffect(() => {
    if (!taskDetail) {
      return;
    }

    setProgress(taskDetail.progress ?? 0);
    setFileUrls(taskDetail.attachment);
    setIsUrgent(taskDetail.isUrgent);
  }, [taskDetail]);

  useEffect(() => {
    if (
      progress !== taskDetail?.progress ||
      (fileUrls && fileUrls?.length !== taskDetail.attachment.length)
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [progress, taskDetail, fileUrls]);

  useEffect(() => {
    if (subTasks.length > 0) {
      const completedPercent =
        subTasks.filter(element => element.isCompleted).length /
        subTasks.length;

      setProgress(completedPercent);
    }
  }, [subTasks]);

  const handleUpdateUrgentState = () => {
    firestore().doc(`tasks/${id}`).update({
      isUrgent: !isUrgent,
      updatedAt: Date.now(),
    });
  };

  const handleRemoveTask = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this task?', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => console.log('Cancel'),
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await firestore()
            .doc(`tasks/${id}`)
            .delete()
            .then(() => {
              taskDetail?.uids.forEach(userId => {
                HandleNotification.SendNotification({
                  title: 'Delete task',
                  body: `You have a new deleted task by ${user?.email}`,
                  taskId: '',
                  memberId: userId,
                });
              });
              navigation.goBack();
            })
            .catch(error => {
              console.log(error);
            });
        },
      },
    ]);
  };

  return taskDetail ? (
    <>
      <ScrollView style={{flex: 1, backgroundColor: colors.bgColor}}>
        <Section
          style={{
            backgroundColor: color ?? '#0AACFF',
            paddingVertical: 20,
            paddingTop: 48,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}>
          <Row justify="flex-start">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft2 size={28} color={colors.text} />
            </TouchableOpacity>
            <Space width={12} />
            <TitleComponent size={22} text={taskDetail.title} flex={1} />
          </Row>
          <Space height={30} />
          <TextComponent text="Due date" />
          <Row styles={{marginTop: 8}}>
            <Row styles={{flex: 1}}>
              <Clock size={18} color={colors.text} />
              <Space width={8} />
              <TextComponent
                text={`${HandleDateTime.GetHour(
                  taskDetail.from?.toDate(),
                )} - ${HandleDateTime.GetHour(taskDetail.to?.toDate())}`}
                style={{marginTop: 1.5}}
              />
            </Row>
            <Space width={6} />
            <Row styles={{flex: 1}}>
              <CalendarEdit size={18} color={colors.text} />
              <Space width={8} />
              <TextComponent
                text={`${HandleDateTime.DateString(
                  taskDetail.dueDate?.toDate(),
                )}`}
                style={{marginTop: 1.5}}
              />
            </Row>

            <Row styles={{flex: 1}} justify="flex-end">
              <AvatarGroup uids={taskDetail.uids} />
            </Row>
          </Row>
        </Section>

        <Section>
          <TitleComponent text="Description" size={22} />
          <Card
            bgColor={colors.bgColor}
            styles={{
              borderWidth: 1,
              borderColor: colors.gray,
              borderRadius: 12,
              marginTop: 12,
            }}>
            <TextComponent text={taskDetail.description} />
          </Card>
        </Section>

        <Section>
          <Row onPress={handleUpdateUrgentState}>
            <TickSquare
              variant={isUrgent ? 'Bold' : 'Outline'}
              size={24}
              color={colors.white}
            />
            <Space width={8} />
            <TextComponent
              flex={1}
              text="Is Urgent"
              size={18}
              font={fontFamilies.bold}
            />
          </Row>
        </Section>

        <Section>
          <Row justify="space-between">
            <TitleComponent text="Files & Links" flex={0} />
            <UploadFileComponent
              onUpload={file => file && setFileUrls([...fileUrls, file])}
            />
          </Row>
          {fileUrls?.map((item, index) => (
            <Row
              key={index}
              styles={{justifyContent: 'flex-start', marginBottom: 0}}>
              <TextComponent flex={0} text={item.name} />
              <TextComponent
                flex={0}
                size={12}
                text={calcFileSize(item.size)}
              />
            </Row>
          ))}
        </Section>

        <Section>
          <Row justify="flex-start">
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 100,
                borderWidth: 2,
                borderColor: colors.success,
                marginRight: 4,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: colors.success,
                  width: 12,
                  height: 12,
                  borderRadius: 100,
                }}
              />
            </View>
            <TitleComponent style={{marginTop: 2}} flex={1} text="Progress" />
          </Row>

          <Space height={12} />

          <Row>
            <View style={{flex: 1}}>
              <Slider
                disabled
                value={progress}
                maximumValue={100}
                onValueChange={val => setProgress(Math.floor(val[0]))}
                thumbTintColor={colors.success}
                thumbStyle={{borderWidth: 2, borderColor: colors.white}}
                maximumTrackTintColor={colors.gray2}
                minimumTrackTintColor={colors.success}
                trackStyle={{height: 10, borderRadius: 100}}
              />
            </View>
            <Space width={20} />
            <TextComponent
              text={`${Math.floor(progress)}%`}
              font={fontFamilies.bold}
              size={18}
              style={{width: 50}}
              flex={0}
            />
          </Row>
        </Section>

        <Section>
          <Row justify="space-between">
            <TitleComponent text="Sub tasks" size={20} />
            <TouchableOpacity onPress={() => setIsVisibleModalSubtask(true)}>
              <AddSquare size={24} color={colors.success} variant="Bold" />
            </TouchableOpacity>
          </Row>

          <Space height={12} />
          {subTasks.length > 0 &&
            subTasks.map((item, index) => (
              <Card key={index} styles={{marginBottom: 12}}>
                <Row
                  onPress={() =>
                    handleUpdateSubTask(item.id, item.isCompleted)
                  }>
                  <TickCircle
                    variant={item.isCompleted ? 'Bold' : 'Outline'}
                    color={colors.success}
                    size={22}
                  />
                  <View style={{flex: 1, marginLeft: 12}}>
                    <TextComponent text={item.title} />
                    <TextComponent
                      size={12}
                      color={'#e0e0e0'}
                      text={HandleDateTime.DateString(item.createdAt)}
                    />
                  </View>
                </Row>
              </Card>
            ))}
        </Section>

        <Section>
          <Row onPress={handleRemoveTask}>
            <TouchableOpacity>
              <TextComponent text="Delete task" color="red" />
            </TouchableOpacity>
          </Row>
        </Section>
      </ScrollView>
      {isChanged && (
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            left: 20,
          }}>
          <Button text="Update" onPress={handleUpdateTask} />
        </View>
      )}

      <ModalAddSubTask
        visible={isVisibleModalSubtask}
        onClose={() => setIsVisibleModalSubtask(false)}
        taskId={id}
      />
    </>
  ) : (
    <></>
  );
};

export default TaskDetail;
