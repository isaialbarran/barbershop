import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Image, Icon, Button } from 'react-native-elements';
import Loading from '../components/Loading';
import Toast from 'react-native-easy-toast';
import { NavigationEvents } from 'react-navigation';

import { firebaseApp } from '../utils/FireBase';
import firebase from 'firebase/app';
import 'firebase/firestore';
const db = firebase.firestore(firebaseApp);

export default function Favorites(props) {
  const { navigation } = props;
  const [barbershops, setBarbershops] = useState([]);
  const [reloadBarbershops, setReloadBarbershops] = useState(false);
  const [isVisibleLoding, setIsVisibleLoading] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const toastRef = useRef();

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useEffect(() => {
    if (userLogged) {
      const idUser = firebase.auth().currentUser.uid;
      db.collection('favorites')
        .where('idUser', '==', idUser)
        .get()
        .then((response) => {
          const idBarbershopsArray = [];
          response.forEach((doc) => {
            idBarbershopsArray.push(doc.data().idBarbershop);
          });

          getDataBarbershops(idBarbershopsArray).then((response) => {
            const barbershops = [];
            response.forEach((doc) => {
              let barbershop = doc.data();
              barbershop.id = doc.id;
              barbershops.push(barbershop);
            });
            setBarbershops(barbershops);
          });
        });
    }
    setReloadBarbershops(false);
  }, [reloadBarbershops]);

  const getDataBarbershops = (idBarbershopsArray) => {
    const arrayBarbershops = [];
    idBarbershopsArray.forEach((idBarbershop) => {
      const result = db.collection('restaurants').doc(idBarbershop).get();
      arrayBarbershops.push(result);
    });
    return Promise.all(arrayBarbershops);
  };

  if (!userLogged) {
    return <UserNoLogged setReloadBarbershops={setReloadBarbershops} navigation={navigation} />;
  }

  if (barbershops.length === 0) {
    return <NotFoundBarbershops setReloadBarbershops={setReloadBarbershops} />;
  }

  return (
    <View style={styles.viewBody}>
      <NavigationEvents onWillFocus={() => setReloadBarbershops(true)} />
      {barbershops ? (
        <FlatList
          data={barbershops}
          renderItem={(barbershop) => (
            <Barbershop
              barbershop={barbershop}
              navigation={navigation}
              setIsVisibleLoading={setIsVisibleLoading}
              setReloadBarbershops={setReloadBarbershops}
              toastRef={toastRef}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.loaderBarbershops}>
          <ActivityIndicator size="large" />
          <Text>Cargando barbershops</Text>
        </View>
      )}
      <Toast ref={toastRef} position="center" opacity={1} />
      <Loading text="Eliminando la barbería" isVisible={isVisibleLoding} />
    </View>
  );
}

function Barbershop(props) {
  const { barbershop, navigation, setIsVisibleLoading, setReloadBarbershops, toastRef } = props;
  const { id, name, images } = barbershop.item;
  const [imageBarbershop, setImageBarbershop] = useState(null);

  useEffect(() => {
    const image = images[0];
    firebase
      .storage()
      .ref(`restaurant-images/${image}`)
      .getDownloadURL()
      .then((response) => {
        setImageBarbershop(response);
      });
  }, []);

  const confirmRemoveFavorite = () => {
    Alert.alert(
      'Eliminar Barbershope de Favoritos',
      '¿Estas seguro de que quieres eliminar el barbershope de favoritos?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: removeFavorite,
        },
      ],
      { cancelable: false }
    );
  };

  const removeFavorite = () => {
    setIsVisibleLoading(true);
    db.collection('favorites')
      .where('idBarbershop', '==', id)
      .where('idUser', '==', firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection('favorites')
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsVisibleLoading(false);
              setReloadBarbershops(true);
              toastRef.current.show('Barbería eliminada correctamente');
            })
            .catch(() => {
              toastRef.current.show('Error al eliminar la barbería, intentelo más tarde');
            });
        });
      });
  };

  return (
    <View style={styles.barbershop}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Barbershop', { barbershop: barbershop.item })}
      >
        <Image
          resizeMode="cover"
          source={{ uri: imageBarbershop }}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator color="#fff" />}
        />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Icon
          type="material-community"
          name="heart"
          color="#00a680"
          containerStyle={styles.favorite}
          onPress={confirmRemoveFavorite}
          size={40}
          underlayColor="transparent"
        />
      </View>
    </View>
  );
}

function NotFoundBarbershops(props) {
  const { setReloadBarbershops } = props;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <NavigationEvents onWillFocus={() => setReloadBarbershops(true)} />
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>No tienes barbershops en tu lista</Text>
    </View>
  );
}

function UserNoLogged(props) {
  const { setReloadBarbershops, navigation } = props;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <NavigationEvents onWillFocus={() => setReloadBarbershops(true)} />
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
        Necesitas estar logeado para ver esta sección.
      </Text>
      <Button
        title="Ir al login"
        onPress={() => navigation.navigate('Login')}
        containerStyle={{ marginTop: 20, width: '80%' }}
        buttonStyle={{ backgroundColor: '#00a680' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  loaderBarbershops: {
    marginTop: 10,
    marginBottom: 10,
  },
  barbershop: {
    margin: 10,
  },
  image: {
    width: '100%',
    height: 180,
  },
  info: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: -30,
    backgroundColor: '#fff',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  favorite: {
    marginTop: -35,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 100,
  },
});
