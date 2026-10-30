import type { RespostaRota, RuaProps } from './city';

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
  onTrocarPontos?: () => void;
}

export interface EditorCustoViaProps {
  ruas: RuaProps[];
  onAlterarPeso: (origem: string, destino: string, peso: number) => void;
  onRestaurar: () => void;
}

export interface ResultadoRotaProps {
  resultado: RespostaRota | null;
  carregando?: boolean;
}

export interface PainelControleProps {
  origem: string;
  destino: string;
  carregando: boolean;
  resultado: RespostaRota | null;
  ruas: RuaProps[];
  onOrigemChange: (value: string) => void;
  onDestinoChange: (value: string) => void;
  onTrocarPontos: () => void;
  onCalcular: () => void;
  onAlterarPeso: (origem: string, destino: string, peso: number) => void;
  onRestaurar: () => void;
  className?: string;
}

export interface OverlayMapaProps {
  resultado: RespostaRota | null;
  carregando: boolean;
  onAbrirPainel: () => void;
}
