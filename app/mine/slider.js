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
  Dimensions,
  Alert,
  Platform,
  Image
} from 'react-native';

import Swiper from 'react-native-swiper'
import Button from 'react-native-button'

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
class Slider extends Component {

  constructor(props) {
    super(props)
    this.state = { 
      loop:false,
      banners:[
        require('../assets/images/s6.jpeg'),
        require('../assets/images/s5.jpeg'),
        require('../assets/images/s4.jpeg')
      ]
    }
  }
  _enter(){
    this.props.enterSlide()
  }

  render(){
    return (
        <Swiper 
          style={styles.container} 
          dot={<View style={styles.dot}/>}
          activeDot={<View style={styles.activeDot}/>}
          paginationStyle={styles.pagination}
          loop={this.state.loop}
        >
          <View style={styles.slide}>
            <Image style={styles.image} source={
              this.state.banners[2]
            }></Image>
          </View>
          <View style={styles.slide}>
            <Image style={styles.image} source={
              this.state.banners[1]
            }></Image>
          </View>
          <View style={styles.slide}>
            <Image style={styles.image} source={
              this.state.banners[0]
            }>
              <Text
              style={styles.btn}
              onPress={this._enter.bind(this)}
              >进入app</Text>
            </Image> 
          </View>
        </Swiper>
    )
}}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor:'#fff'
  },
  slide:{
    flex:1,
    width:width,
    height:height
  },
  image:{
    width:width,
    height:height,
    resizeMode:'cover'
  },
  dot:{
    backgroundColor:'transparent',
    borderColor:'#ccc',
    width:12,
    height:12,
    borderWidth:1,
    borderRadius:6,
    marginLeft:12,
    marginRight:12
  },
  activeDot:{
    width:12,
    height:12,
    borderWidth:1,
    borderRadius:6,
    borderColor:'#ee735c',
    marginLeft:12,
    marginRight:12,
    backgroundColor:'#ee735c'
  },
  pagination:{
    bottom:50
  },
  btn:{
    //position:'absolute',
    // left:70,
    //bottom:10,
    color:'#fff',
    fontSize:18,
    marginTop:10,
    marginLeft:width-100,

  }
})

module.exports = Slider