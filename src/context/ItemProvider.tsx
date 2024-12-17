import React, {createContext, useContext, useState} from 'react';

// Defina o tipo do item (perdido ou encontrado)
type Item = {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'perdido' | 'encontrado';
};

// Criação do contexto para os itens
const ItemContext = createContext<{
  itens: Item[];
  adicionarItem: (item: Item) => void;
}>({
  itens: [],
  adicionarItem: () => {},
});

// Provedor de itens
export const ItemProvider = ({children}: any) => {
  const [itens, setItens] = useState<Item[]>([]);

  const adicionarItem = (item: Item) => {
    setItens(prevItens => [...prevItens, item]);
  };

  return (
    <ItemContext.Provider value={{itens, adicionarItem}}>
      {children}
    </ItemContext.Provider>
  );
};

// Hook para acessar o contexto
export const useItens = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItens deve ser usado dentro de um ItemProvider');
  }
  return context;
};
