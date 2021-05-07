import React from 'react';
import {TouchableOpacity ,View ,Text, TextInput, StyleSheet, Modal, Alert, ScrollView, KeyboardAvoidingView, FlatList} from 'react-native';
import MyHeader from "../Components/Myheader";
import firebase from 'firebase';
import db from '../Config';
import BookSearch from 'react-native-google-books';
import index from '../node_modules/react-native-google-books/index';
import { ThemeProvider } from 'react-native-elements';
import { TouchableHighlight } from 'react-native';

//AIzaSyAetsyOsXjUXevtnwrxJs-nD7ZKyTHBxV0 (google api Key)

export default class RequestScreen extends React.Component{
    constructor(){
        super()
        this.state = {
           UserID:firebase.auth().currentUser.email,
           Book_Name:'',
           Reason:'',
           Book_Status:'',
           Request_ID:'',
           Date:'',
           Image_Link:'',
           IsBookRequestActive:'',     
           ShowFlatList:false,
           DataSource:'',
           Doc_ID:'',
           User_DocID:'',
           RequestedBookName:'',

        }
    }
    SendNotifications = ()=>{
        db.collection('USERS').where("Email_ID","==",this.state.UserID).get().
        then(snapshot=>{
            snapshot.forEach(Doc=>{
                var FirstName = Doc.data().First_Name
                var LastName = Doc.data().Last_Name
                db.collection('ALL_NOTIFICATIONS').where("Request_ID","==",this.state.Request_ID).get()
                .then(snapshot=>{
                    snapshot.forEach(Doc=>{
                        var DonorID = Doc.data().Donor_ID
                        var BookName = Doc.data().Book_Name
                        db.collection('All_NOTIFICATIONS').add({
                            targeted_User_ID:DonorID,
                            Message:FirstName + " has received the book "+ BookName,
                            NotificationStatus:"Unread",
                            Book_Name:BookName
                        })
                    })
                })
            })
        })
    }
    componentDidMount(){
        this.GetBookRequest()
        this.GetIsBookRequestActive()
    }
    GetBooksFromAPI = async(Book_Name)=>{
        console.log("InsideGetBooksFromAPI")
        this.setState({
            Book_Name:Book_Name
        })
        if (this.state.Book_Name.length > 2) {
            var books = await BookSearch.searchbook(Book_Name,'AIzaSyAetsyOsXjUXevtnwrxJs-nD7ZKyTHBxV0')
            this.setState({
                DataSource:books.data,
                ShowFlatList:true
            })
        }
    }
    UpdateBookRequestStatus = ()=>{
        db.collection('REQUESTED_BOOKS').doc(this.state.Doc_ID).update({
            Book_Status:"Received"
        })
        db.collection('USERS').where("Email_ID","==",this.state.User_ID).get()
        .then(snapshot=>{
            snapshot.forEach(Doc=>{
                db.collection('USERS').doc(this.state.Doc_ID).update({
                    IsBookRequestActive:false
                })
            })
        })
    }
    GetBookRequest = ()=>{
        db.collection('REQUESTED_BOOKS').where("User_ID","==",this.state.UserID).get()
        .then(snapshot=>{
            snapshot.forEach(Doc=>{
                if (Doc.data().Book_Status !== "received") {
                    this.setState({
                        Request_ID:Doc.data().Request_ID,
                        RequestedBookName:Doc.data().Book_Name,
                        Book_Status:Doc.data().Book_Status,
                        Doc_ID:Doc.id
                    })
                }
            })
        })
    }
    AddRequest = async(Book_Name)=>{
        var requestID = Math.random().toString(25).substring(7)
        var books = await BookSearch.searchbook(Book_Name,'AIzaSyAetsyOsXjUXevtnwrxJs-nD7ZKyTHBxV0')
        db.collection("REQUESTED_BOOKS").add({
            User_ID:this.state.UserID,
            Book_Name:this.state.Book_Name,
            Reason:this.state.Reason,
            Request_ID:requestID,
            Book_Status:"requested",
            Date:firebase.firestore.FieldValue.serverTimestamp(),
            Image_Link:books.data[0].volumeInfo.imageLinks.smallThumbnail
        })
        await this.GetBookRequest()
        db.collection('USERS').where("Email_ID","==",this.state.UserID).get()
        .then().then(snapshot=>{
            snapshot.forEach(Doc=>{
                db.colllection('USERS').doc(Doc.id).update({
                    IsBookRequestActive:true
                })
            })
        })
        this.setState({
            Book_Name:'',
            Reason:'',
            Request_ID:requestID,
        })
        alert("Request Submitted");
    }
    receivedBooks = ()=>{
        db.collection('RECEIVED_BOOKS').add({
            User_ID:this.state.UserID,
            Book_Name:this.state.Book_Name,
            Request_ID:requestID,
            Book_Status:"received",
        })
    }
    GetIsBookRequestActive = ()=>{
        db.collection('USERS').where("Email_ID","==",this.state.UserID)
        .onSnapshot(Doc=>{
            Doc.forEach(doc=>{
                this.setState({
                    IsBookRequestActive:doc.data().IsBookRequestActive,
                    User_DocID:doc.id,

                })
            })
        })
    }
    renderItem = ({item,index})=>{
        return(
            <TouchableHighlight style = {{alignItems:"center",backgroundColor:"orange",padding:10,width:"90%"}} activeOpacity = {0.5} 
            underlayColor = {"yellow"} onPress = {()=>{
                this.setState({
                    ShowFlatList:false,
                    Book_Name:item.volumeInfo.title
                })

            }}>
                <Text>
                    {item.volumeInfo.title}
                </Text>
            </TouchableHighlight>
        )
    }
    render(){
        console.log(this.state.IsBookRequestActive)
        if (this.state.IsBookRequestActive === true) {
            return(
                <View style = {{flex:1,justifyContent:"center"}}>
                    <View style = {{borderColor:"orange",borderWidth:2,justifyContent:"center",alignItems:"center",padding:10,margin:10}}>
                        <Text>
                            Book Name 
                        </Text>
                        <Text>
                            {this.state.RequestBookName}
                        </Text>
                    </View>
                    <View style = {{borderColor:"orange",borderWidth:2,justifyContent:"center",alignItems:"center",padding:10,margin:10}}>
                        <Text>
                            Book Status
                        </Text>
                        <Text>
                            {this.state.Book_Status}
                        </Text>
                    </View>
                    <TouchableOpacity style = {{borderWidth:1,borderColor:"orange",backgroundColor:"black",width:300,alignSelf:"center",alignItems:"center",height:30,marginTop:30}}
                    onPress = {()=>{
                        this.SendNotifications()
                        this.receivedBooks()
                        this.UpdateBookRequestStatus()
                    }}>
                        <Text>
                            Book Received
                        </Text>
                    </TouchableOpacity>
                </View>

            )
        }
        else{
        return(
            <View style = {{flex:1}}>
                <MyHeader title = "REQUEST HERE" navigation = {this.props.navigation}/>
                <KeyboardAvoidingView style = {styles.keyBoardStyle}>
                    <TextInput placeholder = "Book Name" style = {styles.formTextInput}  onClear = {()=>{
                        this.GetBooksFromAPI('')
                    }} 
                        onChangeText = {(text)=>{
                           this.GetBooksFromAPI(text)
                        }}
                        value = {this.state.Book_Name}/>
                        {
                            this.state.ShowFlatList?(<FlatList data = {this.state.DataSource} renderItem = {this.renderItem} style = {{marginTop:30}} keyExtractor = {(item,index)=>{
                                index.toString()
                            }}/>):(
                        <View>
                        <TextInput placeholder = "Reason"  style = {styles.formTextInput} multiline = {true} numberOfLines = {5} onChangeText = {(text)=>{
                            this.setState({
                                Reason:text,
                            })
                        }}>
                    </TextInput>
                    <TouchableOpacity style = {styles.button} onPress = {()=>{
                        this.AddRequest();
                    }}>
                        <Text>
                            REQUEST BOOK
                        </Text>
                    </TouchableOpacity>
                    </View>
                     )}
                </KeyboardAvoidingView>
            </View>
        )
    }
  }
}
const styles = StyleSheet.create({ 
    keyBoardStyle : { flex:1, 
        alignItems:'center', 
        justifyContent:'center' }, 
    formTextInput:{ width:"75%",
        height:35,
        alignSelf:'center', 
        borderColor:'#ffab91', 
        borderRadius:10, 
        borderWidth:1, 
        marginTop:20, 
        padding:10, }, 
    button:{ width:"75%", 
        height:50, 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:10, 
        backgroundColor:"#ff5722", 
        shadowColor: "#000", 
    shadowOffset: { width: 0, 
        height: 8, }, 
        shadowOpacity: 0.44, 
        shadowRadius: 10.32, 
        elevation: 16, 
        marginTop:20 }, } )
