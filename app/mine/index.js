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
  Alert
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import sha1 from 'sha1';
//let ImagePicker = require('NativeModules').ImagePickerManager
let ImagePicker = require('react-native-image-picker')

import config  from './../common/config.js';
import request from './../common/request.js';
 
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

let CLOUDINARY = {
  cloud_name: 'foodsay',  
  api_key: '393474798975923',  
  api_secret: 'SWOBZi6maQ74pYi_-dY_jrTNo20',  
  base:'http://res.cloudinary.com/foodsay',
  image: 'https://api.cloudinary.com/v1_1/foodsay/image/upload',
  video:' https://api.cloudinary.com/v1_1/foodsay/video/upload'
}
function avatar(id,type){
  return CLOUDINARY.base + '/' +type +'/upload/' + id
}
class Mine extends Component {

  constructor(props) {
    super(props)
    let user = this.props.user||{}
    this.state = { 
     user:user
    }
  }

  componentDidMount(){
    let that = this
    AsyncStorage.getItem('user')
    .then((data)=>{
      let user
      if(data){
        user = JSON.parse(data)[0]
         //console.log(user)
      }
      if(user && user.accessToken){
        that.setState({
          user:user
        })
      }
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
      // user.avatar = avatarData;
      // that.setState({
      //   user:user
      // })

      let timestamp = Date.now()
      let tags = 'app,avatar'
      let folder = 'avatar'
      let signatureURL=config.api.base2 + config.api.signature
      let accessToken = this.state.user.accessToken

      request.post(signatureURL,{
        accessToken:accessToken,
        timestamp:timestamp,
        folder:folder,
        tags:tags,
        type:'avatar'
      })
      .catch((err)=>{
        console.log(err)
      })
      .then((data)=>{
        console.log(data)
        if(data && data.success){
          let signature='folder='+folder+'&tags='+tags+'&timestamp='+timestamp+CLOUDINARY.api_secret
          
          signature=sha1(signature)
          let body = new FormData()
          //console.log(body)

          body.append('folder',folder)
          body.append('signature',signature)
          body.append('tags',tags)
          body.append('timestamp',timestamp)
          body.append('api_key',CLOUDINARY.api_key)
          body.append('resource_type','image')
          body.append('file',avatarData)


          that._upload(body)
        }
      })
      // else if (res.error) {
      //   console.log('ImagePicker Error: ', res.error);
      // }
      // else if (res.customButton) {
      //   console.log('User tapped custom button: ', res.customButton);
      // }
      // else {
      //   let source = { uri: res.uri };
     
      //   // You can also display the image using data:
      //   // let source = { uri: 'data:image/jpeg;base64,' + res.data };
      // }
    })
  }

  _upload(body){
    console.log(body)
    let that = this
    let xhr = new XMLHttpRequest()
    let url = CLOUDINARY.image

    xhr.open('POST',url)
    xhr.onload=()=>{
      if(xhr.status != 200){
        Alert.alert('请求失败')
        console.log(xhr.responseText)

        return
      }

      if(!xhr.responseText){
        Alert.alert('请求失败')
        return 
      }

      let response
      console.log(response)
      try{
        response = JSON.parse(xhr.response)
        console.log(response)
      }
      catch(e){
        console.log(e)
        console.log('parse fail')
      }

      if(response && response.public_id){
        let user = this.state.user
        user.avatar = avatar(response.public_id,'image')
        console.log(user.avatar)
        that.setState({
          user:user
        })
      }
    }
    xhr.send(body)
  }

  render(){
    let user = this.state.user
    //console.log(user.avatar);
    return (
      <View style = {styles.container} >
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>我的页面</Text>
        </View>

        {
          user.avatar
          ?<View>
           <TouchableOpacity onPress={this._pickPhoto.bind(this)} style={styles.avatarContainer}>
              <Image source={{uri:user.avatar}} style={styles.avatarContainer}>
                <View style={styles.avatarBox}>
                  <Image
                    source={{uri:user.avatar}}
                    style={styles.avatar}
                  />
                </View>
                <Text style={styles.avatarTip}>切换头像</Text>
              </Image>  
           </TouchableOpacity>
          </View>
          : <TouchableOpacity onPress={this._pickPhoto.bind(this)} style={styles.avatarContainer}> 
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarTip}>添加头像</Text>
                <View style={styles.avatarBox}>
                  <Icon
                    name='ios-cloud-upload-outline'
                    style={styles.plusIcon}
                    />
                </View>
              </View>
            </TouchableOpacity>
        }
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
    fontWeight:'600'
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
  }
})

module.exports = Mine;