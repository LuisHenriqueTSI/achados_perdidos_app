import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Image, StyleSheet, View} from 'react-native';
import {Text, TextInput, useTheme} from 'react-native-paper';
import {Aluno} from '../model/Aluno';

export default function AlunoTela({route}: any) {
  const [aluno] = useState<Aluno | null>(route.params.aluno);
  const theme = useTheme();
  const {control} = useForm<any>({
    defaultValues: {
      nome: aluno?.nome,
      curso: aluno?.curso,
    },
  });

  return (
    <View
      style={{...styles.container, backgroundColor: theme.colors.background}}>
      <Text variant="headlineSmall">Detalhe do Aluno</Text>
      <Image
        style={styles.image}
        source={
          aluno && aluno?.urlFoto !== ''
            ? {uri: aluno?.urlFoto}
            : require('../assets/images/person.png')
        }
        loadingIndicatorSource={require('../assets/images/person.png')}
      />
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.textinput}
            label="Nome"
            placeholder="Digite seu nome completo"
            mode="outlined"
            autoCapitalize="words"
            returnKeyType="next"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            editable={false}
            right={<TextInput.Icon icon="smart-card" />}
          />
        )}
        name="nome"
      />
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.textinput}
            label="Curso"
            placeholder="Digite seu curso"
            mode="outlined"
            autoCapitalize="words"
            returnKeyType="next"
            keyboardType="default"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            editable={false}
            right={<TextInput.Icon icon="domain" />}
          />
        )}
        name="curso"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    borderRadius: 180 / 2,
    marginTop: 50,
  },
  textinput: {
    width: 350,
    height: 50,
    marginTop: 20,
    backgroundColor: 'transparent',
  },
});
