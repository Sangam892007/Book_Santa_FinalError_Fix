import React from 'react';
import {TouchableOpacity ,View ,Text, TextInput, StyleSheet, Modal, Alert, ScrollView, FlatList} from 'react-native';
import {ListItem} from 'react-native-elements';
import MyHeader from '../Components/Myheader.js';
import firebase from 'firebase';
import db from "../Config";

export default class MyDonationsScreen extends React.Component{
    constructor(){
        super()
        this.state = {
            Donor_ID:firebase.auth().currentUser.email,
            Donor_Name:'',
            All_Donations:[]
        }
        this.requestRef = null
    }
    GetDonorDetails = (Donor_ID)=>{
        db.collection("USERS").where("Email_ID","==",Donor_ID).get()
        .then(
            snapshot=>{
                snapshot.forEach(Doc=>{
                    this.setState({
                        Donor_Name:Doc.data().First_Name
                    })
                })
            }
        )
    }
    GetAllDonations = ()=>{
        this.requestRef = db.collection("ALL_DONATIONS").where("Donor_ID","==",this.state.Donor_ID)
        .onSnapshot(snapshot=>{
            var allDonations = []
            snapshot.docs.map(Doc=>{
                var donations = Doc.data()
                console.log(donations)
                donations["Doc_ID"] = Doc.id
                allDonations.push(donations)
            }
            )
            this.setState({
                All_Donations:allDonations
            })
        })
    }
    componentDidMount(){
        this.GetAllDonations();
        this.GetDonorDetails(this.state.Donor_ID);
    }
    keyExtractor = (item, index)=>{
        return( index.toString())
    }
    renderItem = ({item,i})=>{
        console.log(MyDonationsScreen)
        console.log(item);
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
            <View style ={{flex:1}}>
                <View style = {{flex:0.1}}>
                    <MyHeader title = "MY DONATIONS" navigation = {this.props.navigation}/>
                </View>
                <View style = {{flex:0.9}}>
                    {
                        this.state.All_Donations.length === 0?(
                            <View>
                                <Text>
                                    You have no notifications
                                </Text>
                            </View>
                        ):(
                            <FlatList keyExtractor = {this.keyExtractor} data = {this.state.All_Donations} renderItem = {this.renderItem}/>
                        )
                    }

                </View>
            </View>
        )
    }
}



const styles = StyleSheet.create({ 
    button:{ 
        width:100, 
        height:30, 
        justifyContent:'center',
        alignItems:'center', 
        shadowColor: "#000", 
    shadowOffset: { 
        width: 0, 
        height: 8 }, 
    elevation : 16 }, 
    subtitle :{ 
        flex:1, 
        fontSize: 20, 
        justifyContent:'center', 
        alignItems:'center' } })