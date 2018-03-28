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
  FlatList,
  TextInput,
  Modal,
  Alert,
  AsyncStorage,
  ScrollView
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';

import config  from './../common/config.js';
import request from './../common/request.js';


let width = Dimensions.get('window').width;

//console.log(Video);
class ArticleDetail extends Component {
  
  constructor(props) {
    super(props);
    let data = this.props.navigation.state.params.data;
    let user = this.props.user||{}
    this.state = {
      user:user, 
      data:data
    };
  }

  componentDidMount(){

  }
  _renderItem(item){
    console.log(item.item)
    return (
      <View>
        <Text style={styles.steptext}>步骤{item.index+1}</Text>
        <Image style={styles.stepthumb}
          source={{uri:'http://p3kjn8fdy.bkt.clouddn.com/'+item.item.Image1}}
        ></Image>
        <Text style={styles.stepdesc}>{item.item.desc1}</Text>
      </View>
    )
  }
  render() {
    let data = this.state.data
    //console.log(data)
    return (
      <ScrollView overflow={'hidden'} automaticallyAdjustContentInsets={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.popBox} onPress={()=>{this.props.navigation.goBack()}}>
              <Icon name='ios-arrow-back' style={styles.backIcon} />
              <Text style={styles.backText}>返回</Text>
            </TouchableOpacity>
            <Text>详情页面</Text>
          </View>
          <View style={styles.main}>
            <Image
             style={styles.thumb}
             source={{uri: 'http://p3kjn8fdy.bkt.clouddn.com/'+data.articlethumb}}
            >
            </Image>
            <Text style={styles.title}>{data.title}</Text>
            <View style={styles.articlemain}>
              <View style={styles.authorbox}>
                <Image
                 style={styles.authoravatar}
                 source={{uri: 'http://p3kjn8fdy.bkt.clouddn.com/'+data.author.avatar}}
                >
                </Image>
                <View>
                  <Text style={styles.authortext}>作者</Text>
                  <Text>{data.author.nickname}</Text>
                </View>
              </View>
              <Text style={styles.maindesc}>{data.desc}</Text>
              <View style={styles.mainstep}>
                <FlatList
                  data={data.stepImage}
                  renderItem= {this._renderItem}
                />
              </View>
            </View>
          </View>  
        </View>
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
  backIcon:{
    color:'#999',
    fontSize:20,
    marginRight:5
  },
  backText:{
    color:'#999'
  },
  thumb:{
    width:width,
    height:width*0.56,
    resizeMode:'cover'
  },
  title:{
    padding:20,
    fontSize:18,
    textAlign:'center',
  },
  articlemain:{
    borderTopWidth:1,
    borderColor:'#eee',
    padding:20,
  },

  authorbox:{
    flexDirection:'row',
    alignItems:'center',
    width:width,
    paddingBottom:20
  },
  authoravatar:{
    width:width*.16,
    height:width*.16,
    resizeMode:'cover',
    borderRadius:width*0.08,
    borderWidth:1,
    borderColor:'#fff',
    marginRight:20
  },
  authortext:{
    fontSize:16,
    marginBottom:6
  },
  maindesc:{
    fontSize:16,
    color:'#333',
    textAlign:'justify',
    lineHeight:20,
    paddingBottom:20
  },
  mainstep:{
    borderTopWidth:1,
    borderBottomWidth:1,
    borderColor:'#eee'
  },
  stepthumb:{
    height:width*0.56,
    resizeMode:'cover',
    paddingTop:10,
    paddingBottom:10
  },
  steptext:{
    fontSize:18,
    fontWeight:"600",
    lineHeight:40,
    color:'#333'
  },
  stepdesc:{
    color:'#666',
    lineHeight:30,
    fontSize:16,
    textAlign:'justify'
  }
})

module.exports = ArticleDetail