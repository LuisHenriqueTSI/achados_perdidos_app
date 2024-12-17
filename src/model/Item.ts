export type Item = {
  id: string;
  nome: string;
  descricao: string;
  status: 'perdido' | 'encontrado'; // Status do item
  data: string; // Data de quando foi registrado
};
