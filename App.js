import React from 'react';
import Navigation from './app/navigations/Navigation';
import { firebaseApp } from './app/utils/FireBase';
import { YellowBox } from 'react-native';
import { decode, encode } from 'base-64';
import Login from './app/screens/Account/Login';
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

YellowBox.ignoreWarnings(['Setting a timer']);

export default function App() {
  return <Navigation />;
}
