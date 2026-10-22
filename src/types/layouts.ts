import type { RuaProps } from './city';

export interface HeaderProps {
  title: string;
  subtitle?: string;
}

export interface FormularioRotaProps {
  origem: string;
  destino: string;
  carregando: boolean;
  onOrigemChange: (value: string) => void;
  onDestinoChange: (value: string) => void;
  onCalcular: () => void;
}

export interface EditorCustoViaProps {
  ruas: RuaProps[];
  onAlterarPeso: (origem: string, destino: string, peso: number) => void;
  onRestaurar: () => void;
}
