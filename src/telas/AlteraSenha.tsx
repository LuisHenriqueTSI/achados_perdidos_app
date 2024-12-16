import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {Button, Dialog, Text, TextInput, useTheme} from 'react-native-paper';
import * as yup from 'yup';
import {AuthContext} from '../context/AuthProvider';

const requiredMessage = 'Campo obrigatório';

const schema = yup
  .object()
  .shape({
    senha_atual: yup
      .string()
      .required(requiredMessage)
      .matches(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/,
        'A senha deve conter ao menos uma letra maiúscula, uma letra minúscula, um númeral, um caractere especial e um total de 8 caracteres',
      ),
    nova_senha: yup
      .string()
      .required(requiredMessage)
      .matches(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/,
        'A senha deve conter ao menos uma letra maiúscula, uma letra minúscula, um númeral, um caractere especial e um total de 8 caracteres',
      ),
    confirmar_senha: yup
      .string()
      .required(requiredMessage)
      .equals([yup.ref('nova_senha')], 'As senhas não conferem'),
  })
  .required();

export default function AlteraSenha({navigation}: any) {
  const theme = useTheme();
  const [exibirSenha, setExibirSenha] = useState(true);
  const [requisitando, setRequisitando] = useState(false);
  const [dialogVisivel, setDialogVisivel] = useState(false);
  const {userAuth, signIn, alterarSenha} = useContext<any>(AuthContext);
  const [mensagem, setMensagem] = useState({tipo: '', mensagem: ''});
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<any>({
    defaultValues: {
      senha_atual: '',
      nova_senha: '',
      confirmar_senha: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: {
    senha_atual: string;
    nova_senha: string;
    confirmar_senha: string;
  }) {
    setRequisitando(true);
    //O serviço Auth do Firebase exige um login recente para alterar a senha
    const msg = await signIn({email: userAuth.email, senha: data.senha_atual});
    if (msg !== 'ok') {
      setRequisitando(false);
      setMensagem({
        tipo: 'erro',
        mensagem: msg,
      });
      setDialogVisivel(true);
      return;
    }
    //se relogou, alterar a senha
    if (data.nova_senha === data.confirmar_senha) {
      const msge = await alterarSenha(data.nova_senha);
      if (msge === 'ok') {
        setRequisitando(false);
        setMensagem({tipo: 'ok', mensagem: 'Senha alterada com sucesso.'});
        setDialogVisivel(true);
      } else {
        setRequisitando(false);
        setMensagem({tipo: 'erro', mensagem: msge});
        setDialogVisivel(true);
      }
    } else {
      setRequisitando(false);
      setDialogVisivel(true);
      setMensagem({
        tipo: 'erro',
        mensagem: 'A nova senha e a confirmação não conferem.',
      });
    }
  }

  return (
    <View
      style={{...styles.container, backgroundColor: theme.colors.background}}>
      <Text variant="headlineMedium">Alterar Senha</Text>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.textinput}
            label="Senha  Atual"
            placeholder="Digite sua senha atual"
            mode="outlined"
            autoCapitalize="none"
            returnKeyType="next"
            secureTextEntry={exibirSenha}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            right={
              <TextInput.Icon
                icon="eye"
                color={
                  exibirSenha ? theme.colors.onBackground : theme.colors.error
                }
                onPress={() => setExibirSenha(previus => !previus)}
              />
            }
          />
        )}
        name="senha_atual"
      />
      {errors.senha_atual && (
        <Text style={{...styles.textError, color: theme.colors.error}}>
          {errors.senha_atual?.message?.toString()}
        </Text>
      )}
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.textinput}
            label="Nova Senha"
            placeholder="Digite sua nova senha"
            mode="outlined"
            autoCapitalize="none"
            returnKeyType="next"
            secureTextEntry={exibirSenha}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            right={
              <TextInput.Icon
                icon="eye"
                color={
                  exibirSenha ? theme.colors.onBackground : theme.colors.error
                }
                onPress={() => setExibirSenha(previus => !previus)}
              />
            }
          />
        )}
        name="nova_senha"
      />
      {errors.nova_senha && (
        <Text style={{...styles.textError, color: theme.colors.error}}>
          {errors.nova_senha?.message?.toString()}
        </Text>
      )}
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.textinput}
            label="Confirmar senha"
            placeholder="Confirme sua senha"
            mode="outlined"
            autoCapitalize="none"
            returnKeyType="go"
            secureTextEntry={exibirSenha}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            right={
              <TextInput.Icon
                icon="eye"
                color={
                  exibirSenha ? theme.colors.onBackground : theme.colors.error
                }
                onPress={() => setExibirSenha(previus => !previus)}
              />
            }
          />
        )}
        name="confirmar_senha"
      />
      {errors.confirmar_senha && (
        <Text style={{...styles.textError, color: theme.colors.error}}>
          {errors.confirmar_senha?.message?.toString()}
        </Text>
      )}
      <Button
        style={styles.button}
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={requisitando}
        disabled={requisitando}>
        {!requisitando ? 'Alterar' : 'Alterando'}
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
