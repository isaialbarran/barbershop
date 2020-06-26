import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions } from 'react-native';
import { Rating, ListItem, Icon } from 'react-native-elements';
import Carousel from '../../components/Carousel';
import Map from '../../components/Map';
import ListReviews from '../../components/Barbershops/ListReviews';
import Toast from 'react-native-easy-toast';

import { firebaseApp } from '../../utils/FireBase';
import firebase from 'firebase/app';
import 'firebase/firestore';
const db = firebase.firestore(firebaseApp);

const screenWidth = Dimensions.get('window').width;

export default function Barbershop(props) {
  const { navigation } = props;
  const { barbershop } = navigation.state.params;
  const [imagesBarbershop, setImagesBarbershop] = useState([]);
  const [rating, setRating] = useState(barbershop.rating);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const toastRef = useRef();

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useEffect(() => {
    const arrayUrls = [];
    (async () => {
      await Promise.all(
        barbershop.images.map(async (idImage) => {
          await firebase
            .storage()
            .ref(`restaurant-images/${idImage}`)
            .getDownloadURL()
            .then((imageUrl) => {
              arrayUrls.push(imageUrl);
            });
        })
      );
      setImagesBarbershop(arrayUrls);
    })();
  }, []);

  useEffect(() => {
    if (userLogged) {
      db.collection('favorites')
        .where('idBarbershop', '==', barbershop.id)
        .where('idUser', '==', firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
          if (response.docs.length === 1) {
            setIsFavorite(true);
          }
        });
    }
  }, []);

  const addFavorite = () => {
    if (!userLogged) {
      toastRef.current.show('Para usar el sistema de favoritos tienes que estar logeado', 2000);
    } else {
      const payload = {
        idUser: firebase.auth().currentUser.uid,
        idBarbershop: barbershop.id,
      };

      db.collection('favorites')
        .add(payload)
        .then(() => {
          setIsFavorite(true);
          toastRef.current.show('Barbería añadida a la lista de favoritos');
        })
        .catch(() => {
          toastRef.current.show(
            'Error al añadir la barbería a la lista de favoritos, intentelo más tarde'
          );
        });
    }
  };

  const removeFavorite = () => {
    db.collection('favorites')
      .where('idBarbershop', '==', barbershop.id)
      .where('idUser', '==', firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection('favorites')
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsFavorite(false);
              toastRef.current.show('Barbería eliminado de la lista de favoritos');
            })
            .catch(() => {
              toastRef.current.show(
                'No se ha podido eliminar la barbería de la lista de favoritos, intentelo mas tarde'
              );
            });
        });
      });
  };

  return (
    <ScrollView style={styles.viewBody}>
      <View style={styles.viewFavorite}>
        <Icon
          type="material-community"
          name={isFavorite ? 'heart' : 'heart-outline'}
          onPress={isFavorite ? removeFavorite : addFavorite}
          color={isFavorite ? '#00a680' : '#000'}
          size={35}
          underlayColor="transparent"
        />
      </View>
      <Carousel arrayImages={imagesBarbershop} width={screenWidth} height={250} />
      <TitleBarbershop
        name={barbershop.name}
        description={barbershop.description}
        rating={rating}
      />
      <BarbershopInfo
        location={barbershop.location}
        name={barbershop.name}
        address={barbershop.address}
      />
      <ListReviews navigation={navigation} idBarbershop={barbershop.id} setRating={setRating} />
      <Toast ref={toastRef} position="center" opacity={0.5} />
    </ScrollView>
  );
}

function TitleBarbershop(props) {
  const { name, description, rating } = props;

  return (
    <View style={styles.viewBarbershopTitle}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.nameBarbershop}>{name}</Text>
        <Rating style={styles.rating} imageSize={20} readonly startingValue={parseFloat(rating)} />
      </View>
      <Text style={styles.descriptionBarbershop}>{description}</Text>
    </View>
  );
}

function BarbershopInfo(props) {
  const { location, name, address } = props;

  const listInfo = [
    {
      text: address,
      iconName: 'map-marker',
      iconType: 'material-community',
      action: null,
    },
    {
      text: '111 222 333',
      iconName: 'phone',
      iconType: 'material-community',
      action: null,
    },
    {
      text: 'isaialbarran.com',
      iconName: 'at',
      iconType: 'material-community',
      action: null,
    },
  ];

  return (
    <View style={styles.viewBarbershopInfo}>
      <Text style={styles.barbershopInfoTitle}>Información sobre el barbershope</Text>
      <Map location={location} name={name} height={100} />
      {listInfo.map((item, index) => (
        <ListItem
          key={index}
          title={item.text}
          leftIcon={{
            name: item.iconName,
            type: item.iconType,
            color: '#00a680',
          }}
          containerStyle={styles.containerListItem}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
  },
  viewFavorite: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 100,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 5,
  },
  viewBarbershopTitle: {
    margin: 15,
  },
  nameBarbershop: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rating: {
    position: 'absolute',
    right: 0,
  },
  descriptionBarbershop: {
    marginTop: 5,
    color: 'grey',
  },
  viewBarbershopInfo: {
    margin: 15,
    marginTop: 25,
  },
  barbershopInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  containerListItem: {
    borderBottomColor: '#d8d8d8',
    borderBottomWidth: 1,
  },
});
