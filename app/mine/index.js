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
  TouchableOpacity,
  Dimensions,
  Image ,
  AsyncStorage,
  Platform,
  Alert,
  Modal,
  TextInput
} from 'react-native';

import Button from 'react-native-button'
import Icon from 'react-native-vector-icons/Ionicons';
import sha1 from 'sha1';
import * as Progress from 'react-native-progress'
//let ImagePicker = require('NativeModules').ImagePickerManager
let ImagePicker = require('react-native-image-picker')

import config  from './../common/config.js';
import request from './../common/request.js';
import Login from './login.js'
let width = Dimensions.get('window').width

//从相册选择图片
let photoOptions = {
  title: '选择头像',
  cancelButtonTitle:'取消',
  takePhotoButtonTitle:'拍照',
  chooseFromLibraryButtonTitle:'选择相册',
  quality:0.75,
  allowsEditing:true,
  noData:false,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
}

// let CLOUDINARY = {
//   cloud_name: 'foodsay',  
//   api_key: '393474798975923',  
//   //api_secret: 'SWOBZi6maQ74pYi_-dY_jrTNo20',  
//   base:'http://res.cloudinary.com/foodsay',
//   image: 'https://api.cloudinary.com/v1_1/foodsay/image/upload',
//   video:' https://api.cloudinary.com/v1_1/foodsay/video/upload'
// }
function avatar(id,type){
  if(id.indexOf('http')>-1){
    return id
  }
  if(id.indexOf('data:image') >-1){
    return id
  }

  // if(id.indexOf('avatar/')>-1){
  //   return CLOUDINARY.base + '/' +type +'/upload/' + id
  // }
  return 'http://p3kjn8fdy.bkt.clouddn.com/'+id
}
class Mine extends Component {

  constructor(props) {
    super(props)
    let user = this.props.user||{}
    this.state = { 
     user:user,
     avatarProgress:0,
     avatarUploading:false,
     animationType:'fade',
     modalVisible:false,
     logined:false
    }
  }

  componentDidMount(){
    let that = this
    AsyncStorage.getItem('user')
    .then((data)=>{
      let user
      if(data){
        user = JSON.parse(data)
        console.log(user)
      }
      if(user && user.accessToken){
        that.setState({
          user:user
        })
      }
    })
  }

  _edit(){
    this.setState({
      modalVisible:true
    })
  }

  _closeModal(){
    this.setState({
      modalVisible:false
    })
  }

  _getQiniuToken(){
    let accessToken = this.state.user.accessToken
    let signatureURL=config.api.base3 + config.api.signature
    //console.log(signatureURL)
    return request.post(signatureURL,{
        accessToken:accessToken,
        cloud:'qiniu',
        type:'avatar'
      })
      .catch((err)=>{
        console.log(err)
      }) 
  }
  //从相册中获取图片
  _pickPhoto(){
    let that = this
    ImagePicker.showImagePicker(photoOptions, (res) => {
     // console.log('response = ', res);
      if (res.didCancel) {
        return
      }
      let avatarData = 'data:image/jpeg;base64,'+res.data;
      let user = this.state.user;
      let uri = res.uri 
      //console.log(uri)
      that._getQiniuToken()
        .then((data)=>{
          if(data && data.success){
          //console.log(data.data)
          let token = data.data.token
          let key = data.data.key
          let body = new FormData()
          body.append('token',token)
          body.append('key',key)
          body.append('file',{
            type:'image/jpeg',
            uri:uri,
            name:key,
          })

          //console.log(body)
          that._upload(body)
          }
        })
      // request.post(signatureURL,{
      //   accessToken:accessToken,
      //   timestamp:timestamp,
      //   // folder:folder,
      //   // tags:tags,
      //   type:'avatar'
      // })
      // .catch((err)=>{
      //   console.log(err)
      // })
      // .then((data)=>{
      //   console.log(data)
      //   if(data && data.success){
      //     // let signature='folder='+folder+'&tags='+tags+'&timestamp='+timestamp+CLOUDINARY.api_secret
          
      //     // signature=sha1(signature)
      //     //let signature = data.data
      //     let signature = data.data
      //     let body = new FormData()
      //     //console.log(body)

      //     body.append('folder',folder)
      //     body.append('signature',signature)
      //     body.append('tags',tags)
      //     body.append('timestamp',timestamp)
      //     body.append('api_key',CLOUDINARY.api_key)
      //     body.append('resource_type','image')
      //     body.append('file',avatarData)


      //     that._upload(body)
      //   }
      // })
    })
  }

  _upload(body){
    let that = this
    let xhr = new XMLHttpRequest()
    let url = config.qiniu.upload

    console.log(url)
    this.setState({
      avatarUploading:true,
      avatarProgress:0
    })
    xhr.open('POST',url)
    xhr.onload=()=>{
      if(xhr.status !== 200){
        Alert.alert('请求失败')
        console.log(xhr.responseText)
        return
      }

      if(!xhr.responseText){
        Alert.alert('请求失败')
        return 
      }

      let response
      try{
        response = JSON.parse(xhr.response)
        console.log(response)
      }
      catch(e){
        console.log(e)
        console.log('parse fail')
      }
      if(response){
        let user = this.state.user
        if(response.public_id){
          user.avatar = response.public_id
        }

        if(response.key){
          user.avatar = response.key
        }

        console.log(user.avatar)
        that.setState({
          avatarUploading:false,
          avatarProgress:0,
          user:user
        })

        that._asycUser(true)
      }
    }

    if(xhr.upload){
      xhr.upload.onprogress = (event)=>{
        if(event.lengthComputable){
          let percent = Number((event.loaded /event.total).toFixed(2))

          that.setState({
            avatarProgress:percent
          })
        }
      }
    }
    xhr.send(body)
  }

  //将头像信息更改传递给服务器
  _asycUser(isAvatar){
    let that = this
    let user = this.state.user
    if(user && user.accessToken){
      let url = config.api.base3 + config.api.update
      request.post(url,user)
      .then((data)=>{
        if(data && data.success){
          let user = data.data
          console.log(user)
          if(isAvatar){
             Alert.alert('头像更新成功')
          }
          that.setState({
            user:user
          },function(){
            that._closeModal()
            AsyncStorage.setItem('user',JSON.stringify(user))
          })
        }
      })
    }
  }

  _submit(){
    this._asycUser(false)
  }

  _logout(){
    let that = this
    // console.log(this.props.navigation)
    // AsyncStorage.removeItem('user')
    // .then(()=>{
    //   that.setState({
    //     logined:false,
    //     // user:null
    //   })
    // })
    //this.props.navigation.goBack()
    
  }

  _changeUserState(key,value){
    let user = this.state.user
    user[key] = value
    this.setState({
      user:user
    })
    //console.log(user)
  }


  render(){
    let user = this.state.user
    //user = JSON.parse(user)
    console.log(user);
    return (
      <View style = {styles.container} >
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>我的页面</Text>
          <Text style={styles.toolbarEdit} onPress={this._edit.bind(this)}>编辑</Text>
        </View>

        {
          user.avatar
          ?<View>
           <TouchableOpacity onPress={this._pickPhoto.bind(this)} style={styles.avatarContainer}>
              <Image source={{uri:avatar(user.avatar,'image')}} style={styles.avatarContainer}>
                <View style={styles.avatarBox}>
                  {this.state.avatarUploading
                  ?<Progress.Circle 
                  showsText={true}
                  color={'#ee735c'}
                  progress={this.state.avatarProgress}
                  size={70}  />
                  : <Image
                    source={{uri:avatar(user.avatar,'image')}}
                    style={styles.avatar}
                  />
                  }
                </View>
                <Text style={styles.avatarTip}>切换头像</Text>
              </Image>  
           </TouchableOpacity>
          </View>
          : <TouchableOpacity onPress={this._pickPhoto.bind(this)} style={styles.avatarContainer}> 
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarTip}>添加头像</Text>
                <View style={styles.avatarBox}>
                  {this.state.avatarUploading
                  ?<Progress.Circle 
                  showsText={true}
                  color={'#ee735c'}
                  progress={this.state.avatarProgress}
                  size={70}  />
                  :<Icon
                    name='ios-cloud-upload-outline'
                    style={styles.plusIcon}
                    />
                  }
                </View>
              </View>
            </TouchableOpacity>
        }
        <Modal
          animationType = {this.state.animationType}
          visible={this.state.modalVisible}
          onRequestClose = {()=>{this._setModalVisible(false).bind(this)}} >
          <View style={styles.modalContainer}>
            <Icon
              name='ios-close-outline'
              style={styles.closeIcon}
              onPress={this._closeModal.bind(this)}
              />
              <View style={styles.fieldItem}>
                <Text style={styles.label}>昵称</Text>
                <TextInput
                  placeholder={'输入你的昵称'}
                  style={styles.inputField}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  defaultValue={user.nickname}
                  onChangeText={(Text)=>{
                    this._changeUserState.bind(this,'nickname',Text)
                  }}
                />
              </View>
              <View style={styles.fieldItem}>
                <Text style={styles.label}>年龄</Text>
                <TextInput
                  placeholder={'输入你的年龄'}
                  style={styles.inputField}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  defaultValue={user.age}
                  onChangeText={(text)=>{
                    this._changeUserState('age',text)
                  }}
                />
              </View>
              <View style={styles.fieldItem}>
                <Text style={styles.label}>电话</Text>
                <TextInput
                  placeholder={'输入你的手机号码'}
                  style={styles.inputField}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  defaultValue={user.phoneNumber}
                  onChangeText={(text)=>{
                    this._changeUserState('phoneNumber',text)
                  }}
                />
              </View>
              <View style={styles.fieldItem}>
                <Text style={styles.label}>性别</Text>
                <Icon.Button
                  onPress={()=>{
                    this._changeUserState('gender','male')
                  }}
                  style={[styles.gender,
                          user.gender === 'male'&& styles.genderChecked]}
                  name='ios-paw'>男 </Icon.Button>
                  <Icon.Button
                  onPress={()=>{
                    this._changeUserState('gender','female')
                  }}
                  style={[styles.gender,
                          user.gender ==='female'&& styles.genderChecked]}
                  name='ios-paw-outline'>女</Icon.Button>
              </View>
              <View style={styles.fieldItem1}>
                <Text style={styles.label}>简介</Text>
                <TextInput
                  placeholder={'输入你的个人简介'}
                  style={styles.inputField1}
                  autoCorrect={false}
                  defaultValue={user.description}
                  multiline = {true}
                  onChangeText={(text)=>{
                    this._changeUserState('description',text)
                  }}
                />
              </View>
              <Button
              style={styles.btn}
              onPress={this._submit.bind(this)}
              >保存资料</Button>
          </View>

        </Modal>
        <Button
              style={styles.btn}
              onPress={this._logout.bind(this)}
              >退出登录</Button>
      </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  toolbar:{
    flexDirection:'row',
    paddingBottom:6,
    paddingTop:6,
    backgroundColor: '#ee735c',
    marginTop:Platform.OS === 'ios'?20:0,

  },
  toolbarTitle:{
    flex:1,
    fontSize:16,
    color:'#fff',
    textAlign:'center',
    fontWeight:'600',
    marginLeft:34,
    //justifyContent:'center'
  },
  //edit
  toolbarEdit:{
    // position:'absolute',
    // right:10,
    // top:Platform.OS === 'ios'?28:8,
    //flex:1,
    //justifyContent:'flex-end',
    marginTop:8,
    marginRight:10,
    color:'#fff',
    textAlign:'right',
    fontWeight:'600',
    fontSize:12
  },

  modalContainer:{
    flex:1,
    paddingTop:50,
    backgroundColor:'#fff'
  },
  fieldItem:{
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    height:50,
    paddingLeft:15,
    paddingRight:15,
    borderColor:'#eee',
    borderBottomWidth:1,
  },
  fieldItem1:{
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    height:100,
    paddingLeft:15,
    paddingRight:15,
    borderColor:'#eee',
    borderBottomWidth:1,
  },
  closeIcon:{
    position:'absolute',
    width:40,
    height:40,
    fontSize:32,
    right:20,
    top:30,
    color:'#ee735c'
  },
  label:{
    color:'#ccc',
    marginRight:120
  },
  inputField:{
    height:50,
    flex:1,
    color:'#666',
    fontSize:14
  },
  inputField1:{
    height:70,
    flex:1,
    color:'#666',
    fontSize:14
  },
  avatarContainer:{
    width:width,
    height:140,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#333'
  },

  avatarBox:{
    marginTop:15,
    alignItems:'center',
    justifyContent:'center'
  },

  plusIcon:{
    padding:20,
    paddingLeft:25,
    paddingRight:25,
    color:'#999',
    fontSize:24,
    backgroundColor:'#fff',
    borderRadius:8
  },
  avatar:{
    marginBottom:15,
    width:width*.2,
    height:width*.2,
    resizeMode:'cover',
    borderRadius:width*0.1,
    borderWidth:1,
    borderColor:'#fff'
  },
  avatarTip:{
    color:'#fff',
    backgroundColor:'transparent',
    fontSize:14
  },

  gender:{
    backgroundColor:'#ccc',
  },
  genderChecked:{
    backgroundColor:'#ee735c'
  },
  btn:{
    padding:10,
    marginTop:25,
    marginRight:10,
    marginLeft:10,
    backgroundColor:'transparent',
    borderColor:'#ee735c',
    borderWidth:1,
    borderRadius:4,
    color:'#ee735c'
  },

})

module.exports = Mine;