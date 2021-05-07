import React from 'react';
import {View, Text, StyleSheet } from 'react-native';
import {Card, Header, Icon} from 'react-native-elements';
import firebase from 'firebase';
import db from '../Config';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class RecieverScreen extends React.Component{
    constructor(props){ 
        super(props); 
        this.state={ 
            userId : firebase.auth().currentUser.email, 
            userName : "", 
            recieverId : this.props.navigation.getParam('Details')["User_ID"] , 
            requestId : this.props.navigation.getParam('Details')["Request_ID"], 
            bookName : this.props.navigation.getParam('Details')["Book_Name"], 
            reason_for_requesting : this.props.navigation.getParam('Details')["Reason"], 
            recieverName : '', 
            recieverContact : '', 
            recieverAddress : '', 
            recieverRequestDocId : '' ,
            disabledButton:false,
            Info:"I want to donate",
            DonationStatus:true
        } }
    UpdateBookStatus = ()=>{
        db.collection('ALL_DONATIONS').add({
            Book_Name:this.state.bookName,
            Request_ID:this.state.requestId,
            Requested_By:this.state.recieverName,
            Donor_ID:this.state.userId,
            Request_Status:"Donor Interested",
            DonationStatus:this.state.DonationStatus
        })
    }
    AddNotifications = ()=>{
        db.collection("ALL_NOTIFICATIONS").add({
            targeted_User_ID:this.state.recieverId,
            Donor_ID:this.state.userId,
            Request_ID:this.state.requestId,
            Book_Name:this.state.bookName,
            Date:firebase.firestore.FieldValue.serverTimestamp(),
            Notification_Status:"Unread",
            Message:this.state.userName+"is interested in donating"
        })
    }
    GetRecieverDetails = ()=>{
        db.collection("USERS").where('Email_ID','==',this.state.userId).get()
        .then(snapshot =>{
            snapshot.forEach(Doc =>{
                this.setState({
                    recieverName:Doc.data().First_Name,
                    recieverContact:Doc.data().Phone_No,
                    recieverAddress:Doc.data().Address,
                })
            })
        })
        db.collection("REQUESTED_BOOK").where("Request_ID",'==',this.state.requestId).get()
        .then(snapshot =>{
            snapshot.forEach(Doc=>{
                this.setState({
                    recieverRequestDocId:Doc.id
                })
            })
            
        })
    }
    GetUserDetails = (User_ID)=>{
        db.collection('USERS').where('Email_ID','==',User_ID).get()
        .then(snapshot=>{
            snapshot.forEach(Doc=>{
                this.setState({
                    userName:Doc.data().First_Name
                })
            })
        })
    }
    /*ChangeDonationStatus = ()=>{
        db.collection("REQUESTED_BOOKS").update(
            DonationStatus = true
        )
    }*/
    
    componentDidMount(){
        this.GetUserDetails(this.state.userId)
        this.GetRecieverDetails()
    }

    render(){
        return(
            <View style = {styles.container}>
                <View style = {{flex:0.1}}>
                    <Header 
                    leftComponent = {<Icon 
                        name = 'arrow-left' 
                        type = 'feather' 
                        color = "green" 
                        onPress = {()=>{
                        this.props.navigation.goBack()
                    }} />}
                    centerComponent = {{text:"DonateBook" }}
                    backgroundColor = "red"/>
                   
                     
                </View>
                <View style = {{flex:0.3}}>
                    <Card title = "Book Information" titleStyle = {{fontSize:20}}>
                        <Card>
                            <Text style = {{fontWeight:"bold"}}>
                                Name: {this.state.bookName}
                            </Text>

                        </Card>
                        <Card>
                            <Text style = {{fontWeight:"bold"}}>
                                Reason: {this.state.reason_for_requesting}
                            </Text>
                        </Card>
                    </Card>
                        </View>
                        <View style = {{flex:0.3}}>
                        <Card title = {"RecieverDetails"} titleStyle = {{fontSize:20}}>
                            <Card>
                                <Text>
                                    RecieverName: {this.state.recieverName}
                                </Text>
                            </Card>
                            <Card>
                                <Text>
                                    RecieverContact {this.state.recieverContact}
                                </Text>
                            </Card>
                            <Card>
                                <Text>
                                    RecieverAddress: {this.state.recieverAddress}
                                </Text>
                            </Card>
                        </Card>
                        </View>
                        <View style = {styles.buttonContainer} >
                            {
                                this.state.recieverId !== this.state.userId
                                ?(
                                    <TouchableOpacity style = {styles.button} disabled = {this.state.disabledButton} onPress = {()=>{
                                        this.UpdateBookStatus()
                                        this.AddNotifications()
                                        this.props.navigation.navigate("MyDonations")
                                        this.setState({
                                            disabledButton:true,
                                            Info:"Donated",
                                            DonationStatus:true

                                        })
                                    }}>
                                        <Text>
                                            {this.state.Info}
                                        </Text>
                                    </TouchableOpacity>
                                ): null
                                

                            }
                        </View>
               
            </View>
        )
    }
}

const styles = StyleSheet.create({ 
    container: { flex:1, }, 
    buttonContainer : { 
        flex:0.3, 
        justifyContent:'center', 
        alignItems:'center' }, 
    button:{ width:200, 
        height:50, 
        justifyContent:'center', 
        alignItems : 'center', 
    borderRadius: 10, 
    backgroundColor: 'orange', 
    shadowColor: "#000", 
    shadowOffset: { 
        width: 0, 
        height: 8 }, 
        elevation : 16 } })