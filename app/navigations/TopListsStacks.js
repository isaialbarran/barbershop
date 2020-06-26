import { createStackNavigator } from 'react-navigation-stack';
import TopBarbershopsScreen from '../screens/TopBarbershops';

const TopListScreenStacks = createStackNavigator({
  TopBarbershops: {
    screen: TopBarbershopsScreen,
    navigationOptions: () => ({
      title: 'Las mejores barberías',
    }),
  },
});

export default TopListScreenStacks;
