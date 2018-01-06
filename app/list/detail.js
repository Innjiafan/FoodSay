import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
  ListView,
  TextInput,
  Modal,
  Alert
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';

import config  from './../common/config.js';
import request from './../common/request.js';
//import {Video} from 'react-native-video';
let Video = require('react-native-video').default;

let width = Dimensions.get('window').width;

//缓存评论列表所有数据
let cachedResults = {
  nextPage: 1,
  items: [],
  total:0
};
//console.log(Video);
class Detail extends Component {
  
  constructor(props) {
    super(props);
    let data = this.props.navigation.state.params.data;
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    //console.log(data.author);
    //console.log(data);
    this.state = { 
      data:data,
      isLoadingTail:false,
      dataSource:ds.cloneWithRows([
        {
          "_id": "810000197509067439",
          "title": "Gybx Rrnlfgoe",
          "replyBy": {
            "nickname": "Dorothy Martinez",
            "avatar": "http://dummyimage.com/640X640/d479f2"
          },
          "content": "到事况边此质去真千好事京物由叫难严。向知命民片群响装个公话接时目红与立。要风间革及是专住样次价酸比。"
        },
        {
          "_id": "52000019780622768X",
          "title": "Qgjr Owaucsq",
          "replyBy": {
            "nickname": "Angela Hernandez",
            "avatar": "http://dummyimage.com/640X640/79f2b1"
          },
          "content": "八处运别自员合每计具直养。"
        }
        ]),
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

      animationType:'fade',
      modalVisible:false,
      isSending:false,
      content:''
    };
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

  componentDidMount(){
    this._fetchData(1)
  }

_fetchData(page) {
    let that = this;
    let data = this.state.data;
      this.setState({
        isLoadingTail:true
      })
    request.get(config.api.base1+config.api.comment,{
      accessToken: 'abcee',
      page: page,
      videoId:data._id
    })
      .then(data => {
         if(data.success){
          let items = cachedResults.items.slice();
          items = items.concat(data.data)
          cachedResults.nextPage += 1
        

          cachedResults.items = items ;
          cachedResults.total = data.total;

          setTimeout(function(){
            that.setState({
              isLoadingTail:false,
              dataSource: that.state.dataSource.cloneWithRows(
              cachedResults.items)
            })    
          },2000)
         };
      })
      .catch(error => {
        this.setState({
              isLoadingTail:false
          })
        console.error(error);
      })
  
  }
  //判断是否有更多数据
  _hasMore(){
    return cachedResults.items.length !== cachedResults.total;
  }

  _fetchMoreData(){
    if(!this._hasMore() || this.state.isLoadingTail){
      return;
    };

    let page = cachedResults.nextPage;

    this._fetchData(page);
  }

   //底部下拉数据提示信息
  _renderFooter(){
      if(!this._hasMore()&&cachedResults.total !== 0){
        return(
          <View style = {styles.loadingMore}>
            <Text style = {styles.loadingText}>没有更多了</Text>
          </View>
        );

      };

      if(!this.state.isLoadingTail){
        return <View></View>
      }
      return (
        <ActivityIndicator
          animating={this.state.animating}
          style={[styles.loadingMore, {height: 20}]}
          size="small"
        />
      );
  }

  _renderRow(row){
    //console.log(row)
    return (
        <View key={row._id} style={styles.replyBox}>
          <Image style={styles.replyavatar} source={{uri:row.replyBy.avatar}}/>
          <View style={styles.reply}>
            <Text style={styles.replyNickname}>{row.replyBy.nickname}</Text>
            <Text style={styles.replyContent}>{row.content}</Text>
          </View>
        </View>
      )
  }

  _focus(){
    this._setModalVisible(true)

  }
  _blur(){

  }
  _closeModal(){
    this._setModalVisible(false)
  }
  _setModalVisible(isVisible){
    this.setState({
      modalVisible:isVisible
    })
  }
  _renderHeader(){
    let data=this.state.data
    return(
      <View style = {styles.listHeader}>
        <View style={styles.infoBox}>
          <Image style={styles.avatar} source={{uri:data.author.avatar}}/>
          <View style={styles.descBox}>
            <Text style={styles.nickname}>作者：{data.author.nickname}</Text>
            <Text style={styles.title}>标题：{data.title}</Text>
          </View>
        </View>
        <View style={styles.commentBox}>
          <View style = {styles.comment}>
            <Text>评论区</Text>
            <TextInput
              placeholder='发表一下你的看法...'
              style = {styles.content}
              multiline = {true}
              underlineColorAndroid='transparent'
              onFocus  ={this._focus.bind(this)}

            />
          </View>
        </View>
        <View style={styles.commentArea}>
            <Text style={styles.commentTitle}>精彩评论</Text>
        </View>
      </View>
      )
  }

  _submit(){
    let that = this;
    if(!this.state.content){
      return Alert.alert('留言不能为空')
    }

    if(this.state.isSending){
      return Alert.alert('正在评论中')
    }
    this.setState({
      isSending:true
    },()=>{
     // console.log(this.state.isSending)
     let body ={
        accessToken:'abc',
        list:'1233',
        content:this.state.content
      }

      let url = config.api.base2+config.api.comment
     // console.log(url);

      request.post(url,body)
      .then(function(data){
        if(data && data.success){
          let items =cachedResults.items.slice()
          let content = that.state.content
          items=[{
            content:that.state.content,
            replyBy:{
              nickname:'第一人',
              avatar:'http://dummyimage.com/640X640/79f2c9'
            }
          }].concat(items)
        //  console.log(items);
          cachedResults.items = items;
          cachedResults.total =cachedResults.total+1
          that.setState({
            //pinglunkuangweiqingkong
            content:'',
            isSending:false,
            dataSource:that.state.dataSource.cloneWithRows(cachedResults.items)
          })
          that._setModalVisible(false)
        }
      })
      .catch((error)=>{
        that.setState({
          isSending:false
        })
        that._setModalVisible(false)
        Alert.alert('留言失败，稍后重试')
        console.log(error)
      })

    })

  }
  render() {
    //console.log(data);
    let data = this.state.data;
    //console.log(data)
    return (
        <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.popBox} onPress={()=>{this.props.navigation.goBack()}}>
            <Icon name='ios-arrow-back' style={styles.backIcon} />
            <Text style={styles.backText}>返回</Text>
          </TouchableOpacity>
            <Text style={styles.headerTitle} numberOflines ={1} >详情页面</Text>
        </View>
        
          <View style={styles.videoBox}>
            <Video 
              ref='videoPlayer'
              source = {{uri:data.video}}
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
                  !this.state.videoOk && <Text style={styles.failText
                  }>视频出错了，很抱歉</Text>
              }

              {
                !this.state.videoLoaded&&<ActivityIndicator color='#fff' style={styles.loading}/>
              }
              {
                this.state.videoLoaded && !this.state.playing
                ?<Icon
                  name = 'ios-play'
                  size = {44}
                  style = {styles.playIcon}
                  onPress={this._rePlay.bind(this)}
                 />
                :null

              }

              {
                this.state.videoLoaded && this.state.playing
                ?<TouchableOpacity onPress={this._pause.bind(this)} style={styles.pauseBtn}>
                  {
                    this.state.paused?
                    <Icon onPress={this._resume.bind(this)} name='ios-play'
                      size = {44}
                      style={styles.resumeIcon}
                    />: <Text></Text>
                  }
                </TouchableOpacity>
                :null
              }
              <View style={styles.progressBox}>
                <View style={[styles.progressBar,{width:width * this.state.videoProgress }]}></View>
              </View>
          </View>
              <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRow.bind(this)}
                renderHeader={this._renderHeader.bind(this)}
                enableEmptySections={true}
                showsVerticalScrollIndicator={false}
                automaticallyAdjustContentInsets ={false}
                renderRow={this._renderRow.bind(this)}
                onEndReached = {this._fetchMoreData.bind(this)}
                onEndReachedThreshold={20}
                renderFooter = {this._renderFooter.bind(this)}
              />
              <Modal 
                animationType = {this.state.animationType}
                visible={this.state.modalVisible}
                onRequestClose = {()=>{this._setModalVisible(false).bind(this)}}>
                  <View style = {styles.modalContainer}>
                   <Icon
                    name='ios-close-outline'
                    onPress={this._closeModal.bind(this)}
                    style={styles.closeIcon}
                    size={48}
                    />
                   <View style={styles.commentBox}>
                    <View style = {styles.comment}>
                      <TextInput
                        placeholder='发表一下你的看法...'
                        style = {styles.content}
                        multiline = {true}
                        underlineColorAndroid='transparent'
                        onFocus  ={this._focus.bind(this)}
                        onBlur={this._blur.bind(this)}
                        defaultValue={this.state.content}
                        onChangeText={(text)=>{
                          this.setState({
                            content:text
                          })
                        }}
                      />
                    </View>
                  </View>
                  <Button style={styles.submitBtn} onPress={this._submit.bind(this)}>评论</Button>
                  </View>
                </Modal>
        </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

  header:{
    marginTop:Platform.OS === 'ios'?20:0,
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
  videoBox:{
    width:width,
    height:222,
    backgroundColor: '#000',
  },
  video:{
    width:width,
    height:220,
    backgroundColor: '#000',
  },
  loading:{
    position: 'absolute',
    left:0,
    top:100,
    width:width,
    alignSelf:'center',
    backgroundColor: 'transparent',
  },
  progressBox:{
    width:width,
    height:2,
    backgroundColor: 'black',
  },
  progressBar:{
    width:1,
    height:2,
    backgroundColor: '#ff6600',
  },
  playIcon:{
    position: 'absolute',
    top:80,
    left:width/2-30,
    width:60,
    height:60,
    paddingTop:8,
    paddingLeft:22,
    backgroundColor: 'transparent',
    borderColor:"#fff",
    borderWidth:1,
    borderRadius:30,
    color:'#ed7b66'
  },

  pauseBtn:{
    position:'absolute',
    left:0,
    top:0,
    width:width,
    height:360
  },

  resumeIcon:{
   position: 'absolute',
    top:80,
    left:width/2-30,
    width:60,
    height:60,
    paddingTop:8,
    paddingLeft:22,
    backgroundColor: 'transparent',
    borderColor:"#fff",
    borderWidth:1,
    borderRadius:30,
    color:'#ed7b66'
  },

  failText:{
    position: 'absolute',
    left:0,
    top:180,
    width:width,
    textAlign:'center',
    color:'#fff',
    backgroundColor: 'transparent'
  },
  infoBox:{
    width:width,
    flexDirection:'row',
    justifyContent:'center',
    marginTop:10
  },

  avatar:{
    width:60,
    height:60,
    marginRight:10,
    marginLeft:10,
    borderRadius:30
  },

  descBox:{
    flex:1
  },

  nickname:{
    fontSize:16
  },

  title:{
    marginTop:8,
    fontSize:14,
    color:'#666'
  },

  replyBox:{
    flexDirection:'row',
    justifyContent:'flex-start',
    marginTop:10,
  },
  replyavatar:{
    width:40,
    height:40,
    marginRight:10,
    marginLeft:10,
    borderRadius:20
  },

  replyNickname:{
    color:'#666'
  },

  replyContent:{
    marginTop:4,
    color:'#666'
  },

  reply:{
    flex:1         
  },
   loadingMore:{
    marginVertical:20
  },

  loadingText:{
    color:'#777',
    textAlign: 'center',
  },

  //评论区的样式
  listHeader:{
    width:width,
    marginTop:10
  },

  commentBox:{
    marginTop:10,
    marginBottom:10,
    padding:8,
    width:width
  },

  content:{
    paddingLeft:2,
    color:'#333',
    borderWidth:1,
    borderColor:'#ddd',
    borderRadius:4,
    fontSize:14,
    height:100
  },

  //pinglunqu
  commentArea:{
    width:width,
    paddingBottom:6,
    paddingLeft:10,
    paddingRight:10,
    borderBottomWidth:1,
    borderBottomColor:'#eee'
  },
//评论浮层
  modalContainer:{
    flex:1,
    paddingTop:45,
    backgroundColor:'#fff'
  },
  closeIcon:{
    alignSelf:'center',
    fontSize:40,
    color:'#ee753c'
  },
  submitBtn:{
    width:width-20,
    padding:16,
    marginTop:10,
    marginBottom:10,
    marginLeft:10,
    borderWidth:1,
    borderRadius:4,
    borderColor:'#ee753c',
    fontSize:18,
    color:'#ee753c'
  }

});
module.exports = Detail