import React from 'react';
import {Text, View, TouchableOpacity, Stylesheet} from 'react-native'
import {Dimensions} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import SwipeableFlatList from "../Components/SwipeableFlatList";
import MyHeader from '../Components/Myheader.js'
import db from '../Config';
import firebase from 'firebase';

export default class NotificationScreen extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            userID:firebase.auth().currentUser.email,
            allNotifications:[]
        }
        this.Notification = null
    }
    componentDidMount(){
        this.GetNotifications()
    }
    GetNotifications = ()=>{
        this.Notification = db.collection("ALL_NOTIFICATIONS").where("Notification_Status","==","Unread")
        .where("targeted_User_ID","==",this.state.userID)
        .onSnapshot(snapshot=>{
            
            var allNotifications = []
            snapshot.docs.map(doc=>{
                {
                    var notifications = doc.data()
                    notifications["Doc_ID"] = doc.id
                    allNotifications.push(notifications)
                }
            })
            this.setState({
                allNotifications:allNotifications
            })
        })
    }
    componentWillUnmount(){
        this.Notification
    }
    render(){
        //console.log(this.state.allNotifications.length+" length")
        return(
            <View style ={{flex:1}}>
                <View style = {{flex:0.1}}>
                    <MyHeader title = "NOTIFICATIONS SCREEN" navigation = {this.props.navigation}/>
                </View>
                <View style = {{flex:0.9}}>
                    {
                        
                        this.state.allNotifications.length === 0?(
                            <View>
                                <Text>
                                    You have no notifications
                                </Text>
                            </View>
                        ):(
                            <SwipeableFlatList allNotifications = {this.state.allNotifications}/>
                        )
                    }

                </View>
            </View>
        )
    }
}