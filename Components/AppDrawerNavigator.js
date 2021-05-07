import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {AppTabNavigator} from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import Settings from '../Screens/Settings';
import NotificationScreen from '../Screens/NotificationScreen';
import MyDonationsScreen from '../Screens/MyDonationsScreen';

export const AppDrawerNavigator = createDrawerNavigator({
    Home:{
        screen:AppTabNavigator
    },
    Settings:{
        screen:Settings
    },
    Notifications:{
        screen:NotificationScreen
    },
    MyDonations:{
        screen:MyDonationsScreen
    }
},
{
    contentComponent:CustomSideBarMenu
},
{
    initialRouteName:'Home'
}
)