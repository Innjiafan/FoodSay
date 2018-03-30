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
  AsyncStorage,
  ActivityIndicator,
  Dimensions
} from 'react-native';

import { TabNavigator ,StackNavigator} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Root from './app/list/index.js';
import Message from './app/message/index.js';
import Mine from './app/mine/index.js';
import Life from './app/life/index.js'
import Login from './app/mine/login.js';
import Slider from './app/mine/slider.js';
import PlusArticle from './app/life/plusArticle.js'
import ArticleDetail from './app/life/detail.js'

let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
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
  Message: {
    screen: Message,
    navigationOptions: {
      tabBarLabel:'信箱',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-book' : 'ios-book-outline'}
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
      logined:false,
      booted:false,
      entered:false
    }
  }

  componentDidMount(){
    this._asyncAppStatus()
  }

  _asyncAppStatus(){
    let that = this
    AsyncStorage.multiGet(['user','entered'])
    .then((data)=>{
      let userData=data[0][1]
      let  entered=data[1][1]
      let newState = {
        booted:true
      }
      if(data){
        user = JSON.parse(userData)
      }
      //console.log(user.accessToken)
      if(user && user.accessToken){
        newState.user = user
        newState.logined = true
      }else{
        newState.logined = false
      }

      if(entered === 'yes'){
        newState.entered = true
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

  _enterSlide(){
    this.setState({
      entered:true
    },()=>{
      AsyncStorage.setItem('entered','yes')
    })
  }

  render() {

    if(!this.state.booted){
      return(
        <View style={styles.bootPage}>
          <ActivityIndicator
            style={[styles.loadingMore, {height: 26}]}
            size="small"
          />
        </View>
      )
    }
    if(!this.state.entered){
      return <Slider enterSlide={this._enterSlide.bind(this)}/>
    }
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

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#f5fcff'
  },
  bootPage:{
    width:width,
    height:height,
    backgroundColor:'#fff',
    justifyContent:'center'
  },
   loadingMore:{
    marginVertical:20
  }
})


AppRegistry.registerComponent('FoodSay', () => FoodSay);