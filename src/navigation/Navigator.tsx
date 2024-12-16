/* eslint-disable react/no-unstable-nested-components */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {StatusBar} from 'react-native';
import {Icon, useTheme} from 'react-native-paper';
import AlteraSenha from '../telas/AlteraSenha';
import AlunoTela from '../telas/AlunoTela';
import Alunos from '../telas/Alunos';
import EmpresaTela from '../telas/EmpresaTela';
import Empresas from '../telas/Empresas';
import EsqueceuSenha from '../telas/EsqueceuSenha';
import Menu from '../telas/Menu';
import Perfil from '../telas/PerfilTela';
import Preload from '../telas/Preload';
import ProfessorTela from '../telas/ProfessorTela';
import Professores from '../telas/Professores';
import SignIn from '../telas/SignIn';
import SignUp from '../telas/SignUp';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="Preload"
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen component={Preload} name="Preload" />
    <Stack.Screen component={SignIn} name="SignIn" />
    <Stack.Screen component={SignUp} name="SignUp" />
    <Stack.Screen component={EsqueceuSenha} name="EsqueceuSenha" />
  </Stack.Navigator>
);

const AppStack = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="Alunos"
      screenOptions={() => ({
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {backgroundColor: theme.colors.surface},
      })}>
      <Tab.Screen
        component={Alunos}
        name="Alunos"
        options={{
          tabBarLabel: 'Alunos',
          tabBarIcon: () => (
            <Icon
              source="account-group"
              color={theme.colors.primary}
              size={20}
            />
          ),
        }}
      />
      <Tab.Screen
        component={Professores}
        name="Professores"
        options={{
          tabBarLabel: 'Professores',
          tabBarIcon: () => (
            <Icon
              source="account-tie-hat"
              color={theme.colors.primary}
              size={20}
            />
          ),
        }}
      />
      <Tab.Screen
        component={Empresas}
        name="Empresas"
        options={{
          tabBarLabel: 'Empresas',
          tabBarIcon: () => (
            <Icon
              source="office-building-outline"
              color={theme.colors.primary}
              size={20}
            />
          ),
        }}
      />
      <Tab.Screen
        component={Menu}
        name="Menu"
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: () => (
            <Icon source="menu" color={theme.colors.primary} size={20} />
          ),
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
        initialRouteName="AuthStack"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen component={AuthStack} name="AuthStack" />
        <Stack.Screen component={AppStack} name="AppStack" />
        <Stack.Screen
          component={AlunoTela}
          name="AlunoTela"
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          component={ProfessorTela}
          name="ProfessorTela"
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          component={EmpresaTela}
          name="EmpresaTela"
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen component={Perfil} name="Perfil" />
        <Stack.Screen component={AlteraSenha} name="AlteraSenha" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
