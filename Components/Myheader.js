import React from 'react';
import {TouchableOpacity ,View ,Text, TextInput, StyleSheet, Modal, Alert, ScrollView} from 'react-native';
import {Header, Icon} from 'react-native-elements';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

export default class MyHeader extends React.Component{ 
    constructor(props){
        super(props)
    }
    render(){
    return(
        <SafeAreaProvider>
        <Header 
        centerComponent = {{text:this.props.title,style:{color:"green",fontSize:28,fontWeight:"bold"}}}
        backgroundColor = "red" />
        </SafeAreaProvider>
    )
}}