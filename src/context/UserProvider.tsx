import ImageResizer from '@bam.tech/react-native-image-resizer';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {Perfil} from '../model/Perfil';
import {Usuario} from '../model/Usuario';
import {AuthContext} from './AuthProvider';

export const UserContext = createContext({});

export const UserProvider = ({children}: any) => {
  const {setUserAuth} = useContext<any>(AuthContext);
  const [alunos, setAlunos] = useState<Usuario[]>([]);
  const [professores, setProfessores] = useState<Usuario[]>([]);

  useEffect(() => {
    //listener para o perfil Aluno
    const listenerAlunos = firestore()
      .collection('usuarios')
      .where('perfil', '==', Perfil.Aluno)
      .orderBy('nome')
      .onSnapshot(snapShot => {
        //console.log(snapShot);
        //console.log(snapShot._docs);
        if (snapShot) {
          let data: Usuario[] = [];
          snapShot.forEach(doc => {
            data.push({
              uid: doc.id,
              email: doc.data().email,
              nome: doc.data().nome,
              urlFoto: doc.data().urlFoto,
              perfil: doc.data().perfil,
            });
          });
          setAlunos(data);
        }
      });

    //listener para o perfil Professor
    const listenerProfessores = firestore()
      .collection('usuarios')
      .where('perfil', '==', Perfil.Professor)
      .orderBy('nome')
      .onSnapshot(snapShot => {
        //console.log(snapShot);
        //console.log(snapShot._docs);
        if (snapShot) {
          let data: Usuario[] = [];
          snapShot.forEach(doc => {
            data.push({
              uid: doc.id,
              email: doc.data().email,
              nome: doc.data().nome,
              urlFoto: doc.data().urlFoto,
              perfil: doc.data().perfil,
            });
          });
          setProfessores(data);
        }
      });

    return () => {
      listenerAlunos();
      listenerProfessores();
    };
  }, []);

  async function update(usuario: Usuario, urlDevice: string): Promise<string> {
    try {
      if (urlDevice !== '') {
        usuario.urlFoto = await sendImageToStorage(usuario, urlDevice);
        if (!usuario.urlFoto) {
          return 'Erro ao atualizar o usuário. Contate o suporte.'; //não deixa salvar ou atualizar se não realizar todos os passos para enviar a imagem para o storage
        }
      }
      const usuarioFirestore = {
        email: usuario.email,
        nome: usuario.nome,
        perfil: usuario.perfil,
        urlFoto: usuario.urlFoto,
      };
      await firestore()
        .collection('usuarios')
        .doc(auth().currentUser?.uid)
        .set(usuarioFirestore, {merge: true});
      const usuarioAtualizado = await getUser();
      setUserAuth(usuarioAtualizado);
      return 'ok';
    } catch (e) {
      console.error(e);
      return 'Erro ao atualizar o usuário. Contate o suporte.';
    }
  }

  //urlDevice: qual imagem deve ser enviada via upload
  async function sendImageToStorage(
    _usuario: Usuario,
    urlDevice: string,
  ): Promise<string> {
    //1. Redimensiona e compacta a imagem
    let imageRedimencionada = await ImageResizer.createResizedImage(
      urlDevice,
      150,
      200,
      'PNG',
      80,
    );
    //2. e prepara o path onde ela deve ser salva no storage
    const pathToStorage = `imagens/usuarios/${
      auth().currentUser?.uid
    }/foto.png`;

    //3. Envia para o storage
    let url: string | null = ''; //local onde a imagem será salva no Storage
    const task = storage().ref(pathToStorage).putFile(imageRedimencionada?.uri);
    task.on('state_changed', _taskSnapshot => {
      //Para acompanhar o upload, se necessário
      // console.log(
      //   'Transf:\n' +
      //     `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      // );
    });

    //4. Busca a URL gerada pelo Storage
    await task.then(async () => {
      //se a task finalizar com sucesso, busca a url
      url = await storage().ref(pathToStorage).getDownloadURL();
    });
    //5. Pode dar zebra, então pega a exceção
    task.catch(e => {
      console.error('UserProvider, sendImageToStorage: ' + e);
      url = null;
    });
    return url;
  }

  async function del(uid: string): Promise<string> {
    try {
      await firestore().collection('usuarios').doc(uid).delete();
      await auth().currentUser?.delete();
      return 'ok';
    } catch (e) {
      console.error(e);
      return 'Erro ao excluir a conta. Contate o suporte.';
    }
  }

  //busca os detalhes do usuário
  async function getUser() {
    try {
      let doc = await firestore()
        .collection('usuarios')
        .doc(auth().currentUser?.uid)
        .get();
      if (doc.exists) {
        //console.log('Document data:', doc.data());
        const userData = doc.data();
        if (userData) {
          userData.uid = auth().currentUser?.uid;
          return userData;
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  return (
    <UserContext.Provider value={{update, del, getUser, alunos, professores}}>
      {children}
    </UserContext.Provider>
  );
};
