import { createStackNavigator } from 'react-navigation-stack';
import SearchScreen from '../screens/Search';

const SearchScreenStacks = createStackNavigator({
  Barbershops: {
    screen: SearchScreen,
    navigationOptions: () => ({
      title: 'Busca tu barbería',
    }),
  },
});

export default SearchScreenStacks;
