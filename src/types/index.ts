export type PerfilUsuario = 'MASTER' | 'UNIDADE' | 'OFICINA';

export type StatusViatura = 'DISPONIVEL' | 'EM_MANUTENCAO' | 'BAIXADA' | 'RESERVA';

export type TipoViatura = 'LEVE' | 'PESADO' | 'UTILITARIO' | 'MOTOCICLETA' | 'BLINDADO' | 'AMBULANCIA';

export type SituacaoCredenciamento = 'ATIVO' | 'SUSPENSO' | 'EM_RENOVACAO' | 'INATIVO';

export type TipoManutencao =
  | 'PREVENTIVA'
  | 'CORRETIVA'
  | 'EMERGENCIAL'
  | 'REVISAO_PROGRAMADA'
  | 'REVISAO_PERIODICA'
  | 'FUNILARIA_PINTURA'
  | 'ELETRICA';

export type PrioridadeOS = 'BAIXA' | 'NORMAL' | 'ALTA' | 'URGENTE';

export type StatusOS =
  | 'ABERTA'
  | 'ENVIADA_A_OFICINA'
  | 'AGUARDANDO_ORCAMENTO'
  | 'AGUARDANDO_APROVACAO'
  | 'APROVADA'
  | 'DEVOLVIDA_PARA_CORRECAO'
  | 'EM_EXECUCAO'
  | 'SERVICO_CONCLUIDO'
  | 'AGUARDANDO_DOCUMENTOS'
  | 'AGUARDANDO_CONFERENCIA'
  | 'FINALIZADA'
  | 'CANCELADA';

export type TipoItemOrcamento = 'PECA' | 'SERVICO' | 'OUTRO';

export type DecisaoAprovacao = 'APROVADO' | 'DEVOLVIDO' | 'REJEITADO';

export type TipoDocumento =
  | 'ORCAMENTO'
  | 'NOTA_FISCAL'
  | 'RECIBO'
  | 'LAUDO'
  | 'LAUDO_TECNICO'
  | 'RELATORIO'
  | 'RELATORIO_CONFERENCIA'
  | 'FOTO'
  | 'FOTO_AVARIA'
  | 'FOTO_CONCLUSAO'
  | 'GARANTIA'
  | 'CERTIFICADO_GARANTIA'
  | 'OUTRO';

export type StatusDocumento = 'PENDENTE' | 'RECEBIDO' | 'CONFERIDO' | 'REJEITADO';

export type DriveSyncStatus = 'NAO_CONECTADO' | 'PENDENTE' | 'SINCRONIZADO' | 'ERRO';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  unidadeId?: string;
  oficinaId?: string;
  cargo?: string;
  telefone?: string;
  ativo: boolean;
  avatarUrl?: string;
  criadoEm: string;
  atualizadoEm?: string;
}

export interface Unidade {
  id: string;
  nome: string;
  sigla: string;
  cidade: string;
  estado?: string;
  contato?: string;
  responsavel?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm?: string;
}

export interface Viatura {
  id: string;
  prefixo: string;
  placa: string;
  nomeModelo?: string;
  modelo?: string;
  marca: string;
  ano: number;
  setor?: string;
  tipo?: TipoViatura;
  status: StatusViatura;
  unidadeId: string;
  odometroAtual?: number;
  quilometragem?: number;
  combustivel?: string;
  tipoCombustivel?: string;
  chassi?: string;
  renavam?: string;
  observacoes?: string;
  ativo?: boolean;
  criadoEm: string;
  atualizadoEm?: string;
}

export interface Oficina {
  id: string;
  nome: string;
  razaoSocial?: string;
  cnpj: string;
  contato?: string;
  responsavel?: string;
  telefone?: string;
  email?: string;
  especialidades: string[];
  situacaoCredenciamento?: SituacaoCredenciamento;
  dataCredenciamento?: string;
  validadeCredenciamento?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  capacidadeSimultanea?: number;
  avaliacao?: number;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm?: string;
}

export interface ItemOrcamento {
  id: string;
  osId: string;
  tipo?: TipoItemOrcamento;
  tipoItem?: TipoItemOrcamento;
  codigoItem?: string;
  codigoPeca?: string;
  descricao: string;
  quantidade: number;
  unidadeMedida: string;
  valorUnitario: number;
  valorTotal: number;
  aprovado: boolean;
  observacao?: string;
  criadoEm: string;
  atualizadoEm?: string;
}

export interface Aprovacao {
  id: string;
  osId: string;
  tipo: string;
  usuarioId: string;
  usuarioNome: string;
  decisao: DecisaoAprovacao;
  observacao: string;
  valorAprovado?: number;
  dataHora: string;
}

export interface DocumentoOS {
  id: string;
  osId: string;
  unidadeId?: string;
  oficinaId?: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento?: string;
  dataEmissao?: string;
  valor?: number;
  nomeArquivo: string;
  tamanhoBytes?: number;
  mimeType?: string;
  storagePath?: string;
  urlStorage?: string;
  downloadUrl?: string;
  previewBase64?: string;
  statusDocumento: StatusDocumento;
  conferidoPor?: string;
  conferidoPorNome?: string;
  dataConferencia?: string;
  motivoRejeicao?: string;
  driveFileId?: string;
  driveWebViewLink?: string;
  driveSyncStatus: DriveSyncStatus;
  criadoPor?: string;
  criadoEm: string;
  atualizadoEm?: string;
}

export interface HistoricoOS {
  id: string;
  osId: string;
  usuarioId: string;
  usuarioNome: string;
  perfilUsuario: PerfilUsuario;
  evento: string;
  statusAnterior?: StatusOS;
  novoStatus?: StatusOS;
  observacao?: string;
  dataHora: string;
}

export interface OrdemServico {
  id: string;
  numeroOS: string;
  unidadeId: string;
  viaturaId: string;
  prefixo: string;
  placa: string;
  nomeViatura: string;
  oficinaId?: string;
  tipoManutencao: TipoManutencao;
  descricaoProblema: string;
  prioridade: PrioridadeOS;
  status: StatusOS;
  quilometragemMomento?: number;
  valorEstimado?: number;
  valorAprovado?: number;
  valorFinal?: number;
  valorNotaFiscal?: number;
  numeroNotaFiscal?: string;
  dataAbertura?: string;
  dataEnvioOficina?: string;
  dataRespostaOficina?: string;
  dataAprovacao?: string;
  dataInicio?: string;
  dataConclusao?: string;
  dataConferencia?: string;
  dataFinalizacao?: string;
  dataCancelamento?: string;
  prazoEstimadoDias?: number;
  dataPrevisaoEntrega?: string;
  responsavelId?: string;
  observacoes?: string;
  motivoCancelamento?: string;
  motivoDevolucao?: string;
  motivoRejeicaoNF?: string;
  diagnosticoTecnico?: string;
  odometroNaAbertura?: number;
  criadaPor?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Notificacao {
  id: string;
  destinatarioPerfil: PerfilUsuario | 'TODOS';
  destinatarioId?: string;
  unidadeId?: string;
  oficinaId?: string;
  osId?: string;
  numeroOS?: string;
  titulo: string;
  mensagem: string;
  tipo: 'INFO' | 'AVISO' | 'SUCESSO' | 'ALERTA';
  lida: boolean;
  dataHora: string;
}

export interface GoogleDriveConfig {
  conectado: boolean;
  emailConta: string;
  pastaRaizNome: string;
  pastaRaizId: string;
  sincronizacaoAutomatica: boolean;
  ultimaSincronizacao?: string;
  logSincronizacoes: LogSincronizacaoDrive[];
}

export interface LogSincronizacaoDrive {
  id: string;
  dataHora: string;
  numeroOS: string;
  tipoDoc: string;
  caminhoDrive: string;
  status: 'SUCESSO' | 'FALHA';
  mensagem: string;
  driveLink?: string;
}
