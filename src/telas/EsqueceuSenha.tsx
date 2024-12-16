import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {Button, Dialog, Text, TextInput, useTheme} from 'react-native-paper';
import * as yup from 'yup';
import {AuthContext} from '../context/AuthProvider';

const requiredMessage = 'Campo obrigatório';

const schema = yup.object().shape({
  email: yup
    .string()
    .required(requiredMessage)
    .matches(/\S+@\S+\.\S+/, 'Email inválido'),
});

export default function EsqueceuSenha({navigation}: any) {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<any>({
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });
  const [requisitando, setRequisitando] = useState(false);
  const {recuperarSenha} = useContext<any>(AuthContext);
  const [dialogVisivel, setDialogVisivel] = useState(false);
  const [mensagem, setMensagem] = useState({tipo: '', mensagem: ''});

  async function onSubmit(data: any) {
    const msg = await recuperarSenha(data.email);
    if (msg === 'ok') {
      setRequisitando(false);
      setMensagem({
        tipo: 'ok',
        mensagem:
          'Show! Um email foi enviado e pode estar na caixa de entrada ou caixa de spam.',
      });
      setDialogVisivel(true);
    } else {
      setRequisitando(false);
      setMensagem({tipo: 'erro', mensagem: msg});
      setDialogVisivel(true);
    }
  }

  return (
    <View
      style={{...styles.container, backgroundColor: theme.colors.background}}>
      <Text variant="headlineMedium">Recuperar Senha</Text>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.textinput}
            label="Email"
            placeholder="Digite seu email cadastrado"
            mode="outlined"
            autoCapitalize="none"
            returnKeyType="next"
            keyboardType="email-address"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            right={<TextInput.Icon icon="email" />}
          />
        )}
        name="email"
      />
      {errors.email && (
        <Text style={{...styles.textError, color: theme.colors.error}}>
          {errors.email?.message?.toString()}
        </Text>
      )}
      <Button
        style={styles.button}
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={requisitando}
        disabled={requisitando}>
        {!requisitando ? 'Enviar' : 'Enviando'}
      </Button>
      <Dialog
        visible={dialogVisivel}
        onDismiss={() => {
          setDialogVisivel(false);
          if (mensagem.tipo === 'ok') {
            navigation.goBack();
          }
        }}>
        <Dialog.Icon icon="alert-circle-outline" size={60} />
        <Dialog.Title style={styles.textDialog}>
          {mensagem.tipo === 'ok' ? 'Informação' : 'Erro'}
        </Dialog.Title>
        <Dialog.Content>
          <Text style={styles.textDialog} variant="bodyLarge">
            {mensagem.mensagem}
          </Text>
        </Dialog.Content>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  textinput: {
    width: 350,
    height: 50,
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  textError: {
    width: 350,
  },
  button: {
    marginTop: 50,
    marginBottom: 30,
    width: 350,
  },
  textDialog: {
    textAlign: 'center',
  },
});
