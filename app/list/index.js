
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';


import request from './../common/request.js';
import config  from './../common/config.js';
import Detail from './detail.js'


let width = Dimensions.get('window').width;

//缓存列表所有数据
let cachedResults = {
  nextPage: 1,
  items: [],
  total:0
};

class Item extends Component{

  constructor(props) {
    super(props);
    let row = this.props.row;
    let user = this.props.user||{}
    this.state = {
      user:user,
      up:row.voted, 
      row: row
    };
  }

//点赞事件
  _up(row) {
    let that = this;
    let url = config.api.base3+config.api.up; 
    let up = !this.state.up;

    let body = {
      id: row._id,
      up:up?true:false,
      accessToken:this.state.user.accessToken
    };

    request.post(url,body)
      .then(function(data){
        if(data && data.success){ 
         that.setState({
            up:up
          });
        }else{
          Alert.alert('点赞失败，稍后重试');
        }
      })
      .catch(function(err){
        console.log(err);
        Alert.alert('点赞失败，稍后重试');
      })


  }

  render(){
    let row = this.state.row;
    //console.log(row);
    return(
        <View style = {styles.item}>
          <Text style = {styles.title}>{row.title}</Text>
          <TouchableHighlight  onPress={() => this.props.navigation.navigate('Detail',{data:row})}>
          <Image
           style={styles.thumb}
           source={{uri: row.thumb}}
          >
          <Icon 
            name = 'ios-play'
            size = {28}
            style = {styles.play}
          />
          </Image>
          </TouchableHighlight>
          <View style = {styles.itemFooter}>
              <TouchableOpacity onPress = {this._up.bind(this,row)} >
                <View style = {styles.handleBox}>
                  <Icon 
                    name = { this.state.up ? 'ios-heart':'ios-heart-outline'}
                    size = {28}
                    style = {[styles.up,this.state.up ? null : styles.down]}
                  />
                  <Text style = {styles.handleText}>喜欢</Text>     
                </View>
              </TouchableOpacity>
            <View style = {styles.handleBox}>
              <Icon 
                name = 'ios-chatboxes-outline'
                size = {28}
                style = {styles.commentIcon}
              />
              <Text style = {styles.handleText}>评论</Text>
            </View>
          </View>
        </View>

    )
  }
}

class List extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let user = this.props.user||{}
    this.state = {
      user:user, 
      isLoadingTail: false,
      dataSource: ds.cloneWithRows([
        ]),
      isRefreshing:false
    };
  }

   //组件加载完成
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
    .then(()=>{
      that._fetchData(1)
    })
  }

  _fetchData(page) {
    let that = this;
    // return fetch('http://rap2api.taobao.org/app/mock/data/7150')
    if(page !== 0){
      this.setState({
        isLoadingTail:true
      })
    }else{
     
      this.setState({
        isRefreshing:true
      })
    }
      let body = {
        total:cachedResults.items.length,
        page:page
      }
      request.post(config.api.base3+config.api.list,body) 
      .then(data => {
         // console.log(responseJson.success);
        // console.log(this.state.dataSource);
          console.log(data)
         if(data.success){
          let items = cachedResults.items.slice();
          
          if(page !== 0){
            items = items.concat(data.data)
            cachedResults.nextPage += 1
          }else{
            items = data.data.concat(items)
          }

          cachedResults.items = items ;
          cachedResults.total = data.total;

          setTimeout(function(){
            if(page !== 0){
              that.setState({
                isLoadingTail:false,
                dataSource: that.state.dataSource.cloneWithRows(
                cachedResults.items)
              })
            }else{
              that.setState({
                isRefreshing:false,
                dataSource: that.state.dataSource.cloneWithRows(
                cachedResults.items)
              })
            }
              
          },2000)
         };
      })
      .catch(error => {
        if(page !==0 ){
        this.setState({
              isLoadingTail:false
          });
      }else{
        this.setState({
          isRefreshing:false
        })
      }
       console.error(error);
      })
  }
  //判断是否有更多数据
  _hasMore(){
    // console.log('缓存数剧长度'+cachedResults.items.length)
    // console.log('数据库数剧长度'+cachedResults.total)
    return cachedResults.items.length !== cachedResults.total;
  }

  _fetchMoreData(){
    if(!this._hasMore() || this.state.isLoadingTail){
      return;
    };

    let page = cachedResults.nextPage;

    this._fetchData(page);
  }

   _onRefresh(){
    // Alert.alert('触发了1')
    if(!this._hasMore() || this.state.isRefreshing){
      Alert.alert('没有最新数据')
      return 
    }
    Alert.alert('触发了')
    this._fetchData(0)
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

  //加载每一个视频数据
  _renderRow(row){
    return(
      //jsx
     <Item row = {row} navigation = {this.props.navigation} user = {this.state.user}/>
    )
  }

  render(){
     return (
      <View style = {styles.container} >
        <View style = {styles.header}>
          <Text style = {styles.headerTitle}>列表页面</Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets ={false}
          onEndReachedThreshold={40}
          onEndReached = {this._fetchMoreData.bind(this)}
          refreshControl={
            <RefreshControl 
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              tintColor="#ff6600"
              title='拼命加载中...'
              progressBackgroundColor="#fff"
              colors={["#ff6600"]}
            />
          }
          //dp
          renderFooter = {this._renderFooter.bind(this)}
        />
      </View>
      )
  }
}
const Root = StackNavigator({
  List: {
    screen: List,
  },
  Detail: {
    screen: Detail,
  },
},
{
   headerMode: 'none',
   mode: 'modal',
   navigationOptions: {
     gesturesEnabled: false,
     initialRouteName:List,
   }
 }
)

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#f5fcff'
  },
  header:{
    marginTop:Platform.OS === 'ios'?20:0,
    paddingBottom: 8,
    // paddingTop: 8,
    backgroundColor: '#ee735c',
    flexDirection:'row',
    //position:'relative'
  },
  headerTitle: {
    color:'#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    marginTop:8,
    marginLeft:width/2-60,
  },
  item:{
    width:width,
    borderBottomWidth:1,
    borderColor:'#eee',
    backgroundColor: '#fff',
  },

  thumb:{
    width:width,
    height:width*0.56,
    resizeMode:'cover'
  },

  title:{
    padding: 10,
    fontSize: 18,
    color:'#333'
  },

  itemFooter:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:'#eee'
  },

  handleBox:{
    padding: 10,
    flexDirection: 'row',
    width:width/2-0.5,
    justifyContent:'center',
    backgroundColor: '#fff',
  },

  play:{
    position: 'absolute',
    bottom:14,
    right:14,
    width:46,
    height:46,
    paddingTop:9,
    paddingLeft:18,
    backgroundColor: 'transparent',
    borderColor:"#fff",
    borderWidth:1,
    borderRadius:23,
    color:'#ed7b66'
  },

  handleText:{
    paddingLeft:12,
    fontSize:18,
    color:'#333'
  },

  up:{
    fontSize:22,
    color:'#ed7b66'
  },
  down:{
    fontSize:22,
    color:'#333'
  },

  commentIcon:{
    fontSize:22,
    color:'#333'
  },

  loadingMore:{
    marginVertical:20
  },

  loadingText:{
    color:'#777',
    textAlign: 'center',
  },


})


module.exports = Root;