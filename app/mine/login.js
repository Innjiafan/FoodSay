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
  Alert
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'
import Button from 'react-native-button'

let CountDownText = require('react-native-sk-countdown').CountDownText

//console.log(CountDown)
import config  from './../common/config.js';
import request from './../common/request.js';

let width = Dimensions.get('window').width;

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = { 
      phoneNumber:'',
      codeSent:false,
      verifyCode:'',
      countingDone:false
    }
  }
  //
  _showVerifyCode(){
    this.setState({
      codeSent:true
    })
  }
  //发送验证码
  _sendVerifyCode(){
    let that=this
    let phoneNumber=this.state.phoneNumber
    if(!phoneNumber){
      return Alert.alert('手机号不能为空')
    }

    let body={
      phoneNumber:phoneNumber
    }

    let signupUrl = config.api.base2+config.api.signup
    console.log(signupUrl)
    request.post(signupUrl,body)
      .then((data)=>{
        if(data && data.success){
         // console.log(data)
          that._showVerifyCode()
        }else{
          Alert.alert('获取验证码失败，请检查手机号码是否正确')
        }
      })
      .catch((err)=>{
        console.log(err)
        Alert.alert('获取验证码失败，请检查网络是否良好')
      })

  }

  _submit(){
    let that=this
    let phoneNumber=this.state.phoneNumber
    let verifyCode = this.state.verifyCode
    if(!phoneNumber || !verifyCode){
      return Alert.alert('手机号或验证码不能为空')
    }

    let body={
      phoneNumber:phoneNumber,
      verifyCode:verifyCode
    }

    let verifyUrl = config.api.base2+config.api.verify
    request.post(verifyUrl,body)
      .then((data)=>{
        if(data && data.success){
          //console.log(data)
          that.props.afterLogin(data.data)
        }else{
          Alert.alert('获取验证码失败，请检查手机号码是否正确')
        }
      })
      .catch((err)=>{
        console.log(err)
        Alert.alert('获取验证码失败，请检查网络是否良好')
      })
  }

  //倒计时结束
  _countingDone(){
    this.setState({
      countingDone:true
    })
  }
  render(){
    return (
      <View style = {styles.container} >
        <View style={styles.signupBox}>
          <Text style={styles.title}>快速登录</Text>
          <TextInput
            placeholder='输入手机号'
            autoCaptialize={'none'}
            autoCorrect={false}
            underlineColorAndroid='transparent'
            keyboardType={'numeric'}
            style={styles.inpuField}
            onChangeText={(text)=>{
              this.setState({
                phoneNumber:text
              })
            }}
          />
          {
            this.state.codeSent
            ?<View style={styles.verifyCodeBox}>
              <TextInput
                placeholder='输入验证码'
                autoCaptialize={'none'}
                autoCorrect={false}
                underlineColorAndroid='transparent'
                keyboardType={'numeric'}
                style={styles.inputField}
                onChangeText={(text)=>{
                  this.setState({
                    verifyCode:text
                  })
                }}
                />
                {
                  this.state.countingDone
                  ? <Button style={styles.countBtn} onPress={this._sendVerifyCode.bind(this)}>获取验证码</Button>
                  : <CountDownText
                      style={styles.countBtn}
                      countType='seconds' // 计时类型：seconds / date
                      auto={true} // 自动开始
                      afterEnd={this._countingDone.bind(this)} // 结束回调
                      timeLeft={60} // 正向计时 时间起点为0秒
                      step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                      startText='获取验证码' // 开始的文本
                      endText='获取验证码' // 结束的文本
                      intervalText={(sec) => '剩余秒数'+sec} // 定时的文本回调
                    />
                }
            </View>
            :null
          }
          {
            this.state.codeSent
            ?<Button
              style={styles.btn}
              onPress={this._submit.bind(this)}>登录</Button>
            :<Button
              style={styles.btn}
              onPress={this._sendVerifyCode.bind(this)}>获取验证码</Button>
          }
        </View>
      </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10,
    backgroundColor: '#f9f9f9',
  },

  signupBox:{
    marginTop:30
  },

  title:{
    marginBottom:20,
    color:'#333',
    fontSize:20,
    textAlign:'center'
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
  verifyCodeBox:{
    marginTop:10,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  inputField:{
    flex:1,
    padding:5,
    height:40,
    color:'#666',
    fontSize:16,
    backgroundColor:'#fff',
    borderRadius:4,
    marginBottom:2
  },

  countBtn:{
    width:110,
    height:40,
    padding:10,
    marginLeft:8,
    backgroundColor:'transparent',
    borderColor:'#ee735c',
    textAlign:'left',
    fontWeight:'600',
    fontSize:15,
    borderRadius:2,
    color:'#ee735c'
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

})

module.exports = Login