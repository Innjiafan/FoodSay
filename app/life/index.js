/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

//es6
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  Alert,
  Platform
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'
import Button from 'react-native-button'
import PlusArticle from './plusArticle.js'

let width = Dimensions.get('window').width;

class Life extends Component {

  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  _plusArticle(){
    this.props.navigation.navigate('PlusArticle')
  }
  render(){
    return (
      <View style = {styles.container} >
        <View style={styles.toolbar}>
           <Icon
              name = 'ios-add'
              size = {30}
              style = {styles.plusArticle}
              onPress={this._plusArticle.bind(this)}
          />
          <Text style={styles.toolbarTitle}>
           生活社区
          </Text>
        </View>
      </View>
      )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9'
  },
  toolbar:{
    marginTop:Platform.OS === 'ios'?20:0,
    paddingBottom: 8,
    // paddingTop: 8,
    backgroundColor: '#ee735c',
    flexDirection:'row',
    //position:'relative'
  },
  toolbarTitle: {
    color:'#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    marginTop:8,
    marginLeft:width/2-60,
  },
  plusArticle:{
    color:'#fff',
    marginLeft:8,
    marginTop:4
    // position:'absolute',
    // top:0,
    // left:0
  },

})

module.exports = Life
