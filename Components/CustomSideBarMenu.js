import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity,} from 'react-native';
import {Avatar} from 'react-native-elements';
import {DrawerItems} from 'react-navigation-drawer';
import firebase from 'firebase';
import *as ImagePicker from 'expo-image-picker';
import db from "../Config";

export default class CustomSideBarMenu extends React.Component{
    constructor(){
        super();
        this.state = {
            user_ID:firebase.auth().currentUser.email,
            image : "#",
            name: "",
            Doc_ID:"",
        }

    }
    fetchImage = (imageName)=>{
        var storageref = firebase.storage().ref().child("PROFILE_PICS/" + imageName)
        storageref.getDownloadURL().then(URL =>{
            this.setState({
                image:URL
            })
            }).catch(error =>{
                this.setState({
                    image:"#"
                })
        })

    }
    componentDidMount(){
        this.fetchImage(this.state.user_ID)
    }
    uploadImage = async(uri,imageName)=>{
        var image = await fetch(uri)
        var blob = await image.blob()
        var ref = firebase.storage().ref().child("PROFILE_PICS/" + imageName)
        return(
            ref.put(blob).then(response =>{
                this.fetchImage(imageName)
            })
        )
    }
    selectPicture = async()=>{
        const {cancel,uri} = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[4,3],
            quality:1,

        })
        if (!cancel){
            this.setState({
                image:uri
            })
            this.uploadImage(uri,this.state.user_ID)

        }
    }
    render(){
        return(
            <View style = {{flex:1}}>
                <View style = {{flex:0.5,alignItems:"center",backgroundColor:"grey"}}>
                    <Avatar rounded source = {{uri:this.state.image}} size = "medium" onPress = {()=>{
                        this.selectPicture()
                    }} containerStyle = {{flex:0.75,width:"45%",height:"20%",marginLeft:25,marginTop:30,borderRadius:5}} 
                    showEditButton />
                    <Text>
                        {this.state.name}
                    </Text>

                </View>
                <View style = {styles.drawerItemContainer}>
                    <DrawerItems {...this.props}/>

                </View>
                <View style = {styles.logOutContainer}>
                    <TouchableOpacity style = {styles.logOutButton} onPress = {()=>{
                        this.props.navigation.navigate('WelcomeScreen')
                        firebase.auth().signOut()
                    }}>
                        <Text>
                            Log Out
                        </Text>

                    </TouchableOpacity>

                </View>


            </View>
        )
    }
}
const styles = StyleSheet.create({
    drawerItemContainer:{
        flex:0.8,
    },
    logOutButton:{
        height:30,
        width:'100%',
        justifyContent:'center',
        padding:10,
    },
    logOutContainer:{
        flex:0.2,
        justifyContent:'flex-end',
        paddingBottom:30
    }
})