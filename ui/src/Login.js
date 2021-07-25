import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-paper';
const axios = require('axios');
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Login({ navigation }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [state, setState] = useState(false)
  const [statePassWord, setStatePassWord] = useState(true)


  const storeData = async (key,value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (e) {
      // saving error
    }
  }

  function onLogin() {
    if (name && password) {
      console.log(`name`, name, password)
      setState(false)
      axios.post('http://localhost:7000/login', {
        "username": name,
        "password": password
      })
        .then(function(response){
          try {
            if (response.data.message === 'OK') {
              navigation.replace('Home', { name: response.data.data.username, token: response.data.data.token })
              storeData('name', response.data.data.username)
              storeData('token', response.data.data.token)
            }
            else {
              setState(true)
            }
            console.log("Data", response.data);
          
                } catch (error) {
      }}
              )
              .catch (function (error) {
        console.log(error);
        setState(true)
      });
    }
    else {
      setState(true)
    }
  }
  useEffect(() => {
    const getData = async () => {
      try {
        const token = await AsyncStorage.getItem('token') || null
        const name = await AsyncStorage.getItem('name') || null
        if(token && name !== null ) {
          navigation.replace('Home',{name: name,token : token})
        }
      } catch(e) {
        console.log(`e`, e)
      }
    }
    getData()
  }, [])
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Đăng nhập</Text>
      <TextInput value={name} label="Tài khoản" onChangeText={setName} mode='outlined' style={{ height: 50, width: "95%", marginTop: 20 }} />
      <TextInput value={password} secureTextEntry={statePassWord}
        label="Mật khẩu" onChangeText={setPassword} mode='outlined' style={{ height: 50, width: "95%", marginTop: 10 }} />
      {state ? <Text style={{ marginTop: 4, color: "red" }}>kiểm tra tài khoản mật khẩu</Text> : <View />}
      <TouchableOpacity onPress={() => onLogin()}
        style={{
          marginTop: 20, borderRadius: 10,
          height: 50, width: "50%", alignItems: "center", justifyContent: "center", backgroundColor: "#288fd4"
        }}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({})
