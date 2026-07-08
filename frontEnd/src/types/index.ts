export type Cargo = "ADMIN" | "MECANICO" | "ATENDENTE";

export type StatusOS =
  | "ABERTA"
  | "DIAGNOSTICO"
  | "AGUARDANDO_PECA"
  | "EM_EXECUCAO"
  | "PRONTA"
  | "ENTREGUE"
  | "CANCELADA";

export type FormaPagamento =
  | "DINHEIRO"
  | "CARTAO_CREDITO"
  | "CARTAO_DEBITO"
  | "PIX"
  | "FIADO";

export type TipoTransacao = "RECEITA" | "DESPESA";
export type TipoMovimentacao = "ENTRADA" | "SAIDA";
export type StatusAgendamento = "AGENDADO" | "CONFIRMADO" | "CANCELADO" | "CONCLUIDO";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: Cargo;
}

export interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
}

export interface Cliente {
  id: string;
  nome: string;
  cpfCnpj: string;
  telefone: string;
  email?: string;
  endereco: Endereco;
  createdAt: string;
  motos?: Moto[];
  ordens?: OrdemServico[];
}

export interface Moto {
  id: string;
  clienteId: string;
  cliente?: Cliente;
  marca: string;
  modelo: string;
  placa: string;
  ano: number;
  cor: string;
  cilindrada: number;
  createdAt: string;
}

export interface ItemServico {
  nome: string;
  preco: number;
  descricao?: string;
}

export interface ItemPeca {
  pecaId?: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

export interface OrdemServico {
  id: string;
  numero: number;
  clienteId: string;
  cliente: Cliente;
  motoId: string;
  moto: Moto;
  quilometragem: number;
  problema: string;
  diagnostico?: string;
  status: StatusOS;
  servicos: ItemServico[];
  pecas: ItemPeca[];
  total: number;
  formaPagamento?: FormaPagamento;
  valorPago: number;
  troco: number;
  dataEntrada: string;
  dataPrevisao?: string;
  dataSaida?: string;
  observacoes?: string;
}

export interface Peca {
  id: string;
  nome: string;
  codigo: string;
  categoria: string;
  quantidade: number;
  quantidadeMinima: number;
  precoCusto: number;
  precoVenda: number;
  fornecedor?: string;
  createdAt: string;
}

export interface Transacao {
  id: string;
  tipo: TipoTransacao;
  categoria: string;
  descricao: string;
  valor: number;
  formaPagamento?: FormaPagamento;
  ordemServicoId?: string;
  data: string;
}

export interface Agendamento {
  id: string;
  clienteId: string;
  cliente: Cliente;
  motoId?: string;
  moto?: Moto;
  dataHora: string;
  servico: string;
  status: StatusAgendamento;
  observacoes?: string;
}

export interface ResumoDashboard {
  ordensAbertas: number;
  ordensPorStatus: { status: StatusOS; _count: { _all: number } }[];
  pecasEstoqueBaixo: number;
  faturamentoMes: number;
  despesasMes: number;
  saldoMes: number;
  proximosAgendamentos: Agendamento[];
}
