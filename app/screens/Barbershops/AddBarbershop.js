import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';
import AddBarbershopFrom from '../../components/Barbershops/AddBarbershopForm';

export default function AddBarbershop(props) {
  const { navigation } = props;
  const { setIsReloadBarbershops } = navigation.state.params;
  const toastRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View>
      <AddBarbershopFrom
        toastRef={toastRef}
        setIsLoading={setIsLoading}
        navigation={navigation}
        setIsReloadBarbershops={setIsReloadBarbershops}
      />

      <Toast ref={toastRef} position="center" opacity={0.5} />
      <Loading isVisible={isLoading} text="Creando Barbería" />
    </View>
  );
}
