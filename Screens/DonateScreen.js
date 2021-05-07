import React from 'react';
import {TouchableOpacity ,View ,Text, TextInput, StyleSheet, Modal, Alert, ScrollView, FlatList} from 'react-native';
import {ListItem} from 'react-native-elements';
import Myheader from '../Components/Myheader.js';
import firebase from 'firebase';
import db from "../Config";

export default class DonateScreen extends React.Component{
    constructor(){
        super()
        this.state = {
           UserID:firebase.auth().currentUser.email,
           Requested_Books_List:[]
        }
        this.Request_ref = null
    }
    Get_Books = ()=>{
        this.Request_ref = db.collection("REQUESTED_BOOKS").where("DonationStatus","==",false).onSnapshot(snapShot =>{
            var Books = snapShot.docs.map(doc=>doc.data())
            this.setState({
                Requested_Books_List:Books
            })
        })
    }
    componentDidMount(){
        this.Get_Books();
    }
    componentWillUnmount(){
        this.Request_ref();
    }
    keyExtractor = (item, index) => index.toString()
    renderItem = ({item,i})=>{
        //console.log(item);
        return(
            <ListItem key = {i} bottomDivider>
                <ListItem.Title>
                    {item.Book_Name}
                </ListItem.Title>
                <ListItem.Subtitle>
                    {item.Reason}
                </ListItem.Subtitle>
                <TouchableOpacity style = {styles.button} onPress = {()=>{
                    console.log("it works")
                    this.props.navigation.navigate("RecieverDetails",{Details:item})
                }}>
                    <Text>
                        View Details
                    </Text>
                </TouchableOpacity>
            </ListItem>
        )
    }
    render(){
        return(
            <View style = {{flex:1}}>
                <Myheader title = "DONATE HERE"/>
                <View style = {{flex:1}}>
                    {
                        this.state.Requested_Books_List.length === 0 ?
                        (
                            <View style = {styles.subContainer}>
                                <Text>
                                    List Of All Requested Books
                                </Text>
                            </View>

                        )
                        :(<FlatList keyExtractor = {this.keyExtractor} 
                            data = {this.state.Requested_Books_List} 
                            renderItem = {this.renderItem}/>
                            
                        )
                    }

                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({ 
    subContainer:{ flex:1, 
        fontSize: 20, 
        justifyContent:'center', 
        alignItems:'center' }, 
    button:{ width:100, 
       height:30, 
       justifyContent:'center', 
       alignItems:'center', 
       backgroundColor:"#ff5722", 
       shadowColor: "#D9D9D6", 
    shadowOffset: { width: 0, 
        height: 8 } } })