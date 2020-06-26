import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ActionButton from 'react-native-action-button';
import ListBarbershops from '../../components/Barbershops/ListBarbershops';

import { firebaseApp } from '../../utils/FireBase';
import firebase from 'firebase/app';
import 'firebase/firestore';
const db = firebase.firestore(firebaseApp);

export default function Barbershops(props) {
  const { navigation } = props;
  const [user, setUser] = useState(null);
  const [barbershops, setBarbershops] = useState([]);
  const [startBarbershops, setStartBarbershops] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalBarbershops, setTotalBarbershops] = useState(0);
  const [isReloadBarbershops, setIsReloadBarbershops] = useState(false);
  const limitBarbershops = 12;

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  useEffect(() => {
    db.collection('restaurants')
      .get()
      .then((snap) => {
        setTotalBarbershops(snap.size);
      });

    (async () => {
      const resultBarbershops = [];

      const barbershops = db
        .collection('restaurants')
        .orderBy('createAt', 'desc')
        .limit(limitBarbershops);

      await barbershops.get().then((response) => {
        setStartBarbershops(response.docs[response.docs.length - 1]);

        response.forEach((doc) => {
          let barbershop = doc.data();
          barbershop.id = doc.id;
          resultBarbershops.push({ barbershop });
        });
        setBarbershops(resultBarbershops);
      });
    })();
    setIsReloadBarbershops(false);
  }, [isReloadBarbershops]);

  const handleLoadMore = async () => {
    const resultBarbershops = [];
    barbershops.length < totalBarbershops && setIsLoading(true);

    const barbershopsDb = db
      .collection('restaurants')
      .orderBy('createAt', 'desc')
      .startAfter(startBarbershops.data().createAt)
      .limit(limitBarbershops);

    await barbershopsDb.get().then((response) => {
      if (response.docs.length > 0) {
        setStartBarbershops(response.docs[response.docs.length - 1]);
      } else {
        setIsLoading(false);
      }

      response.forEach((doc) => {
        let barbershop = doc.data();
        barbershop.id = doc.id;
        resultBarbershops.push({ barbershop });
      });

      setBarbershops([...barbershops, ...resultBarbershops]);
    });
  };

  return (
    <View style={styles.viewBody}>
      <ListBarbershops
        barbershops={barbershops}
        isLoading={isLoading}
        handleLoadMore={handleLoadMore}
        navigation={navigation}
      />
      {user && (
        <AddRestaurantButton
          navigation={navigation}
          setIsReloadBarbershops={setIsReloadBarbershops}
        />
      )}
    </View>
  );
}

function AddRestaurantButton(props) {
  const { navigation, setIsReloadBarbershops } = props;

  return (
    <ActionButton
      buttonColor="#00a680"
      onPress={() => navigation.navigate('AddBarbershop', { setIsReloadBarbershops })}
    />
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
  },
});
