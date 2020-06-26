import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-easy-toast';
import ListTopBarbershops from '../components/Ranking/ListTopBarbershops';

import { firebaseApp } from '../utils/FireBase';
import firebase from 'firebase/app';
import 'firebase/firestore';
const db = firebase.firestore(firebaseApp);

export default function TopBarbershops(props) {
  const { navigation } = props;
  const [barbershops, setBarbershops] = useState([]);
  const toastRef = useRef();

  useEffect(() => {
    (async () => {
      db.collection('restaurants')
        .orderBy('rating', 'desc')
        .limit(5)
        .get()
        .then((response) => {
          const barbershopsArray = [];
          response.forEach((doc) => {
            let barbershop = doc.data();
            barbershop.id = doc.id;
            barbershopsArray.push(barbershop);
          });
          setBarbershops(barbershopsArray);
        })
        .catch(() => {
          toastRef.current.show('Error al cargar el Ranking, intentlo más tarde', 3000);
        });
    })();
  }, []);

  return (
    <View>
      <ListTopBarbershops barbershops={barbershops} navigation={navigation} />
      <Toast ref={toastRef} position="center" opacity={0.7} />
    </View>
  );
}
