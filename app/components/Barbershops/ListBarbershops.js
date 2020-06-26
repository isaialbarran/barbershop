import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'react-native-elements';
import * as firebase from 'firebase';

export default function ListBarbershops(props) {
  const { barbershops, isLoading, handleLoadMore, navigation } = props;

  return (
    <View>
      {barbershops ? (
        <FlatList
          data={barbershops}
          renderItem={(barbershop) => (
            <Barbershop barbershop={barbershop} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<FooterList isLoading={isLoading} />}
        />
      ) : (
        <View style={styles.loaderBarbershops}>
          <ActivityIndicator size="large" />
          <Text>Cargando barberías</Text>
        </View>
      )}
    </View>
  );
}

function Barbershop(props) {
  const { barbershop, navigation } = props;
  const { name, address, description, images } = barbershop.item.barbershop;
  const [imageBarbershop, setImageBarbershop] = useState(null);

  useEffect(() => {
    const image = images[0];
    firebase
      .storage()
      .ref(`restaurant-images/${image}`)
      .getDownloadURL()
      .then((result) => {
        setImageBarbershop(result);
      });
  });

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Barbershop', {
          barbershop: barbershop.item.barbershop,
        })
      }
    >
      <View style={styles.viewBarbershop}>
        <View style={styles.viewBarbershopImage}>
          <Image
            resizeMode="cover"
            source={{ uri: imageBarbershop }}
            style={styles.imageBarbershop}
            PlaceholderContent={<ActivityIndicator color="fff" />}
          />
        </View>
        <View>
          <Text style={styles.barbershopName}>{name}</Text>
          <Text style={styles.barbershopAddress}>{address}</Text>
          <Text style={styles.barbershopDescription}>{description.substr(0, 60)}...</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FooterList(props) {
  const { isLoading } = props;

  if (isLoading) {
    return (
      <View style={styles.loadingBarbershops}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <View style={styles.notFoundBarbershops}>
        <Text>No quedan barberías por cargar</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingBarbershops: {
    marginTop: 20,
    alignItems: 'center',
  },
  viewBarbershop: {
    flexDirection: 'row',
    margin: 10,
  },
  viewBarbershopImage: {
    marginRight: 15,
  },
  imageBarbershop: {
    width: 80,
    height: 80,
  },
  barbershopName: {
    fontWeight: 'bold',
  },
  barbershopAddress: {
    paddingTop: 2,
    color: 'grey',
  },
  barbershopDescription: {
    paddingTop: 2,
    color: 'grey',
    width: 300,
  },
  loaderBarbershops: {
    marginTop: 10,
    marginBottom: 10,
  },
  notFoundBarbershops: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
});
