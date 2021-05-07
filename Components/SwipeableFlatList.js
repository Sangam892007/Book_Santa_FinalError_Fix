import React from 'react';
import {Text, View, TouchableOpacity, Stylesheet} from 'react-native'
import {Dimensions} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import db from '../Config';

export default class SwipeableFlatList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            allnotifications:this.props.allNotifications,
        }
        
    }
    renderItem = (data)=>{
        //console.log(data)
        var {item,index} = data
        return(
        <ListItem key = {index} bottomDivider>
       <Icon name = "book" type = "font-awsome" color = "red"/>
        <ListItem.Title>
        {item.Book_Name}
        </ListItem.Title>
        <ListItem.Subtitle>
        {item.message}
        </ListItem.Subtitle>
        <ListItem.Subtitle>
        {index}
        </ListItem.Subtitle>
        </ListItem>
        )
    }
    renderHiddenItem = ({item,i})=>{
        //console.log("HiddenItem")
       return(
        <View>
            <Text>
                Swipe to delete
            </Text>
        </View>
       )
    }
    UpdateMarkAsRead = (notifications,key)=>{
        //console.log(notifications)
        db.collection("ALL_NOTIFICATIONS").doc(notifications.Doc_ID).update({
            Notification_Status:"Read"
        })
        var newData = this.state.allnotifications.filter((data,index)=>data[index]!=data[key])
        this.setState({
            allnotifications:newData
        })

    }
    OnSwipeValueChange = (swipeData)=>{
        console.log("SwipeValueChanges")
        var allnotifications = this.state.allnotifications
        const {key,value} = swipeData
        if (value < -Dimensions.get("window").width) {
            const newData = [...allnotifications]
            this.UpdateMarkAsRead(allnotifications[key],key)
            
        console.log(newData)
        //newData.splice(key, 1)

        /*this.setState({
            allnotifications:newData,
        })*/
       
        
        }
    }

    render(){
        return(
            <View>
                <SwipeListView 
                disableRightSwipe
                data = {this.state.allnotifications}
                renderItem = {this.renderItem }
                renderHiddenItem = {this.renderHiddenItem}
                rightOpenValue = {-Dimensions.get('window').width}
                previewRowKey = {'0'}
                previewOpenValue = {-100}
                previewOpenDelay = {10000}
                onSwipeValueChange = {this.OnSwipeValueChange}
                keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}