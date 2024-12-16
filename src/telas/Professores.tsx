/* eslint-disable react/no-unstable-nested-components */
import React, {useContext} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Avatar, Card, List, useTheme} from 'react-native-paper';
import {UserContext} from '../context/UserProvider';
import {Usuario} from '../model/Usuario';

export default function Professores({navigation}: any) {
  const theme = useTheme();
  const {professores} = useContext<any>(UserContext);

  const irParaTelaProfessor = (professor: Usuario) => {
    navigation.navigate('ProfessorTela', {
      professor,
    });
  };

  return (
    <View
      style={{...styles.container, backgroundColor: theme.colors.background}}>
      <List.Section
        style={{...styles.list, backgroundColor: theme.colors.background}}>
        <List.Subheader style={styles.subhearder}>
          Lista de Professores
        </List.Subheader>
        <ScrollView>
          {professores.map((professor: Usuario, key: number) => (
            <Card
              key={key}
              style={{...styles.card, borderColor: theme.colors.secondary}}
              onPress={() => irParaTelaProfessor(professor)}>
              <Card.Title
                title={professor.nome}
                subtitle={professor.curso}
                left={() => (
                  <Avatar.Image size={40} source={{uri: professor.urlFoto}} />
                )}
              />
            </Card>
          ))}
        </ScrollView>
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subhearder: {
    fontSize: 20,
    alignSelf: 'center',
  },
  list: {
    width: '95%',
  },
  card: {
    height: 100,
    width: '100%',
    borderWidth: 1,
    marginBottom: 10,
  },
});
