import { createStackNavigator } from 'react-navigation-stack';
import BarbershopsScreen from '../screens/Barbershops';
import AddBarbershopScreen from '../screens/Barbershops/AddBarbershop';
import BarbershopScreen from '../screens/Barbershops/Barbershop';
import AddReviewBarbershopScreen from '../screens/Barbershops/AddReviewBarbershop';

const BarbershopsScreenStacks = createStackNavigator({
  Barbershops: {
    screen: BarbershopsScreen,
    navigationOptions: () => ({
      title: 'Barberías',
    }),
  },
  AddBarbershop: {
    screen: AddBarbershopScreen,
    navigationOptions: () => ({
      title: 'Nuevo Barbería',
    }),
  },
  Barbershop: {
    screen: BarbershopScreen,
    navigationOptions: (props) => ({
      title: props.navigation.state.params.barbershop.name,
    }),
  },
  AddReviewBarbershop: {
    screen: AddReviewBarbershopScreen,
    navigationOptions: () => ({
      title: 'Nuevo comentario',
    }),
  },
});

export default BarbershopsScreenStacks;
