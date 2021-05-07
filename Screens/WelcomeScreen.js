import React from 'react';
import {TouchableOpacity ,View ,Text, TextInput, StyleSheet, Modal, Alert, ScrollView,} from 'react-native';
import firebase from 'firebase';
import db from '../Config';

export default class WelcomeScreen extends React.Component{
    constructor(){
        super();
        this.state = ({
            EmailID:"",
            Password:"",
            firstName:"",
            lastName:"",
            address:"",
            phoneNo:"",
            confirmPassword:"",
            isModalVisible:false,
        })
    }
    ModalScreenPopUp = ()=>{
        return(
            <Modal animationType = "fade"
            transparent = {true}
            visible = {this.state.isModalVisible}>
                <View style = {styles.modalStyle}>
                    <ScrollView style = {{width:"100%"}}>
                        <Text style = {{color:"yellow",marginLeft:60,fontWeight:"bold",fontSize:30}}>
                            REGISTER HERE
                        </Text>
                        <View style = {{flex:0.7}}>
                        <TextInput style = {styles.textInputStyle} placeholderTextColor='yellow' placeholder = {"First Name"} onChangeText = {Text=>{
                            this.setState({
                                firstName:Text
                            })
                        }}>
                        </TextInput>
                         <TextInput style = {styles.textInputStyle} placeholderTextColor='yellow' placeholder = {"Last Name"} onChangeText = {Text=>{
                            this.setState({
                                lastName:Text
                            })
                        }}>   
                        </TextInput>
                         <TextInput style = {styles.textInputStyle} placeholderTextColor='yellow' placeholder = {"Address"} onChangeText = {Text=>{
                            this.setState({
                                address:Text
                            })
                        }}>   
                        </TextInput>
                         <TextInput style = {styles.textInputStyle} placeholderTextColor='yellow' placeholder = {"Phone NO."} onChangeText = {Text=>{
                            this.setState({
                                phoneNo:Text
                            })
                        }}>   
                        </TextInput>
                         <TextInput style = {styles.textInputStyle} placeholderTextColor='yellow' keyboardType = {'email-address'} placeholder = {"Email ID"} onChangeText = {Text=>{
                            this.setState({
                                EmailID:Text
                            })
                        }}> 
                        </TextInput>  
                        <TextInput style = {styles.textInputStyle} secureTextEntry = {true} 
                         placeholderTextColor='yellow' placeholder = {"Password"} onChangeText = {Text=>{
                            this.setState({
                                Password:Text
                            })
                        }}>   
                        </TextInput>
                         <TextInput style = {styles.textInputStyle} secureTextEntry = {true} 
                         placeholderTextColor='yellow' placeholder = {"Confirm password"} onChangeText = {Text=>{
                            this.setState({
                                confirmPassword:Text
                            })
                        }}>   
                        </TextInput>
                        </View>
                        <View style = {{flex:0.3,flexDirection:"row"}}>
                            <TouchableOpacity style = {styles.toStyle} onPress = {()=>{
                                this.SignUp();
                            }}>
                                <Text style = {{color:"yellow",marginLeft:30}}>
                                    REGISTER
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style = {[styles.toStyle],{marginLeft:80,marginTop:-25,marginLeft:190}} onPress = {()=>{
                                this.setState({
                                    isModalVisible:false
                                })
                            }}>
                                <Text style = {{color:"yellow"}}>
                                    CANCEL
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        )

    }
    LogIN = async()=>{
        firebase.auth().signInWithEmailAndPassword(this.state.EmailID,this.state.Password)
        .then(()=>{
            this.props.navigation.navigate("DonateBooks")
        })
        .catch(error=>{
            alert(error.code);
        })
    }
    SignUp = async()=>{
        if (this.state.Password !== this.state.confirmPassword){
            alert('Please Enter the Correct Password');
        }
        else{
            firebase.auth().createUserWithEmailAndPassword(this.state.EmailID,this.state.Password)
            .then(()=>{
                db.collection('USERS').add({
                    First_Name:this.state.firstName,
                    Last_Name:this.state.lastName,
                    Address:this.state.address,
                    Phone_No:this.state.phoneNo,
                    Email_ID:this.state.EmailID,
                })
                return(Alert.alert("You have succesfully created an account",'',[{
                    text:"OK",
                    onPress:()=>{
                        this.setState({
                            isModalVisible:false
                        })
                    }
                }]))
            })
            .catch(error=>{
                alert(error.code);
            })
        }
    }
    render(){
        return(
            <View style = {styles.container}>
                <View style = {{
                    justifyContent:"center",
                    alignItems:"center",
                }}>
                    {this.ModalScreenPopUp()}
                </View>
                <View style = {styles.heading}>
                    <Text style = {styles.title}>
                        Welcome To Book Santa
                    </Text>
                </View>
                <View style = {styles.inputContainer}>
                <TextInput style = {styles.inputBox}  placeholder = {"Enter E-mail ID"}
                keyboardType = {'email-address'}
                placeholderTextColor = {"#006400"}
                onChangeText = {Text=>{
                    this.setState({
                        EmailID:Text
                    })
                }}
                />
                <TextInput style = {styles.inputBox} secureTextEntry = {true} placeholder = {"Enter Password"}
                placeholderTextColor = {"#006400"}
                onChangeText = {Text=>{
                    this.setState({
                       Password:Text
                    })
                }}
                />
                <TouchableOpacity style = {styles.buttonStyle} onPress = {()=>{
                    this.LogIN();
                }}>
                    <Text style = {{color:"blue"}}>
                        Log IN
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style = {[styles.buttonStyle,{marginTop:20}]} onPress = {()=>{
                    this.setState({
                        isModalVisible:true,
                    })
                }}>
                    <Text style = {{color:"blue"}}>
                        Sign UP?
                    </Text>
                </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#FFFF00",
    },
    heading:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },
    title:{
        fontSize:30,
        fontWeight:'bold',
        color:"#DC143C",
        paddingBottom:40,
        marginBottom:50,
    },
    inputContainer:{
        flex:1,
        alignItems:"center",
    },
    inputBox:{
        width:300,
        height:30,
        borderColor:"#FFA500",
        fontSize:30,
        margin:20,
        borderBottomWidth:2,
        paddingLeft:40,
        marginBottom:50,
        marginTop:-20,
    },
    buttonStyle:{
        width:150 ,
        height:30 ,
        borderRadius:10,
        backgroundColor:"#BFFF00",
        justifyContent:"center",
        alignItems:"center",
        shadowColor:"black",
        shadowOffset:{width:0,height:5},
        shadowOpacity:0.7,
        shadowRadius:5,
        elevation:20,
    },
    modalStyle:{
        flex:1,
        borderRadius:25,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"black",
        marginLeft:30,
        marginTop:80,
        marginBottom:80,
        marginRight:30,
    },
    textInputStyle:{
        width:'70%',
        height:50,
        borderWidth:2,
        borderColor:"yellow",
        borderRadius:3,
        alignSelf:"center",
        marginTop:10,
        padding:10,
        color:"yellow",
    },
    toStyle:{
        width:100,
        height:30,
        backgroundColor:"black",
        marginTop:10,
        justifyContent:"center",
        alignItems:"center"
       
    }

})