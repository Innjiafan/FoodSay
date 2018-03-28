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
  ListView,
  RefreshControl,
  TouchableHighlight,
  Image,
  ActivityIndicator
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'
import Button from 'react-native-button'
import PlusArticle from './plusArticle.js'

import request from './../common/request.js';
import config  from './../common/config.js';
import ArticleDetail from './detail.js'
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
    let row = this.props.row
    let user = this.props.user||{}
    this.state = {
      user:user,
      row: row,
      isRefreshing:false,
      isLoadingTail:false
    };
  }
  render(){
    let row = this.state.row;
    return(
        <View style = {styles.item}>
          <TouchableHighlight  onPress={() => this.props.navigation.navigate('ArticleDetail',{data:row})}>
          <Image
           style={styles.thumb}
           source={{uri: 'http://p3kjn8fdy.bkt.clouddn.com/'+row.articlethumb}}
          >
          </Image>
          </TouchableHighlight>
          <View style={styles.itembottom}>
              <Text style = {styles.title}>{row.title}</Text>
              <View style={styles.itemauthor}>
                <Image
                 style={styles.avatarthumb}
                 source={{uri: 'http://p3kjn8fdy.bkt.clouddn.com/'+row.author.avatar}}
                >
                </Image>
                <View style={styles.namebox}>
                  <Text style={styles.authorname}>{row.author.nickname}</Text>
                </View>
              </View>
          </View>
        </View>

    )
  }
}
class Life extends Component {

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let user = this.props.user||{}
    this.state = {
      user:user, 
      isRefreshing:false,
      searchtext:null,
      dataSource:ds.cloneWithRows([
            
        ]),
    }
  }

  _plusArticle(){
    this.props.navigation.navigate('PlusArticle')
  }
  _renderRow(row){
    return(
      //jsx
     <Item row={row} navigation = {this.props.navigation} user = {this.state.user}/>
    )
  }
  componentDidMount(){
      this._fetchData(1)
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
      request.get(config.api.base3+config.api.articlelist,{
        page:page
      }) 
      .then(data => {
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

  _searchSubmit(){
    
  }
  render(){
    return(
      <View style = {styles.container} >
        <View style={styles.toolbar}>
           <Icon
              name = 'ios-add'
              size = {30}
              style = {styles.plusArticle}
              onPress={this._plusArticle.bind(this)}
          />
          <Text style={styles.toolbarTitle}>
           生活社区
          </Text>
        </View>
        <View style={styles.searchBox}>
          <TextInput
            placeholder={'搜索你喜欢的内容'}
            style={styles.searchField}
            autoCapitalize={'none'}
            autoCorrect={false}
            underlineColorAndroid={'transparent'}
            onChangeText={(text)=>{
              this.setState({
                searchtext:text
              })
            }}
          />
          <Button style={styles.searchbtn} onPress={this._searchSubmit.bind(this)}>搜索</Button>
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9'
  },
  toolbar:{
    marginTop:Platform.OS === 'ios'?20:0,
    paddingBottom: Platform.OS === 'ios'?0:8,
    // paddingTop: 8,
    backgroundColor: '#ee735c',
    flexDirection:'row',
    //position:'relative'
  },
  toolbarTitle: {
    color:'#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    marginTop:8,
    marginLeft:width/2-60,
  },
  plusArticle:{
    color:'#fff',
    marginLeft:8,
    marginTop:4
    // position:'absolute',
    // top:0,
    // left:0
  },
  //
  searchBox:{
    backgroundColor:'#fff',
    flexDirection:'row',
    justifyContent:'center'
  },
  searchField:{
    width:width*.8,
    height:40,
    color:'#666',
    fontSize:14,
    borderRadius:0.3,
    borderWidth:0.6,
    borderColor:'#eee',
    backgroundColor:'#eee',
    opacity:0.4,
    marginLeft:6,
  },
  searchbtn:{
    width:width*.2,
    height:40,
    padding:10,
    borderRadius:0.3,
    borderWidth:0.6,
    borderColor:'#eee',
    color:'#ee735c',
    fontSize:14
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
  itembottom:{
    width:width,
    backgroundColor:'#fff',
    flexDirection:'row',
    padding: 10,
    position:'relative',
    height:width*.22
    //alignItems:'flex-start'
  },
  itemauthor:{
    backgroundColor:'#fff',
    flexDirection:'column',
    position:'absolute',
    top:8,
    right:10,
    alignItems:'flex-end'
  },
  avatarthumb:{
    width:width*.14,
    height:width*.14,
    resizeMode:'cover',
    borderRadius:width*0.07,
    borderWidth:1,
    borderColor:'#fff'
  },
  authorname:{
    fontSize: 12,
    color:'#333'
  },
  title:{
    width:width*.4,
    fontSize: 18,
    color:'#333',
  }, 
  loadingMore:{
    marginVertical:20
  },

  loadingText:{
    color:'#777',
    textAlign: 'center',
  },
})

module.exports = Life
