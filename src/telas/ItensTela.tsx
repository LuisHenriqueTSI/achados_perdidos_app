import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore'; // Usando Firestore
import {Picker} from '@react-native-picker/picker';

const ItensTela = () => {
  const [itensPerdidos, setItensPerdidos] = useState<any[]>([]);
  const [itensEncontrados, setItensEncontrados] = useState<any[]>([]);
  const [categoria, setCategoria] = useState<string>('');
  const [tipo, setTipo] = useState<string>('');
  const [nome, setNome] = useState<string>('');
  const [categorias, setCategorias] = useState<string[]>([]);

  // Função para carregar as categorias
  const carregarCategorias = async (): Promise<void> => {
    try {
      // Pegue a lista de categorias do Firestore ou banco de dados
      const categoriasQuery = await firestore().collection('categorias').get();
      const categoriasList = categoriasQuery.docs.map(doc => doc.data().nome);
      setCategorias(categoriasList);
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível carregar as categorias.');
    }
  };

  // Função para carregar os itens (encontrados e perdidos)
  const carregarItens = useCallback(async () => {
    let query: FirebaseFirestoreTypes.Query = firestore().collection('itens');

    // Aplica o filtro de nome
    if (nome) {
      query = query
        .where('nome', '>=', nome)
        .where('nome', '<=', nome + '\uf8ff');
    }

    // Aplica o filtro de categoria
    if (categoria) {
      query = query.where('categoria', '==', categoria);
    }

    // Aplica o filtro de tipo (perdido ou encontrado)
    if (tipo) {
      query = query.where('tipo', '==', tipo);
    }

    // Executa a consulta
    const itensQuery = await query.get();
    const itensList = itensQuery.docs.map(doc => doc.data());

    // Divide os itens em perdidos e encontrados
    const itensPerdidosList = itensList.filter(item => item.tipo === 'perdido');
    const itensEncontradosList = itensList.filter(
      item => item.tipo === 'encontrado',
    );

    setItensPerdidos(itensPerdidosList);
    setItensEncontrados(itensEncontradosList);
  }, [nome, categoria, tipo]);

  // Carregar categorias e itens quando o componente for montado
  useEffect(() => {
    carregarCategorias();
    carregarItens(); // Carregar os itens logo após carregar as categorias
  }, [carregarItens]); // O array de dependências deve incluir carregarItens

  // Função de renderização dos itens
  const renderItem = ({item}: {item: any}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.nome}</Text>
      <Text style={styles.itemDescription}>{item.descricao}</Text>
      <Text style={styles.itemDate}>{item.data}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filtrar Itens</Text>

      {/* Filtros de pesquisa */}
      <TextInput
        style={styles.input}
        placeholder="Pesquisar por nome"
        value={nome}
        onChangeText={setNome}
      />

      <Picker
        selectedValue={categoria}
        onValueChange={setCategoria}
        style={styles.picker}>
        <Picker.Item label="Selecione a categoria" value="" />
        {categorias.map((cat, index) => (
          <Picker.Item key={index} label={cat} value={cat} />
        ))}
      </Picker>

      <Picker
        selectedValue={tipo}
        onValueChange={setTipo}
        style={styles.picker}>
        <Picker.Item label="Selecione o tipo" value="" />
        <Picker.Item label="Encontrado" value="encontrado" />
        <Picker.Item label="Perdido" value="perdido" />
      </Picker>

      <Button title="Filtrar" onPress={carregarItens} />

      {/* Exibindo os itens perdidos */}
      <Text style={styles.title}>Itens Perdidos</Text>
      {itensPerdidos.length > 0 ? (
        <FlatList
          data={itensPerdidos}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
        />
      ) : (
        <Text style={styles.noItems}>Nenhum item perdido encontrado.</Text>
      )}

      {/* Exibindo os itens encontrados */}
      <Text style={styles.title}>Itens Encontrados</Text>
      {itensEncontrados.length > 0 ? (
        <FlatList
          data={itensEncontrados}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.noItems}>Nenhum item encontrado.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5', // Fundo mais suave que o branco puro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
    color: '#333', // Cor mais escura para o título
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
    backgroundColor: '#fff', // Cor de fundo clara para os inputs
    color: '#333', // Cor de texto escura no input
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  itemContainer: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#e8e8e8', // Fundo claro para itens
    borderColor: '#ddd',
    borderWidth: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Cor de texto mais escura para o título do item
  },
  itemDescription: {
    fontSize: 14,
    color: '#666', // Cor de texto média para a descrição do item
  },
  itemDate: {
    fontSize: 12,
    color: '#999', // Cor mais suave para a data
  },
  noItems: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999', // Cor mais suave para "Nenhum item encontrado"
  },
});

export default ItensTela;
