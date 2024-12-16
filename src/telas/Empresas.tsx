/* eslint-disable react/no-unstable-nested-components */
import React, {useContext} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Avatar, Card, FAB, List, useTheme} from 'react-native-paper';
import {EmpresaContext} from '../context/EmpresaProvider';
import {Empresa} from '../model/Empresa';

export default function Empresas({navigation}: any) {
  const theme = useTheme();
  const {empresas} = useContext<any>(EmpresaContext);

  const irParaTelaEmpresa = (empresa: Empresa | null) => {
    navigation.navigate('EmpresaTela', {
      empresa,
    });
  };

  return (
    <View
      style={{...styles.container, backgroundColor: theme.colors.background}}>
      <List.Section
        style={{...styles.list, backgroundColor: theme.colors.background}}>
        <List.Subheader style={styles.subhearder}>
          Lista de Empresas
        </List.Subheader>
        <ScrollView>
          {empresas.map((empresa: Empresa, key: number) => (
            <Card
              key={key}
              style={{...styles.card, borderColor: theme.colors.secondary}}
              onPress={() => irParaTelaEmpresa(empresa)}>
              <Card.Title
                title={empresa.nome}
                subtitle={empresa.tecnologias}
                left={() => (
                  <Avatar.Image size={40} source={{uri: empresa.urlFoto}} />
                )}
              />
            </Card>
          ))}
        </ScrollView>
      </List.Section>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => irParaTelaEmpresa(null)}
      />
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
