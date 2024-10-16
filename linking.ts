const config = {
  screen: {
    HomeScreen: {
      path: 'home',
    },
    TaskDetail: {
      path: 'task-detail/:id',
    },
  },
};

const linking: any = {
  prefixes: ['todoapp://app'],
  config,
};
export default linking;
