import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, Text } from 'react-native';
import { SearchBar, ListItem, Icon } from 'react-native-elements';
import { useDebouncedCallback } from 'use-debounce';
import { FireSQL } from 'firesql';
import firebase from 'firebase/app';

const fireSQL = new FireSQL(firebase.firestore(), { includeId: 'id' });

export default function Search(props) {
  const { navigation } = props;
  const [barbershops, setBarbershops] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    onSearch();
  }, [search]);

  const [onSearch] = useDebouncedCallback(() => {
    if (search) {
      fireSQL.query(`SELECT * FROM restaurants WHERE name LIKE '${search}%'`).then((response) => {
        setBarbershops(response);
      });
    }
  }, 300);

  return (
    <View>
      <SearchBar
        placeholder="Busca tu barbería..."
        onChangeText={(e) => setSearch(e)}
        value={search}
        containerStyle={styles.searchBar}
      />
      {barbershops.length === 0 ? (
        <NoFoundBarbershops />
      ) : (
        <FlatList
          data={barbershops}
          renderItem={(barbershop) => (
            <Barbershop barbershop={barbershop} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

function Barbershop(props) {
  const { barbershop, navigation } = props;
  const { name, images } = barbershop.item;
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

  return (
    <ListItem
      title={name}
      leftAvatar={{ source: { uri: imageBarbershop } }}
      rightIcon={<Icon type="material-community" name="chevron-right" />}
      onPress={() => navigation.navigate('Barbershop', { barbershop: barbershop.item })}
    />
  );
}

function NoFoundBarbershops() {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Image
        source={require('../../assets/img/not-barbershop-found.png')}
        resizeMode="cover"
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 20,
  },
});
