/* eslint-disable react-native/no-inline-styles */
import {
  Edit2,
  Element4,
  Logout,
  Notification,
  SearchNormal1,
} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import AvatarGroup from '../components/AvatarGroup';
import Card from '../components/Card';
import CardImage from '../components/CardImage';
import Container from '../components/Container';
import Progress from '../components/Progress';
import ProgressBar from '../components/ProgressBar';
import Row from '../components/Row';
import Section from '../components/Section';
import Space from '../components/Space';
import Tag from '../components/Tag';
import TextComponent from '../components/TextComponent';
import TitleComponent from '../components/TitleComponent';
import {colors} from '../constants/colors';
import {GlobalStyles} from '../styles/GlobalStyles';
import AddTaskButton from '../components/AddTaskButton';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {TaskModel} from '../models/TaskModel';
import {monthNames} from '../constants/appInfo';
import {HandleNotification} from '../utils/handleNotification';

const date = new Date();

const HomeScreen = ({navigation}: any) => {
  const user = auth().currentUser;

  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [urgentTask, setUrgentTask] = useState<TaskModel[]>([]);

  useEffect(() => {
    getTasks();
    HandleNotification.checkNotificationPerson();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const items = tasks.filter(element => element.isUrgent);

      setUrgentTask(items);
    }
  }, [tasks]);

  const getTasks = async () => {
    setIsLoading(true);

    await firestore()
      .collection('tasks')
      .where('uids', 'array-contains', user?.uid)
      .get()
      .then(snap => {
        if (snap.empty) {
          console.log('Task not found');
        } else {
          const items: TaskModel[] = [];
          snap.forEach((item: any) =>
            items.push({
              id: item.id,
              ...item.data(),
            }),
          );

          setTasks(items);
        }
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  };

  const handleMoveToTaskDetail = (id: string, color?: string) => {
    navigation.navigate('TaskDetail', {
      id,
      color,
    });
  };

  return (
    <View style={[GlobalStyles.container]}>
      <ScrollView>
        <Container>
          <Section>
            <Row justify="space-between">
              <Element4 size={24} color={colors.desc} />
              <TouchableOpacity
                onPress={() => navigation.navigate('Notifications')}>
                <Notification size={24} color={colors.desc} />
                <View
                  style={{
                    backgroundColor: 'red',
                    borderRadius: 100,
                    borderWidth: 2,
                    borderColor: colors.white,
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 12,
                    height: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TextComponent
                    text="1"
                    size={9}
                    color={colors.white}
                    flex={0}
                  />
                </View>
              </TouchableOpacity>
            </Row>
          </Section>

          <Section>
            <Row>
              <View style={{flex: 1}}>
                <TextComponent text={`Hi, ${user?.email}`} />
                <TitleComponent text="Be Productive Today" />
              </View>
              <TouchableOpacity onPress={async () => auth().signOut()}>
                <Logout size={22} color="coral" />
              </TouchableOpacity>
            </Row>
          </Section>

          <Section>
            <Row
              styles={[GlobalStyles.inputContainer]}
              onPress={() =>
                navigation.navigate('ListTasks', {
                  tasks,
                })
              }>
              <TextComponent color="#696B6F" text="Search task" />
              <SearchNormal1 size={20} color={colors.desc} />
            </Row>
          </Section>

          <Section>
            <Card
              onPress={() =>
                navigation.navigate('ListTasks', {
                  tasks,
                })
              }>
              <Row>
                <View style={{flex: 1}}>
                  <TitleComponent text="Task progress" />
                  <TextComponent
                    text={`${
                      tasks.filter(item => item.progress && item.progress === 1)
                        .length
                    }/${tasks.length}`}
                  />
                  <Space height={12} />

                  <Row justify="flex-start">
                    <Tag
                      text={`${monthNames[date.getMonth()]} ${date.getDate()}`}
                    />
                  </Row>
                </View>
                <View>
                  {tasks.length > 0 && (
                    <Progress
                      value={Math.floor(
                        (tasks.filter(
                          item => item.progress && item.progress === 1,
                        ).length /
                          tasks.length) *
                          100,
                      )}
                    />
                  )}
                </View>
              </Row>
            </Card>
          </Section>

          {isLoading ? (
            <ActivityIndicator />
          ) : tasks.length > 0 ? (
            <Section>
              <Row
                onPress={() =>
                  navigation.navigate('ListTasks', {
                    tasks,
                  })
                }
                justify="flex-end"
                styles={{
                  marginBottom: 16,
                }}>
                <TextComponent size={16} text="See all" flex={0} />
              </Row>
              <Row styles={{alignItems: 'flex-start'}}>
                <View style={{flex: 1}}>
                  {tasks[0] && (
                    <CardImage
                      onPress={() => handleMoveToTaskDetail(tasks[0].id)}>
                      <TouchableOpacity
                        onPress={() => {}}
                        style={[GlobalStyles.iconContainer]}>
                        <Edit2 size={20} color={colors.white} />
                      </TouchableOpacity>
                      <TitleComponent text={tasks[0]?.title || 'No data'} />
                      <TextComponent
                        line={3}
                        text={tasks[0]?.description || 'No description'}
                        size={13}
                      />

                      <View style={{marginVertical: 28}}>
                        <AvatarGroup uids={tasks[0].uids} />
                        {tasks[0]?.progress ? (
                          <ProgressBar
                            percent={`${Math.floor(tasks[0].progress)}%`}
                            color="#0AACFF"
                            size="large"
                          />
                        ) : (
                          <></>
                        )}
                      </View>
                      <TextComponent
                        text={`Due, ${new Date(
                          tasks[0].dueDate.toDate(),
                        ).toLocaleDateString()}`}
                        size={12}
                        color={colors.desc}
                      />
                    </CardImage>
                  )}
                </View>
                <Space width={16} />
                <View style={{flex: 1}}>
                  {tasks[1] && (
                    <CardImage
                      onPress={() =>
                        handleMoveToTaskDetail(tasks[1].id, '#2196F3')
                      }
                      color="#2196F3">
                      <TouchableOpacity
                        onPress={() => {}}
                        style={[GlobalStyles.iconContainer]}>
                        <Edit2 size={20} color={colors.white} />
                      </TouchableOpacity>
                      <TitleComponent text={tasks[1].title} size={18} />
                      {tasks[1].uids && <AvatarGroup uids={tasks[1].uids} />}
                      {tasks[1].progress && (
                        <ProgressBar
                          percent={`${Math.floor(tasks[1].progress)}%`}
                          color="#A2F068"
                        />
                      )}
                    </CardImage>
                  )}

                  <Space height={16} />

                  {tasks[2] && (
                    <CardImage
                      onPress={() =>
                        handleMoveToTaskDetail(tasks[2].id, '#12B57A')
                      }
                      color="#12B57A">
                      <TouchableOpacity
                        onPress={() => {}}
                        style={[GlobalStyles.iconContainer]}>
                        <Edit2 size={20} color={colors.white} />
                      </TouchableOpacity>
                      <TitleComponent text={tasks[2].title} size={18} />
                      <TextComponent text={tasks[2].description} size={13} />
                    </CardImage>
                  )}
                </View>
              </Row>
            </Section>
          ) : (
            <></>
          )}

          <Space height={16} />

          <Section>
            <TitleComponent text="Urgent tasks" />

            {urgentTask.length > 0 &&
              urgentTask.map(item => (
                <View key={item.id}>
                  <Card
                    key={`Urgent${item.id}`}
                    onPress={() => handleMoveToTaskDetail(item.id)}>
                    <Row>
                      <Progress
                        value={item.progress ? item.progress * 100 : 0}
                        radius={36}
                        size={18}
                      />
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'space-between',
                          paddingLeft: 12,
                        }}>
                        <TextComponent text={item.title} />
                      </View>
                    </Row>
                  </Card>
                </View>
              ))}
          </Section>
        </Container>
      </ScrollView>
      <AddTaskButton />
    </View>
  );
};

export default HomeScreen;
