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
  Image
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'
import Button from 'react-native-button'
import PlusArticle from './plusArticle.js'

let width = Dimensions.get('window').width;

class Item extends Component{

  constructor(props) {
    super(props);
    let row = this.props.row;
    let user = this.props.user||{}
    this.state = {
      user:user,
      row: row
    };
  }
  render(){
    let row = this.state.row;
    //console.log(row);
    return(
        <View style = {styles.item}>
          <Text style = {styles.title}>{}</Text>
          <TouchableHighlight  onPress={() => this.props.navigation.navigate('Detail',{data:row})}>
          <Image
           style={styles.thumb}
           source={{uri: row}}
          >
          </Image>
          </TouchableHighlight>
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
      dataSource:ds.cloneWithRows([
        ]),
    }
  }

  _plusArticle(){
    this.props.navigation.navigate('PlusArticle')
  }
  _renderRow(){

  }
  _fetchMoreData(){

  }
  _onRefresh(){

  }
  _renderFooter(){
    return(
      //jsx
     <Item navigation = {this.props.navigation} user = {this.state.user}/>
    )
  }
  render(){
    return (
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
    paddingBottom: 8,
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

})

module.exports = Life
