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
  Platform,
  AsyncStorage
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'
import Button from 'react-native-button'
import { StackNavigator } from 'react-navigation'

import navigationUtil from '../common/navigationUtil'
import config  from './../common/config.js';
import request from './../common/request.js';
import Regist from './regist.js'

let width = Dimensions.get('window').width;

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = { 
      nickname:'',
      password:'',
    }
  }

  _submit(){
    let that=this
    let nickname=this.state.nickname
    let password = this.state.password
    if(!nickname || !password){
      return Alert.alert('用户名或密码不能为空')
    }

    let body={
      nickname:nickname,
      password:password
    }

    let loginUrl = config.api.base3+config.api.login
    console.log(loginUrl)
    request.post(loginUrl,body)
      .then((data)=>{
        console.log(111+JSON.stringify(data))
        if(data && data.success){
          console.log(data.data)
          // navigationUtil.reset(this.props.navigation, 'Main')
          // AsyncStorage.setItem('user',JSON.stringify(data.data))
          // console.log(AsyncStorage.getItem('user'))
          that.props.afterLogin(data.data)
          //that.props.navigation.navigate('Main',{data:data.data})
        }else{
          Alert.alert('登录失败，请检查用户名或密码是否正确')
        }
      })
      .catch((err)=>{
        console.log(err)
        Alert.alert('登录失败，请检查网络是否良好')
      })
  }

  _regist(){
    this.props.navigation.navigate('Regist')
  }
  render(){
    return (
      <View style = {styles.container} >
        <View style = {styles.header}>
          <Text style = {styles.headerTitle}>登录页面</Text>
        </View>
        <View style={styles.signupBox}>
          <TextInput
            placeholder='输入用户名'
            autoCaptialize={'none'}
            autoCorrect={false}
            underlineColorAndroid='transparent'
            style={styles.inpuField}
            onChangeText={(text)=>{
              this.setState({
                nickname:text
              })
            }}
          />
          <TextInput
            placeholder='输入密码'
            autoCaptialize={'none'}
            autoCorrect={false}
            secureTextEntry ={true}
            underlineColorAndroid='transparent'
            keyboardType={'numeric'}
            style={styles.inpuField}
            onChangeText={(text)=>{
              this.setState({
                password:text
              })
            }}
          />
          <Button
              style={styles.btn}
              onPress={this._submit.bind(this)}>登录</Button>
          <View style={styles.signInBox}>
            <Text>还没账号？<Text style={styles.signIn} onPress={this._regist.bind(this)}>前去注册</Text></Text>
          </View>
        </View>
      </View>
      )
  }
}

// const Login = StackNavigator({
//   Loginer: {
//     screen: Loginer,
//   },
//   Regist: {
//     screen: Regist,
//   }
// },
// {
//    headerMode: 'none',
//    mode: 'modal',
//    navigationOptions: {
//      gesturesEnabled: false,
//      initialRouteName:Loginer,
//    }
//  }
// )

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  signupBox:{
    padding:10
  },
  header:{
    marginTop:Platform.OS === 'ios'?20:0,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: '#ee735c',
  },
  headerTitle: {
    color:'#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },

  inpuField:{
    padding:5,
    height:40,
    color:'#666',
    fontSize:16,
    backgroundColor:'#fff',
    borderRadius:4,
    marginBottom:2
  },
  btn:{
    padding:10,
    marginTop:10,
    backgroundColor:'transparent',
    borderColor:'#ee735c',
    borderWidth:1,
    borderRadius:4,
    color:'#ee735c'
  },
  signInBox:{
    marginTop:10,
    alignItems:'flex-end'
  },
  signIn:{
    textAlign:'right',
     color:'#ee735c',
     fontSize:14
  }

})

module.exports = Login