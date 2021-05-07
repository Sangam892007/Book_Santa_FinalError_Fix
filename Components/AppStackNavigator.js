import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import DonateScreen from '../Screens/DonateScreen';
import RecieverScreen from '../Screens/RecieverScreen';

export const AppStackNavigator = createStackNavigator({
    DonateList:{
        screen:DonateScreen,
        navigationOptions:{
            headerShown:false
        }
    },
    RecieverDetails:{
        screen:RecieverScreen,
        navigationOptions:{
            headerShown:false
        }
    }
},
{initialRouteName:"DonateList"})