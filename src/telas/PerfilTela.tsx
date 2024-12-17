import {yupResolver} from '@hookform/resolvers/yup';
import {CommonActions} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {Button, Dialog, Text, TextInput, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {AuthContext} from '../context/AuthProvider';
import {UserContext} from '../context/UserProvider';
import {Usuario} from '../model/Usuario';

const requiredMessage = 'Campo obrigatório';

const schema = yup
  .object()
  .shape({
    nome: yup
      .string()
      .required(requiredMessage)
      .min(2, 'O nome deve ter ao menos 2 caracteres'),
    email: yup
      .string()
      .required(requiredMessage)
      .matches(/\S+@\S+\.\S+/, 'Email inválido'),
    curso: yup.string().required(requiredMessage),
    perfil: yup.string().required(requiredMessage),
  })
  .required();

export default function PerfilTela({navigation}: any) {
  const {userAuth} = useContext<any>(AuthContext);
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    register,
    formState: {errors},
  } = useForm<any>({
    defaultValues: {
      nome: userAuth.nome,
      email: userAuth.email,
      perfil: userAuth.perfil,
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });
  const [requisitando, setRequisitando] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [dialogErroVisivel, setDialogErroVisivel] = useState(false);
  const [dialogExcluirVisivel, setDialogExcluirVisivel] = useState(false);
  const [mensagem, setMensagem] = useState({tipo: '', mensagem: ''});
  const {update, del} = useContext<any>(UserContext);
  const [urlDevice, setUrlDevice] = useState<string | undefined>('');

  useEffect(() => {
    register('nome');
    register('email');
    register('curso');
    register('perfil');
  }, [register]);

  async function atualizaPerfil(data: Usuario) {
    setRequisitando(true);
    setAtualizando(true);
    data.urlFoto =
      'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'; // imagem fake para dev
    const msg = await update(data, urlDevice);
    if (msg === 'ok') {
      setMensagem({
        tipo: 'ok',
        mensagem: 'Seu perfil foi atualizado com sucesso.',
      });
      setDialogErroVisivel(true);
      setRequisitando(false);
      setAtualizando(false);
    } else {
      setMensagem({tipo: 'erro', mensagem: msg});
      setDialogErroVisivel(true);
      setRequisitando(false);
      setAtualizando(false);
    }
  }

  function avisarDaExclusaoPermanenteDaConta() {
    setDialogExcluirVisivel(true);
  }

  async function excluirConta() {
    setDialogExcluirVisivel(false);
    setRequisitando(true);
    setExcluindo(true);
    const msg = await del(userAuth.uid);
    if (msg === 'ok') {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'AuthStack'}],
        }),
      );
    } else {
      setMensagem({tipo: 'erro', mensagem: 'Ops! Algo deu errado'});
      setDialogErroVisivel(true);
      setRequisitando(false);
      setExcluindo(false);
    }
  }

  const buscaNaGaleria = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, response => {
      if (response.errorCode) {
        setMensagem({tipo: 'erro', mensagem: 'Erro ao buscar a imagem.'});
      } else if (response.didCancel) {
        setMensagem({
          tipo: 'ok',
          mensagem: 'Você cancelou a seleção da imagem.',
        });
      } else {
        const path = response.assets?.[0].uri;
        setUrlDevice(path); // armazena a uri da imagem
      }
    });
  };

  function tiraFoto() {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    launchCamera(options, response => {
      if (response.errorCode) {
        setMensagem({tipo: 'erro', mensagem: 'Erro ao tirar a foto'});
      } else if (response.didCancel) {
        setMensagem({tipo: 'ok', mensagem: 'Você cancelou a captura.'});
      } else {
        const path = response.assets?.[0].uri;
        setUrlDevice(path); // armazena a uri da imagem
      }
    });
  }

  return (
    <SafeAreaView
      style={{...styles.container, backgroundColor: theme.colors.background}}>
      <ScrollView>
        <>
          <Image
            style={styles.image}
            source={
              urlDevice !== ''
                ? {uri: urlDevice}
                : userAuth.urlFoto !== ''
                ? {uri: userAuth.urlFoto}
                : require('../assets/images/person.png')
            }
            loadingIndicatorSource={require('../assets/images/person.png')}
          />
          <View style={styles.divButtonsImage}>
            <Button
              style={styles.buttonImage}
              mode="outlined"
              icon="image"
              onPress={() => buscaNaGaleria()}>
              Galeria
            </Button>
            <Button
              style={styles.buttonImage}
              mode="outlined"
              icon="camera"
              onPress={() => tiraFoto()}>
              Foto
            </Button>
          </View>

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
                right={<TextInput.Icon icon="smart-card" />}
              />
            )}
            name="nome"
          />
          {errors.nome && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.nome?.message?.toString()}
            </Text>
          )}

          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                disabled
                label="Email"
                placeholder="Digite seu email"
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

          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                disabled
                label="Curso ou Empresa"
                placeholder="Clique para selecionar outro curso"
                mode="outlined"
                autoCapitalize="none"
                returnKeyType="next"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="domain" />}
              />
            )}
            name="curso"
          />
          {errors.curso && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.curso?.message?.toString()}
            </Text>
          )}

          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                disabled
                label="Perfil"
                placeholder="Clique para selecionar outro perfil"
                mode="outlined"
                autoCapitalize="none"
                returnKeyType="go"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="account-eye" />}
              />
            )}
            name="perfil"
          />
          {errors.perfil && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.perfil?.message?.toString()}
            </Text>
          )}

          <Button
            style={styles.button}
            mode="contained"
            onPress={handleSubmit(atualizaPerfil)}
            loading={requisitando}
            disabled={requisitando}>
            {!atualizando ? 'Atualizar' : 'Atualizando'}
          </Button>
          <Button
            style={styles.buttonOthers}
            mode="outlined"
            onPress={handleSubmit(avisarDaExclusaoPermanenteDaConta)}
            loading={requisitando}
            disabled={requisitando}>
            {!excluindo ? 'Excluir' : 'Excluindo'}
          </Button>
        </>
      </ScrollView>

      <Dialog
        visible={dialogErroVisivel}
        onDismiss={() => setDialogErroVisivel(false)}>
        <Dialog.Title>
          {mensagem.tipo === 'erro' ? 'Erro' : 'Sucesso'}
        </Dialog.Title>
        <Dialog.Content>
          <Text>{mensagem.mensagem}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDialogErroVisivel(false)}>
            {mensagem.tipo === 'erro' ? 'Fechar' : 'Ok'}
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Dialog
        visible={dialogExcluirVisivel}
        onDismiss={() => setDialogExcluirVisivel(false)}>
        <Dialog.Title>Excluir conta</Dialog.Title>
        <Dialog.Content>
          <Text>
            Tem certeza de que deseja excluir sua conta? Essa ação não pode ser
            desfeita.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDialogExcluirVisivel(false)}>
            Cancelar
          </Button>
          <Button onPress={() => excluirConta()}>Confirmar</Button>
        </Dialog.Actions>
      </Dialog>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 20,
  },
  divButtonsImage: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonImage: {
    marginHorizontal: 5,
  },
  textinput: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonOthers: {
    marginTop: 10,
    marginBottom: 20,
  },
  textError: {
    fontSize: 12,
    color: '#D32F2F',
  },
});
