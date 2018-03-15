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
  ScrollView
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'
import Button from 'react-native-button'
import { StackNavigator } from 'react-navigation'


let width = Dimensions.get('window').width;

class PLusArticle extends Component {

  constructor(props) {
    super(props)
    this.state = { 
      nickname:'',
      password:'',
    }
  }
  //增加其他步骤
  _otherStep(){
    Alert.alert('增加步骤')
  }
  //发布这篇文章
  _submit(){
    Alert.alert('发布文章')
  }
  render(){
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
                dishname:text
              })
            }}
          />
          <View style={styles.dishThumb}>
                <Text style={styles.dishTitle}>+文章封面</Text>
          </View>
          <TextInput
            placeholder='输入这道美食背后的故事'
            autoCaptialize={'none'}
            autoCorrect={false}
            underlineColorAndroid='transparent'
            keyboardType={'numeric'}
            style={styles.inputField}
            onChangeText={(text)=>{
              this.setState({
                dishstory:text
              })
            }}
          />
          <Text style={styles.dishPrac}>做法</Text>
          <View>
            <Text style={styles.dishPrac}>步骤1</Text>
            <View style={styles.dishThumb}>
                <Text style={styles.dishTitle}>+步骤图</Text>
            </View>
              <TextInput
              placeholder='添加步骤说明'
              autoCaptialize={'none'}
              autoCorrect={false}
              underlineColorAndroid='transparent'
              keyboardType={'numeric'}
              style={styles.inputField}
              onChangeText={(text)=>{
                this.setState({
                  dishstory:text
                })
              }}
            />
          </View>
          <View>
            <Text style={styles.dishPrac}>步骤2</Text>
            <View style={styles.dishThumb}>
                <Text style={styles.dishTitle}>+步骤图</Text>
            </View>
              <TextInput
              placeholder='添加步骤说明'
              autoCaptialize={'none'}
              autoCorrect={false}
              underlineColorAndroid='transparent'
              keyboardType={'numeric'}
              style={styles.inputField}
              onChangeText={(text)=>{
                this.setState({
                  dishstory:text
                })
              }}
            />
          </View>
          <View style={styles.otherStep}>
            <Text style={styles.stepText} onPress={this._otherStep.bind(this)}>再增加一步</Text>
          </View>
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
    ArticleMain:{
      flexDirection:'column',
    },
    inputField:{
      padding:5,
      height:40,
      color:'#666',
      fontSize:16,
      backgroundColor:'#fff',
      borderRadius:4
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