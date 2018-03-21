/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Platform,
  AsyncStorage
} from 'react-native';

import { TabNavigator ,StackNavigator} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Root from './app/list/index.js';
import Edit from './app/video/index.js';
import Mine from './app/mine/index.js';
import Life from './app/life/index.js'
import Login from './app/mine/login.js';
import PlusArticle from './app/life/plusArticle.js'
import ArticleDetail from './app/life/detail.js'

const Second = StackNavigator({
  Life:{screen:Life},
  PlusArticle:{screen:PlusArticle},
  ArticleDetail:{screen:ArticleDetail}
  },
  {
   headerMode: 'none',
   mode: 'modal',
   navigationOptions: {
     gesturesEnabled: false,
     initialRouteName:Life,
   }
 })

const AllMine = StackNavigator({
  Mine:{screen:Mine},
  Login:{screen:Login}
  },
  {
   headerMode: 'none',
   mode: 'modal',
   navigationOptions: {
     gesturesEnabled: false,
     initialRouteName:Mine,
   }
 })
const RootTabs = TabNavigator({
  Root: {
    screen: Root,
    navigationOptions: {
      tabBarLabel:'首页',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-home' : 'ios-home-outline'}
          size={22}
          style={{ color: tintColor }}
        />
      )}
  },
  Second:{
    screen:Second,
    navigationOptions: {
      tabBarLabel:'生活',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-list' : 'ios-list-outline'}
          size={22}
          style={{ color: tintColor }}
        />
      )}
  },
  Edit: {
    screen: Edit,
    navigationOptions: {
      tabBarLabel:'视频',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-videocam' : 'ios-videocam-outline'}
          size={22}
          style={{ color: tintColor }}
        />
      )}
  },
  AllMine: {
    screen: AllMine,
    navigationOptions: ({navigation})=>({
      tabBarLabel:'我的',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-person' : 'ios-person-outline'}
          size={22}
          style={{ color: tintColor }}
        />
      )})
  }
},{
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: '#ee735c',
    inactiveTintColor:'#333',
    showLabel:true,
    showIcon:true,
    style: {
      backgroundColor: '#fff',
      padding:0
    },
    indicatorStyle:{
      width:0
    },
    allowFontScaling:true,
    iconStyle:{
      marginTop:Platform.OS === 'ios'?2:-2,
      marginBottom:Platform.OS === 'ios'?0:-10
    },
    labelStyle:{
      marginBottom:Platform.OS === 'ios'?2:-8,
      fontSize:10
    }

  }
})
export default class FoodSay extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      user:null,
      logined:false
    }
  }

  componentDidMount(){
    this._asyncAppStatus()
  }

  _asyncAppStatus(){
    let that = this
    AsyncStorage.getItem('user')
    .then((data)=>{
      let user = this.state.user
      let newState = {}
      if(data){
        user = JSON.parse(data)
      }
      //console.log(user.accessToken)
      if(user && user.accessToken){
        newState.user = user
        newState.logined = true
      }else{
        newState.logined = false
      }

      that.setState(newState)
    })
  }

  _afterLogin(user){
    let that = this
    user = JSON.stringify(user)
    //console.log(JSON.parse(user))
    AsyncStorage.setItem('user',user)
    .then(()=>{
      that.setState({
        logined:true,
        user:user
      })
    })
  }
  _logout(){
    AsyncStorage.removeItem('user')
    .then(()=>{
      this.setState({
        logined:false,
        user:null
      })
    })
  }

  render() {
    if(!this.state.logined){
      return <Login afterLogin ={this._afterLogin.bind(this)}/>
    }
   // if(this.state.logined){
   //    return <Mine user={this.state.user} logout={this._logout.bind(this)}/>
   //  } 
    return (
        <RootTabs/>
    );
  }
}



AppRegistry.registerComponent('FoodSay', () => FoodSay);