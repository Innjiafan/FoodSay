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
  TextInput,
  Image
} from 'react-native';
let width = Dimensions.get('window').width;
class Message extends Component {

  constructor(props) {
    super(props)
    this.state = {
      
    }
  }

  componentDidMount(){
    
  }


  render(){
    return (
      <View style = {styles.container} >
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>
           我的信箱
          </Text>
        </View>
        <View style={styles.item}>
          <Image 
            style={styles.thumb}
            source={{uri:'http://dummyimage.com/720x640/f279a7)'}}
          ></Image>
          <View style={styles.contentBox}>
            <Text style={styles.name}>美食说</Text>
            <Text style={styles.content}>欢迎来到美食说,送你300元新人大礼包...</Text>
          </View>
        </View>
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
  item:{
    backgroundColor:'#fff',
    flexDirection:'row',
    padding:10
  },
  thumb:{
    width:width*.14,
    height:width*.14,
    resizeMode:'cover',
    borderRadius:width*0.07,
    borderWidth:1,
    borderColor:'#fff',
    marginRight:20
  },
  name:{
    fontSize: 16,
    color:'#333',
    marginBottom:6
  },
  content:{
    fontSize: 12,
    color:'#bbb',
  }, 
});

module.exports = Message;