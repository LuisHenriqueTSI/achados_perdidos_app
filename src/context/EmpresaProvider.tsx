import ImageResizer from '@bam.tech/react-native-image-resizer';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import React, {createContext, useEffect, useState} from 'react';
import {Empresa} from '../model/Empresa';

export const EmpresaContext = createContext({});

export const EmpresaProvider = ({children}: any) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    const listener = firestore()
      .collection('empresas')
      .orderBy('nome')
      .onSnapshot(snapShot => {
        //console.log(snapShot);
        //console.log(snapShot._docs);
        if (snapShot) {
          let data: Empresa[] = [];
          snapShot.forEach(doc => {
            data.push({
              uid: doc.id,
              nome: doc.data().nome,
              tecnologias: doc.data().tecnologias,
              endereco: doc.data().endereco,
              latitude: doc.data().latitude,
              longitude: doc.data().longitude,
              urlFoto: doc.data().urlFoto,
            });
          });
          setEmpresas(data);
        }
      });

    return () => {
      listener();
    };
  }, []);

  const salvar = async (
    empresa: Empresa,
    urlDevice: string,
  ): Promise<string> => {
    // console.log('EmpresaProvider, salvar: ', empresa);
    try {
      if (empresa.uid === '') {
        empresa.uid = firestore().collection('empresas').doc().id;
      }
      if (urlDevice !== '') {
        empresa.urlFoto = await sendImageToStorage(empresa, urlDevice);
        if (!empresa.urlFoto) {
          return 'Não foi possíve salvar a imagem. Contate o suporte técnico.'; //não deixa salvar ou atualizar se não realizar todos os passpos para enviar a imagem para o storage
        }
      }
      await firestore().collection('empresas').doc(empresa.uid).set(
        {
          nome: empresa.nome,
          tecnologias: empresa.tecnologias,
          endereco: empresa.endereco,
          latitude: empresa.latitude,
          longitude: empresa.longitude,
          urlFoto: empresa.urlFoto,
        },
        {merge: true},
      );
      return 'ok';
    } catch (e) {
      console.error('EmpresaProvider, salvar: ' + e);
      return 'Não foi possíve salvar a imagem. Por favor, contate o suporte técnico.';
    }
  };

  const excluir = async (empresa: Empresa) => {
    try {
      // Verifique se o documento existe no Firestore
      const empresaRef = firestore().collection('empresas').doc(empresa.uid);
      const docSnap = await empresaRef.get();

      if (docSnap.exists) {
        // Se o documento existir, exclua-o
        await empresaRef.delete();
        // Documento excluído com sucesso.
        return 'ok';
      } else {
        console.error('Documento não encontrado.');
        return 'Empresa não encontrada para exclusão.';
      }
    } catch (e) {
      console.error('Erro ao excluir empresa:', e);
      return 'Erro ao excluir empresa. Por favor, tente novamente.';
    }
  };

  //urlDevice: qual imagem deve ser enviada via upload
  async function sendImageToStorage(
    empresa: Empresa,
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
    const pathToStorage = `imagens/empresas/${empresa?.uid}/foto.png`;

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
      console.error('EmpresaProvider, sendImageToStorage: ' + e);
      url = null;
    });
    return url;
  }

  return (
    <EmpresaContext.Provider value={{empresas, salvar, excluir}}>
      {children}
    </EmpresaContext.Provider>
  );
};
