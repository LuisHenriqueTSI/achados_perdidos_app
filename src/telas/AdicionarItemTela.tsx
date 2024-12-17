import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import {useItens} from '../context/ItemProvider';
import {useTheme} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore'; // Usando o firestore para salvar os dados
import storage from '@react-native-firebase/storage'; // Usando o Firebase Storage para imagens
import {launchImageLibrary} from 'react-native-image-picker'; // Para selecionar imagem

const AdicionarItemTela = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');
  const [data, setData] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState<'perdido' | 'encontrado'>('perdido');
  const [imagem, setImagem] = useState<any>(null); // Estado para a imagem
  const {adicionarItem} = useItens();
  const theme = useTheme();

  const handleAddItem = async () => {
    if (!nome || !descricao || !local || !data || !categoria) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    let imagemUrl = 'img/objeto/imagem_padrao.png'; // Imagem padrão

    if (imagem) {
      // Upload da imagem para o Firebase Storage
      const imageUri = imagem.uri;
      const fileName = `imagem_${Date.now()}.jpg`; // Gerar nome único para a imagem
      const reference = storage().ref(fileName);

      try {
        await reference.putFile(imageUri); // Envia a imagem
        imagemUrl = await reference.getDownloadURL(); // Recupera a URL da imagem
      } catch (error) {
        console.error('Erro ao fazer upload da imagem: ', error);
        Alert.alert('Erro', 'Erro ao fazer upload da imagem.');
      }
    }

    const novoItem = {
      id: Math.random().toString(),
      nome,
      descricao,
      local,
      data,
      categoria,
      tipo,
      imagem: imagemUrl, // URL da imagem
      dataCriacao: new Date().toISOString(),
    };

    // Salvar no Firestore
    try {
      await firestore()
        .collection('itens') // Usando o Firestore
        .add(novoItem); // Adicionando item na coleção 'itens'

      // Adicionar ao contexto local
      adicionarItem(novoItem);

      // Limpar os campos após a adição
      setNome('');
      setDescricao('');
      setLocal('');
      setData('');
      setCategoria('');
      setTipo('perdido');
      setImagem(null); // Limpar imagem

      Alert.alert('Sucesso', 'Item adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar item: ', error);
      Alert.alert('Erro', 'Erro ao adicionar item. Tente novamente!');
    }
  };

  const handleImagePicker = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        Alert.alert('Informação', 'Usuário cancelou a seleção da imagem');
      } else if (response.errorCode) {
        Alert.alert(
          'Erro',
          `Erro ao selecionar a imagem: ${response.errorMessage}`,
        );
      } else if (response.assets && response.assets.length > 0) {
        setImagem(response.assets[0]); // Salvar a imagem selecionada
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, {color: theme.colors.primary}]}>
        Cadastrar Item
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do item"
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
        placeholderTextColor="#999999"
      />

      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={4}
        placeholderTextColor="#999999"
      />

      <TextInput
        style={styles.input}
        placeholder="Local encontrado ou perdido"
        value={local}
        onChangeText={setLocal}
        placeholderTextColor="#999999"
      />

      <TextInput
        style={styles.input}
        placeholder="Data (AAAA-MM-DD)"
        value={data}
        onChangeText={setData}
        placeholderTextColor="#999999"
      />

      <TextInput
        style={styles.input}
        placeholder="Categoria"
        value={categoria}
        onChangeText={setCategoria}
        placeholderTextColor="#999999"
      />

      <View style={styles.statusContainer}>
        <Button
          title={`Status: Perdido`}
          onPress={() => setTipo('perdido')}
          color={
            tipo === 'perdido' ? theme.colors.primary : theme.colors.secondary
          }
        />
        <Button
          title={`Status: Encontrado`}
          onPress={() => setTipo('encontrado')}
          color={
            tipo === 'encontrado'
              ? theme.colors.primary
              : theme.colors.secondary
          }
        />
      </View>

      <Button
        title="Selecionar Imagem"
        onPress={handleImagePicker}
        color={theme.colors.primary}
      />
      {imagem && (
        <Text style={styles.imageName}>
          Imagem Selecionada: {imagem.fileName}
        </Text>
      )}

      <Button
        title="Adicionar Item"
        onPress={handleAddItem}
        color={theme.colors.primary}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imageName: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
});

export default AdicionarItemTela;
