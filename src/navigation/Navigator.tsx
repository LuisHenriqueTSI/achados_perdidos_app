import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {StatusBar} from 'react-native';
import {Icon, useTheme} from 'react-native-paper';
import Menu from '../telas/Menu';
import ItensTela from '../telas/ItensTela'; // Tela para listar itens
import AdicionarItemTela from '../telas/AdicionarItemTela'; // Tela para adicionar item perdido/encontrado
import PerfilTela from '../telas/PerfilTela';
import SignIn from '../telas/SignIn';
import AlterarSenha from '../telas/AlteraSenha';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppStack = () => {
  const theme = useTheme();
  const ItensIcon = () => (
    <Icon source="clipboard-list" color={theme.colors.primary} size={20} />
  );
  const MenuIcon = () => (
    <Icon source="menu" color={theme.colors.primary} size={20} />
  );
  return (
    <Tab.Navigator
      initialRouteName="Itens"
      screenOptions={() => ({
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {backgroundColor: theme.colors.surface},
      })}>
      <Tab.Screen
        component={ItensTela}
        name="Itens"
        options={{
          tabBarLabel: 'Itens',
          tabBarIcon: ItensIcon,
        }}
      />
      <Tab.Screen
        component={Menu}
        name="Menu"
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: MenuIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default function Navigator() {
  const theme = useTheme();
  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={
          theme.dark ? theme.colors.surface : theme.colors.primary
        }
      />
      <Stack.Navigator
        initialRouteName="SignIn" // Tela de login será a inicial
        screenOptions={{
          headerShown: false,
        }}>
        {/* Tela de Login */}
        <Stack.Screen name="SignIn" component={SignIn} />

        {/* Stack para as telas do app após login */}
        <Stack.Screen name="AppStack" component={AppStack} />

        {/* Outras telas */}
        <Stack.Screen
          name="AdicionarItemTela"
          component={AdicionarItemTela}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen name="Perfil" component={PerfilTela} />
        <Stack.Screen name="AlterarSenha" component={AlterarSenha} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
