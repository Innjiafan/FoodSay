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
  Platform,
  Alert,
  AsyncStorage,
  TextInput
} from 'react-native';

import * as Progress from 'react-native-progress'
import Icon from 'react-native-vector-icons/Ionicons';
let Video = require('react-native-video').default;
let ImagePicker = require('react-native-image-picker')
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;

import config  from './../common/config.js';
import request from './../common/request.js';
//从相册选择图片
let videoOptions = {
  title: '选择视频',
  cancelButtonTitle:'取消',
  takePhotoButtonTitle:'录制10秒视频',
  chooseFromLibraryButtonTitle:'选择已有视频',
  videoQuality:'medium',
  mediaType:'video',
  durationLimit:10,
  noData:false,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
}
class Edit extends Component {

  constructor(props) {
    super(props)
    let user = this.props.user||{}
    this.state = {
      user:user,
      previewVideo:null,

      //video upload
      title:null,
      video:null,
      videoUploaded:false,
      videoUploading:false,
      videoUploadedProgress:0.01,
      
      //video player
      rate:1.0,
      muted:false,
      resizeMode:'contain',
      repeat:false,

      videoOk:true,
      paused:false,
      videoLoaded:false,
      videoProgress:0.01,
      videoTotal:0,
      currentTime:0,
      playing:false,
    }
  }

  componentDidMount(){
    let that = this
    AsyncStorage.getItem('user')
    .then((data)=>{
      let user
      if(data){
        user = JSON.parse(data)
        //console.log(user)
      }
      if(user && user.accessToken){
        that.setState({
          user:user
        })
      }
    })
  }


  _onLoadStart(){
    console.log('load start')
  }
  _onLoad(){
    console.log('load')
  }
  _onProgress(data){
    if(!this.state.videoLoaded){
      this.setState({
        videoLoaded:true
      })
    }
    
    //console.log(data);
    let duration = data.playableDuration
    let currentTime = data.currentTime
    let percent = Number((currentTime / duration).toFixed(2))
    let newState = {
      videoTotal:duration,
      currentTime:Number(data.currentTime.toFixed(2)),
      videoProgress:percent
    }

    if(!this.state.videoLoaded){
      newState.videoLoaded = true
    }

     if(!this.state.playing){
      newState.playing = true
    }
    this.setState(newState)
  }
  _onEnd(){
    this.setState({
      videoProgress:1,
      playing:false
    })
  }
  _onError(error){
    //console.log(error)
    this.setState({
        videoOk:false
    })
  }

  _rePlay(){
    this.ref.videoPlayer.seek(0)
  }

  //zanting
  _pause(){
    if(!this.state.paused){
      this.setState({
        paused:true
      })
    }
  }

  _resume(){
    if(this.state.paused){
      this.setState({
        paused:false
      })
    }
  }


  _getQiniuToken(){
    let accessToken = this.state.user.accessToken
    let signatureURL=config.api.base3 + config.api.signature
    return request.post(signatureURL,{
        accessToken:accessToken,
        cloud:'qiniu',
        type:'video'
      })
      .catch((err)=>{
        console.log(err)
      }) 
  }

  _pickVideo(){
    let that = this
    ImagePicker.showImagePicker(videoOptions, (res) => {
     // console.log('response = ', res);
      if (res.didCancel) {
        return
      }
      let uri = res.uri 
      that.setState({
        previewVideo:uri
      })
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
            type:'video/mp4',
            uri:uri,
            name:key
          })

          console.log(body)
          that._upload(body)
          }
        })
      })
  }

  _upload(body){
    let that = this
    let xhr = new XMLHttpRequest()
    let url = config.qiniu.upload

    this.setState({
      videoUploadedProgress:0,
      videoUploading:true,
      videoUploaded:false
    })
    xhr.open('POST',url)
    xhr.onload=()=>{
      console.log(xhr.status)
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
        that.setState({
          video:response,
          videoUploading:false,
          videoUploaded:true
        })
        console.log(response)
        let videoURL = config.api.base3 + config.api.video
        let accessToken = this.state.user.accessToken
        request.post(videoURL,{
          accessToken:accessToken,
          video:response,
          user:this.state.user,
          title:this.state.title
        })
        .catch((err)=>{
          console.log(err)
          Alert.alert('视频同步出错，请稍后重试')
        })
        .then((data)=>{
          console.log('视频shuju'+JSON.stringify(data))
          if(!data || !data.success){
            Alert.alert('您已上传过该视频，请勿重新上传')
          }

          if(data.success){
            Alert.alert(data.msg)
          }
        })
      }
    }

    if(xhr.upload){
      xhr.upload.onprogress = (event)=>{
        if(event.lengthComputable){
          let percent = Number((event.loaded /event.total).toFixed(2))

          that.setState({
            videoUploadedProgress:percent
          })
        }
      }
    }
    xhr.send(body)
  }

  _changeTitle(title){
    this.setState({
      title:title
    })
  }
  render(){
    return (
      <View style = {styles.container} >
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>
           上传页面
          </Text>
            {
              this.state.previewVideo && this.state.videoUploaded
              ?<Text style={styles.toolbarExtra} onPress={this._pickVideo.bind(this)}>更换视频</Text>
              :null
            }

        </View>

        <View style={styles.page}>
           <View style={styles.fieldItem}>
                <Text style={styles.label}>标题</Text>
                <TextInput
                  placeholder={'输入视频标题'}
                  style={styles.inputField}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  defaultValue={this.state.title}
                  onChangeText={(Text)=>{
                    this._changeTitle(Text)
                  }}
                />
          </View>
          {
            this.state.previewVideo
            ? <View style={styles.videoContainer}>
                <View style={styles.videoBox}>
                  <Video 
                    ref='videoPlayer'
                    source = {{uri:this.state.previewVideo}}
                    style={styles.video}
                    volume = {2}
                    paused = {this.state.paused}
                    rate={this.state.rate}
                    muted={this.state.muted}
                    resizeMode={this.state.resizeMode}
                    repeat={this.state.repeat}
                    onLoadStart={this._onLoadStart.bind(this)}
                    onLoad={this._onLoad.bind(this)}
                    onProgress={this._onProgress.bind(this)}
                    onEnd={this._onEnd.bind(this)}
                    onError = {this._onError.bind(this)}
                  />
                  {
                    !this.state.videoUploaded&&this.state.videoUploading
                    ?<View style={styles.progressTipBox}>
                      <Progress.Bar
                      width={width}
                      color={'#ee735c'}
                      animationType={'spring'}
                      progress={this.state.videoUploadedProgress}
                      />
                      <Text style={styles.progressTip}>正在上传视频,已完成{(this.state.videoUploadedProgress*100).toFixed(2)}%</Text>
                      </View>
                      :null
                   
                    }
                </View>
              </View>
            : <TouchableOpacity style={styles.uploadContainer} onPress={this._pickVideo.bind(this)}>
              <View style={styles.uploadBox}>
                <Text style={styles.uploadTitle}>视频预览区</Text>
                <Text style={styles.uploadDesc}>建议时长不超过20秒</Text>
              </View>
            </TouchableOpacity>
          }
        </View>
      </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  toolbar:{
    flexDirection:'row',
    marginTop:Platform.OS === 'ios'?20:0,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: '#ee735c',
  },
  toolbarTitle:{
    flex:1,
    fontSize:16,
    color:'#fff',
    textAlign:'center',
    fontWeight:'600'
  },
  toolbarExtra:{
    position:'absolute',
    right:10,
    top:Platform.OS === 'ios'?30:10,
    color:'#fff',
    textAlign:'right',
    fontWeight:'600',
    fontSize:14
  },
  page:{
    flex:1,
    alignItems:'center'
  },
  uploadContainer:{
    marginTop:40,
    width:width-40,
    height:200,
    paddingBottom:10,
    backgroundColor:'#fff',
    borderWidth:1,
    borderColor:'#ee735c',
    justifyContent:'center',
    borderRadius:6,
  },
  uploadTitle:{
    textAlign:'center',
    fontSize:16,
    color:'#000'
  },
  uploadDesc:{
    color:'#999',
    textAlign:'center',
    fontSize:12
  },
  uploadIcon:{
    width:110,
    resizeMode:'contain'
  },
  uploadBox:{
    flex:1,
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center'
  },

  videoContainer:{
    width:width,
    justifyContent:'center',
    alignItems:'flex-start'
  },
  videoBox:{
    width:width,
    height:height*0.4
  },
  video:{
    width:width,
    height:height*0.4,
    backgroundColor:'#333'
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
  label:{
    color:'#ee735c',
    marginRight:20
  },
  inputField:{
    height:50,
    flex:1,
    color:'#666',
    fontSize:14
  },
  //视频上传进度条
  progressTipBox:{
    width:width,
    height:40,
    backgroundColor:'rgba(244,244,244,0.65)'
  },
  progressTip:{
    color:'#333',
    width:width-10,
    padding:5
  }
});

module.exports = Edit;