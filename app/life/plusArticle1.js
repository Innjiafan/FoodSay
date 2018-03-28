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
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';

import * as Progress from 'react-native-progress'
import request from './../common/request.js';
import config  from './../common/config.js';
import Icon from 'react-native-vector-icons/Ionicons'
import Button from 'react-native-button'
import { StackNavigator } from 'react-navigation'
let ImagePicker = require('react-native-image-picker')

let width = Dimensions.get('window').width;

function articlephoto(id,type){
  return 'http://p3kjn8fdy.bkt.clouddn.com/'+id
}
//从相册选择图片
let photoOptions = {
  title: '选择图片',
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

class Item extends Component {
  constructor(props) {
    super(props)
    let user = this.props.user||{}
    this.state = { 
    }
  }
  //从相册中获取图片
  _pickPhoto(type){
    let that = this
    ImagePicker.showImagePicker(photoOptions, (res) => {
      if (res.didCancel) {
        return
      }
      //let avatarData = 'data:image/jpeg;base64,'+res.data;
      //let user = this.state.user;
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
          that._upload(body,type)
          }
        })
    })
  }


    //上传图床
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

  _upload(body,type){
    let that = this
    let xhr = new XMLHttpRequest()
    let url = config.qiniu.upload

    this.setState({
      photoUploading:true,
      photoProgress:0
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
        //console.log(response)
      }
      catch(e){
        console.log(e)
        console.log('parse fail')
      }
      if(response){
        //console.log(response)
        if(response.key){
          if(type == 'thumb'){
            let articlethumb = this.state.articlethumb
            articlethumb = response.key
            that.setState({
              photoUploading:false,
              photoProgress:0,
              articlethumb:articlethumb
            })
          }else if(type == 'stepthumb'){
            let stepImage = this.state.stepImage
            let stepobj = {
              Image1:response.key,
              desc1:null
            }
            stepImage.push(stepobj)
            that.setState({
              photoUploading:false,
              photoProgress:0,
              stepImage:stepImage
            })
          }
        }
     

        //that._asycUser(true)
      }
    }

    if(xhr.upload){
      xhr.upload.onprogress = (event)=>{
        if(event.lengthComputable){
          let percent = Number((event.loaded /event.total).toFixed(2))

          that.setState({
            photoProgress:percent
          })
        }
      }
    }
    xhr.send(body)
  }

  render(){
    return (
      <View>
            <Text style={styles.dishPrac}>步骤1</Text>
            {
            this.state.stepImage.length != 0
            ?<TouchableOpacity onPress={this._pickPhoto.bind(this,'stepthumb')} style={styles.photoContainer}> 
              <View style={styles.dishThumb}>
                <View  style={styles.photoContainer}>
                  <View style={styles.photoBox}>
                    {this.state.photoUploading
                    ?<Progress.Bar
                    showsText={true}
                    color={'#ee735c'}
                    progress={this.state.photoProgress}
                    width={width}
                    height={4}
                    />
                    :<Image
                      source={{uri:articlephoto(this.state.stepImage[0].Image1,'image')}}
                      style={styles.photo}
                    />
                    }
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            :<TouchableOpacity onPress={this._pickPhoto.bind(this,'stepthumb')} style={styles.photoContainer}>
              <View style={styles.dishThumb}> 
                <View style={styles.photoBox}>
                  {this.state.photoUploading
                  ?<Progress.Bar 
                  showsText={true}
                  color={'#ee735c'}
                  progress={this.state.photoProgress}
                  width={width}
                  height={4} />
                  :<Text style={styles.dishTitle}>+步骤图</Text>
                  }
                </View>
              </View>
            </TouchableOpacity>
          }
              <TextInput
              placeholder={'添加步骤说明'}
              autoCapitalize={'none'}
              autoCorrect={false}
              multiline={true}
              underlineColorAndroid='transparent'
              style={styles.inputField}
              onChangeText={(text)=>{
                    this.state.stepImage[0].desc1 = text
                  }}
            />
          </View>
    )
  }
}
  

class PLusArticle extends Component {

  constructor(props) {
    super(props)
    let user = this.props.user||{}
    this.state = { 
      user:user,
      addotherstep:false,
      photoProgress:0,
      photoUploading:false,
      animationType:'fade',
      modalVisible:false,

      title:null,
      articlethumb:null,
      desc:null,
      stepImage:[],
    }
  }
  //增加其他步骤
  _otherStep(){
    Alert.alert('增加步骤')
    this.setState({
      addotherstep:true
    })
  }

  //发布这篇文章
  _submit(){
    Alert.alert('发布文章')
  }
  render(){
    let that = this
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.popBox} onPress={()=>{this.props.navigation.goBack()}}>
            <Icon name='ios-arrow-back' style={styles.backIcon} />
            <Text style={styles.backText}>返回</Text>
          </TouchableOpacity>
            <Text style={styles.headerTitle} numberOflines ={1} >创建文章</Text>
        </View>
        <View style = {styles.ArticleMain}>
          <TextInput
            placeholder='输入文章名'
            autoCaptialize={'none'}
            autoCorrect={false}
            underlineColorAndroid='transparent'
            keyboardType={'numeric'}
            style={styles.inputField}
            onChangeText={(text)=>{
              this.setState({
                title:text
              })
            }}
          />
          {
            this.state.articlethumb
            ?<TouchableOpacity onPress={this._pickPhoto.bind(this,'thumb')} style={styles.photoContainer}> 
              <View style={styles.dishThumb}>
                <Image source={{uri:articlephoto(this.state.articlethumb,'image')}} style={styles.photoContainer}>
                  <View style={styles.photoBox}>
                    {this.state.photoUploading
                    ?<Progress.Bar
                    showsText={true}
                    color={'#ee735c'}
                    progress={this.state.photoProgress}
                    width={width}
                    height={4}
                    />
                    :<Image
                      source={{uri:articlephoto(this.state.articlethumb,'image')}}
                      style={styles.photo}
                    />
                    }
                  </View>
                </Image>
              </View>
            </TouchableOpacity>
            :<TouchableOpacity onPress={this._pickPhoto.bind(this,'thumb')} style={styles.photoContainer}>
              <View style={styles.dishThumb}> 
                <View style={styles.photoBox}>
                  {this.state.photoUploading
                  ?<Progress.Bar 
                  showsText={true}
                  color={'#ee735c'}
                  progress={this.state.photoProgress}
                  width={width}
                  height={4} />
                  :<Text style={styles.dishTitle}>+文章封面</Text>
                  }
                </View>
              </View>
            </TouchableOpacity>
          }
          
          <TextInput
            placeholder='输入这道美食背后的故事'
            autoCaptialize={'none'}
            autoCorrect={false}
            multiline={true}
            underlineColorAndroid='transparent'
            keyboardType={'numeric'}
            style={styles.inputField}
            onChangeText={(text)=>{
              this.setState({
                desc:text
              })
            }}
          />
          <Text style={styles.dishPrac}>做法</Text>
          
          {
            this.state.addotherstep
            ?
            <View>
              <Text style={styles.dishPrac}>步骤4</Text>
              {
                this.state.stepImage.length == 4
                ?<TouchableOpacity onPress={this._pickPhoto.bind(this,'stepthumb')} style={styles.photoContainer}> 
                  <View style={styles.dishThumb}>
                    <Image source={{uri:articlephoto(this.state.stepImage[3].Image1,'image')}} style={styles.photoContainer}>
                      <View style={styles.photoBox}>
                        {this.state.photoUploading
                        ?<Progress.Bar
                        showsText={true}
                        color={'#ee735c'}
                        progress={this.state.photoProgress}
                        width={width}
                        height={4}
                        />
                        :<Image
                          source={{uri:articlephoto(this.state.stepImage[3].Image1,'image')}}
                          style={styles.photo}
                        />
                        }
                      </View>
                    </Image>
                  </View>
                </TouchableOpacity>
                :<TouchableOpacity onPress={this._pickPhoto.bind(this,'stepthumb')} style={styles.photoContainer}>
                  <View style={styles.dishThumb}> 
                    <View style={styles.photoBox}>
                      {this.state.photoUploading
                      ?<Progress.Bar 
                      showsText={true}
                      color={'#ee735c'}
                      progress={this.state.photoProgress}
                      width={width}
                      height={4} />
                      :<Text style={styles.dishTitle}>+步骤图</Text>
                      }
                    </View>
                  </View>
                </TouchableOpacity>
              }
                <TextInput
                placeholder='添加步骤说明'
                autoCaptialize={'none'}
                autoCorrect={false}
                multiline={true}
                underlineColorAndroid='transparent'
                keyboardType={'numeric'}
                style={styles.inputField}
                onChangeText={(text)=>{
                    this.state.stepImage[3].desc1 = text
                }}
              />
            </View>
            :null
          }
          {
            this.state.addotherstep
            ?null
            :
            <View style={styles.otherStep}>
              <Text style={styles.stepText} onPress={this._otherStep.bind(this)}>再增加一步</Text>
            </View>
          }
       
        </View>
        <Button
              style={styles.articlebtn}
              onPress={this._submit.bind(this)}>发布文章</Button>
      </ScrollView>
      )
  }
}
 

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
    },

    header:{
      marginTop:Platform.OS === 'ios'?0:0,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      width:width,
      height:40,
      paddingBottom: 8,
      paddingTop: 8,
      paddingLeft:10,
      paddingRight:10,
      borderBottomWidth:1,
      borderColor:'rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
    },

    popBox:{
      position:'absolute',
      left:12,
      top:10,
      width:50,
      flexDirection:'row',
      alignItems:'center'
    },
    headerTitle:{
      width:width-120,
      textAlign:'center'
    },
    backIcon:{
      color:'#999',
      fontSize:20,
      marginRight:5
    },
    backText:{
      color:'#999'
    },
    ArticleMain:{
      flexDirection:'column',
    },
    inputField:{
      paddingTop:20,
      paddingBottom:20,
      color:'#666',
      fontSize:16,
      backgroundColor:'#fff',
      borderRadius:4
    },
    photoContainer:{
      width:width,
      height:200
    },
    dishThumb:{
      width:width,
      height:200,
      paddingBottom:10,
      backgroundColor:'#eee',
      // borderWidth:1,
      // borderColor:'#ee735c',
      justifyContent:'center',
      //borderRadius:6,
    },
    photo:{
      width:width,
      height:200,
      resizeMode:'cover',
    },
    dishPrac:{
      backgroundColor:'#fff',
      fontSize:20,
      color:"#333",
      padding:4,
      paddingBottom:10
    },
    dishTitle:{
      textAlign:'center',
      fontSize:16,
      color:'#333'
    },
    otherStep:{
      backgroundColor:'#fff',
      padding:4
    },
    stepText:{
      fontSize:14,
      marginLeft:10,
      color:'#ee735c'
    },
    articlebtn:{
      padding:10,
      backgroundColor:'#ee735c',
      color:'#fff',
      fontSize:16,
      textAlign: 'center',
      fontWeight:'500'
    }
})

module.exports = PLusArticle