import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/TabBarIcon';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarLabelStyle: { fontWeight: 'bold' },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Start',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color='black' />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Wyszukaj',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'search' : 'search-outline'} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name='reservations'
        options={{
          title: 'Rezerwacje',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color='black' />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}