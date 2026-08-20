import {
  Usuario,
  Unidade,
  Viatura,
  Oficina,
  OrdemServico,
  ItemOrcamento,
  Aprovacao,
  DocumentoOS,
  HistoricoOS,
  Notificacao,
  GoogleDriveConfig,
  StatusOS,
  DecisaoAprovacao,
  TipoDocumento,
} from '../types';
import {
  SEED_UNIDADES,
  SEED_OFICINAS,
  SEED_VIATURAS,
  SEED_USUARIOS,
  SEED_ORDENS_SERVICO,
  SEED_ITENS_ORCAMENTO,
  SEED_DOCUMENTOS,
  SEED_HISTORICO,
  SEED_NOTIFICACOES,
  SEED_GOOGLE_DRIVE,
} from '../data/seedData';

const STORAGE_KEYS = {
  UNIDADES: 'gestao_os_2027_unidades',
  OFICINAS: 'gestao_os_2027_oficinas',
  VIATURAS: 'gestao_os_2027_viaturas',
  USUARIOS: 'gestao_os_2027_usuarios',
  ORDENS_SERVICO: 'gestao_os_2027_ordens_servico',
  ITENS_ORCAMENTO: 'gestao_os_2027_itens_orcamento',
  DOCUMENTOS: 'gestao_os_2027_documentos',
  HISTORICO: 'gestao_os_2027_historico',
  NOTIFICACOES: 'gestao_os_2027_notificacoes',
  GOOGLE_DRIVE: 'gestao_os_2027_google_drive',
  CURRENT_USER_ID: 'gestao_os_2027_current_user_id',
};

class StorageService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.UNIDADES)) {
      localStorage.setItem(STORAGE_KEYS.UNIDADES, JSON.stringify(SEED_UNIDADES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.OFICINAS)) {
      localStorage.setItem(STORAGE_KEYS.OFICINAS, JSON.stringify(SEED_OFICINAS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VIATURAS)) {
      localStorage.setItem(STORAGE_KEYS.VIATURAS, JSON.stringify(SEED_VIATURAS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USUARIOS)) {
      localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(SEED_USUARIOS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDENS_SERVICO)) {
      localStorage.setItem(STORAGE_KEYS.ORDENS_SERVICO, JSON.stringify(SEED_ORDENS_SERVICO));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ITENS_ORCAMENTO)) {
      localStorage.setItem(STORAGE_KEYS.ITENS_ORCAMENTO, JSON.stringify(SEED_ITENS_ORCAMENTO));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTOS)) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTOS, JSON.stringify(SEED_DOCUMENTOS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.HISTORICO)) {
      localStorage.setItem(STORAGE_KEYS.HISTORICO, JSON.stringify(SEED_HISTORICO));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICACOES)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICACOES, JSON.stringify(SEED_NOTIFICACOES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GOOGLE_DRIVE)) {
      localStorage.setItem(STORAGE_KEYS.GOOGLE_DRIVE, JSON.stringify(SEED_GOOGLE_DRIVE));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'usr-master');
    }
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  public resetToSeedData() {
    localStorage.setItem(STORAGE_KEYS.UNIDADES, JSON.stringify(SEED_UNIDADES));
    localStorage.setItem(STORAGE_KEYS.OFICINAS, JSON.stringify(SEED_OFICINAS));
    localStorage.setItem(STORAGE_KEYS.VIATURAS, JSON.stringify(SEED_VIATURAS));
    localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(SEED_USUARIOS));
    localStorage.setItem(STORAGE_KEYS.ORDENS_SERVICO, JSON.stringify(SEED_ORDENS_SERVICO));
    localStorage.setItem(STORAGE_KEYS.ITENS_ORCAMENTO, JSON.stringify(SEED_ITENS_ORCAMENTO));
    localStorage.setItem(STORAGE_KEYS.DOCUMENTOS, JSON.stringify(SEED_DOCUMENTOS));
    localStorage.setItem(STORAGE_KEYS.HISTORICO, JSON.stringify(SEED_HISTORICO));
    localStorage.setItem(STORAGE_KEYS.NOTIFICACOES, JSON.stringify(SEED_NOTIFICACOES));
    localStorage.setItem(STORAGE_KEYS.GOOGLE_DRIVE, JSON.stringify(SEED_GOOGLE_DRIVE));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'usr-master');
    this.notify();
  }

  // --- USUARIOS ---
  public getUsuarios(): Usuario[] {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.USUARIOS) || '[]');
      return Array.isArray(data) ? data : SEED_USUARIOS;
    } catch {
      return SEED_USUARIOS;
    }
  }

  public getUsuarioById(id: string): Usuario | undefined {
    return this.getUsuarios().find((u) => u.id === id);
  }

  public saveUsuario(usuario: Usuario) {
    const list = this.getUsuarios();
    const idx = list.findIndex((u) => u.id === usuario.id);
    if (idx >= 0) {
      list[idx] = { ...usuario, atualizadoEm: new Date().toISOString() };
    } else {
      list.push(usuario);
    }
    localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(list));
    this.notify();
  }

  public deleteUsuario(id: string) {
    const list = this.getUsuarios().filter((u) => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(list));
    this.notify();
  }

  public getCurrentUserId(): string {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'usr-master';
  }

  public setCurrentUserId(userId: string) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    this.notify();
  }

  // --- UNIDADES ---
  public getUnidades(): Unidade[] {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.UNIDADES) || '[]');
      return Array.isArray(data) ? data : SEED_UNIDADES;
    } catch {
      return SEED_UNIDADES;
    }
  }

  public getUnidadeById(id: string): Unidade | undefined {
    return this.getUnidades().find((u) => u.id === id);
  }

  public saveUnidade(unidade: Unidade) {
    const list = this.getUnidades();
    const idx = list.findIndex((u) => u.id === unidade.id);
    if (idx >= 0) {
      list[idx] = { ...unidade, atualizadoEm: new Date().toISOString() };
    } else {
      list.push(unidade);
    }
    localStorage.setItem(STORAGE_KEYS.UNIDADES, JSON.stringify(list));
    this.notify();
  }

  public deleteUnidade(id: string) {
    const list = this.getUnidades().filter((u) => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.UNIDADES, JSON.stringify(list));
    this.notify();
  }

  // --- OFICINAS ---
  public getOficinas(): Oficina[] {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFICINAS) || '[]');
      return Array.isArray(data) ? data : SEED_OFICINAS;
    } catch {
      return SEED_OFICINAS;
    }
  }

  public getOficinaById(id: string): Oficina | undefined {
    return this.getOficinas().find((o) => o.id === id);
  }

  public saveOficina(oficina: Oficina) {
    const list = this.getOficinas();
    const idx = list.findIndex((o) => o.id === oficina.id);
    if (idx >= 0) {
      list[idx] = { ...oficina, atualizadoEm: new Date().toISOString() };
    } else {
      list.push(oficina);
    }
    localStorage.setItem(STORAGE_KEYS.OFICINAS, JSON.stringify(list));
    this.notify();
  }

  public deleteOficina(id: string) {
    const list = this.getOficinas().filter((o) => o.id !== id);
    localStorage.setItem(STORAGE_KEYS.OFICINAS, JSON.stringify(list));
    this.notify();
  }

  // --- VIATURAS ---
  public getViaturas(): Viatura[] {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.VIATURAS) || '[]');
      return Array.isArray(data) ? data : SEED_VIATURAS;
    } catch {
      return SEED_VIATURAS;
    }
  }

  public getViaturaById(id: string): Viatura | undefined {
    return this.getViaturas().find((v) => v.id === id);
  }

  public saveViatura(viatura: Viatura) {
    const list = this.getViaturas();
    const idx = list.findIndex((v) => v.id === viatura.id);
    if (idx >= 0) {
      list[idx] = { ...viatura, atualizadoEm: new Date().toISOString() };
    } else {
      list.push(viatura);
    }
    localStorage.setItem(STORAGE_KEYS.VIATURAS, JSON.stringify(list));
    this.notify();
  }

  public deleteViatura(id: string) {
    const list = this.getViaturas().filter((v) => v.id !== id);
    localStorage.setItem(STORAGE_KEYS.VIATURAS, JSON.stringify(list));
    this.notify();
  }

  // --- ORDENS DE SERVIÇO ---
  public getOrdensServico(): OrdemServico[] {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDENS_SERVICO) || '[]');
      return Array.isArray(data) ? data : SEED_ORDENS_SERVICO;
    } catch {
      return SEED_ORDENS_SERVICO;
    }
  }

  public getOrdemServicoById(id: string): OrdemServico | undefined {
    return this.getOrdensServico().find((os) => os.id === id);
  }

  public generateNextNumeroOS(): string {
    const list = this.getOrdensServico();
    let maxNum = 0;
    const regex = /OS-2027-(\d+)/;
    list.forEach((os) => {
      const match = os.numeroOS.match(regex);
      if (match && match[1]) {
        const n = parseInt(match[1], 10);
        if (!isNaN(n) && n > maxNum) {
          maxNum = n;
        }
      }
    });
    const nextNum = maxNum + 1;
    return `OS-2027-${String(nextNum).padStart(6, '0')}`;
  }

  public createOrdemServico(
    data: Omit<OrdemServico, 'id' | 'numeroOS' | 'criadoEm' | 'atualizadoEm'>,
    author: Usuario
  ): OrdemServico {
    const numeroOS = this.generateNextNumeroOS();
    const id = `os-${Date.now()}`;
    const now = new Date().toISOString();

    const newOS: OrdemServico = {
      ...data,
      id,
      numeroOS,
      criadaPor: author.nome,
      criadoEm: now,
      atualizadoEm: now,
    };

    const list = this.getOrdensServico();
    list.unshift(newOS);
    localStorage.setItem(STORAGE_KEYS.ORDENS_SERVICO, JSON.stringify(list));

    // Update vehicle status
    if (newOS.viaturaId) {
      const viatura = this.getViaturaById(newOS.viaturaId);
      if (viatura) {
        this.saveViatura({ ...viatura, status: 'EM_MANUTENCAO' });
      }
    }

    // Add History Event
    this.addHistorico({
      id: `hist-${Date.now()}`,
      osId: id,
      usuarioId: author.id,
      usuarioNome: author.nome,
      perfilUsuario: author.perfil,
      evento: 'Abertura da Ordem de Serviço',
      novoStatus: newOS.status,
      observacao: newOS.descricaoProblema,
      dataHora: now,
    });

    // Notify Master
    this.addNotificacao({
      id: `notif-${Date.now()}`,
      destinatarioPerfil: 'MASTER',
      osId: id,
      numeroOS: newOS.numeroOS,
      titulo: `Nova OS Criada: ${newOS.numeroOS}`,
      mensagem: `${author.nome} abriu uma nova OS para a viatura ${newOS.prefixo} (${newOS.nomeViatura}).`,
      tipo: 'INFO',
      lida: false,
      dataHora: now,
    });

    if (newOS.oficinaId) {
      this.addNotificacao({
        id: `notif-${Date.now() + 1}`,
        destinatarioPerfil: 'OFICINA',
        oficinaId: newOS.oficinaId,
        osId: id,
        numeroOS: newOS.numeroOS,
        titulo: `Nova OS Atribuída: ${newOS.numeroOS}`,
        mensagem: `A OS ${newOS.numeroOS} (${newOS.prefixo}) foi direcionada para diagnóstico da sua oficina.`,
        tipo: 'AVISO',
        lida: false,
        dataHora: now,
      });
    }

    this.notify();
    return newOS;
  }

  public updateOrdemServico(os: OrdemServico) {
    const list = this.getOrdensServico();
    const idx = list.findIndex((item) => item.id === os.id);
    if (idx >= 0) {
      list[idx] = { ...os, atualizadoEm: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.ORDENS_SERVICO, JSON.stringify(list));
      this.notify();
    }
  }

  public changeOSStatus(
    osId: string,
    novoStatus: StatusOS,
    usuario: Usuario,
    observacao?: string,
    extraFields?: Partial<OrdemServico>
  ) {
    const os = this.getOrdemServicoById(osId);
    if (!os) return;

    const statusAnterior = os.status;
    const now = new Date().toISOString();

    const updatedOS: OrdemServico = {
      ...os,
      ...extraFields,
      status: novoStatus,
      atualizadoEm: now,
    };

    // Stage timestamp mappings
    if (novoStatus === 'ENVIADA_A_OFICINA' && !updatedOS.dataEnvioOficina) {
      updatedOS.dataEnvioOficina = now;
    }
    if (novoStatus === 'AGUARDANDO_APROVACAO' && !updatedOS.dataRespostaOficina) {
      updatedOS.dataRespostaOficina = now;
    }
    if (novoStatus === 'APROVADA' && !updatedOS.dataAprovacao) {
      updatedOS.dataAprovacao = now;
      updatedOS.responsavelId = usuario.id;
    }
    if (novoStatus === 'EM_EXECUCAO' && !updatedOS.dataInicio) {
      updatedOS.dataInicio = now;
    }
    if (novoStatus === 'SERVICO_CONCLUIDO' && !updatedOS.dataConclusao) {
      updatedOS.dataConclusao = now;
    }
    if (novoStatus === 'AGUARDANDO_CONFERENCIA') {
      // NF uploaded
    }
    if (novoStatus === 'FINALIZADA') {
      updatedOS.dataFinalizacao = now;
      if (!updatedOS.dataConferencia) updatedOS.dataConferencia = now;
      // Set vehicle back to DISPONIVEL
      if (updatedOS.viaturaId) {
        const viatura = this.getViaturaById(updatedOS.viaturaId);
        if (viatura) {
          this.saveViatura({ ...viatura, status: 'DISPONIVEL' });
        }
      }
    }
    if (novoStatus === 'CANCELADA') {
      updatedOS.dataCancelamento = now;
      if (observacao) updatedOS.motivoCancelamento = observacao;
      // Return vehicle to DISPONIVEL or check
      if (updatedOS.viaturaId) {
        const viatura = this.getViaturaById(updatedOS.viaturaId);
        if (viatura) {
          this.saveViatura({ ...viatura, status: 'DISPONIVEL' });
        }
      }
    }

    this.updateOrdemServico(updatedOS);

    // Add History
    let eventoNome = `Mudança de status para ${novoStatus.replace(/_/g, ' ')}`;
    if (novoStatus === 'ENVIADA_A_OFICINA') eventoNome = 'Encaminhamento à Oficina';
    if (novoStatus === 'AGUARDANDO_APROVACAO') eventoNome = 'Orçamento Submetido pela Oficina';
    if (novoStatus === 'APROVADA') eventoNome = 'Orçamento Aprovado pelo Master';
    if (novoStatus === 'DEVOLVIDA_PARA_CORRECAO') eventoNome = 'Orçamento Devolvido para Correção';
    if (novoStatus === 'EM_EXECUCAO') eventoNome = 'Início dos Serviços na Oficina';
    if (novoStatus === 'SERVICO_CONCLUIDO') eventoNome = 'Conclusão dos Serviços Mecânicos';
    if (novoStatus === 'AGUARDANDO_DOCUMENTOS') eventoNome = 'Aguardando Emissão de Documentos/NF';
    if (novoStatus === 'AGUARDANDO_CONFERENCIA') eventoNome = 'Nota Fiscal Anexada para Conferência';
    if (novoStatus === 'FINALIZADA') eventoNome = 'Ordem de Serviço Finalizada';
    if (novoStatus === 'CANCELADA') eventoNome = 'Ordem de Serviço Cancelada';

    this.addHistorico({
      id: `hist-${Date.now()}`,
      osId: os.id,
      usuarioId: usuario.id,
      usuarioNome: usuario.nome,
      perfilUsuario: usuario.perfil,
      evento: eventoNome,
      statusAnterior,
      novoStatus,
      observacao: observacao || '',
      dataHora: now,
    });

    // Notify appropriate parties
    this.triggerStatusNotifications(updatedOS, statusAnterior, novoStatus, usuario, observacao);
  }

  private triggerStatusNotifications(
    os: OrdemServico,
    statusAnterior: StatusOS,
    novoStatus: StatusOS,
    usuario: Usuario,
    observacao?: string
  ) {
    const now = new Date().toISOString();

    if (novoStatus === 'AGUARDANDO_APROVACAO') {
      this.addNotificacao({
        id: `notif-${Date.now()}`,
        destinatarioPerfil: 'MASTER',
        osId: os.id,
        numeroOS: os.numeroOS,
        titulo: `Orçamento Recebido: ${os.numeroOS}`,
        mensagem: `A oficina enviou o orçamento para a OS ${os.numeroOS} (${os.prefixo}) no valor total de R$ ${(os.valorFinal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`,
        tipo: 'ALERTA',
        lida: false,
        dataHora: now,
      });
    } else if (novoStatus === 'APROVADA') {
      if (os.oficinaId) {
        this.addNotificacao({
          id: `notif-${Date.now()}`,
          destinatarioPerfil: 'OFICINA',
          oficinaId: os.oficinaId,
          osId: os.id,
          numeroOS: os.numeroOS,
          titulo: `Orçamento Aprovado: ${os.numeroOS}`,
          mensagem: `O orçamento da OS ${os.numeroOS} (${os.prefixo}) foi aprovado no valor de R$ ${(os.valorAprovado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. Pode iniciar a execução.`,
          tipo: 'SUCESSO',
          lida: false,
          dataHora: now,
        });
      }
      this.addNotificacao({
        id: `notif-${Date.now() + 1}`,
        destinatarioPerfil: 'UNIDADE',
        unidadeId: os.unidadeId,
        osId: os.id,
        numeroOS: os.numeroOS,
        titulo: `OS Aprovada para Execução: ${os.numeroOS}`,
        mensagem: `A manutenção da viatura ${os.prefixo} foi autorizada e está em processo de reparo.`,
        tipo: 'INFO',
        lida: false,
        dataHora: now,
      });
    } else if (novoStatus === 'DEVOLVIDA_PARA_CORRECAO') {
      if (os.oficinaId) {
        this.addNotificacao({
          id: `notif-${Date.now()}`,
          destinatarioPerfil: 'OFICINA',
          oficinaId: os.oficinaId,
          osId: os.id,
          numeroOS: os.numeroOS,
          titulo: `Orçamento Devolvido: ${os.numeroOS}`,
          mensagem: `A OS ${os.numeroOS} foi devolvida para correção: ${observacao || 'Verifique as observações no detalhe da OS'}.`,
          tipo: 'ALERTA',
          lida: false,
          dataHora: now,
        });
      }
    } else if (novoStatus === 'SERVICO_CONCLUIDO') {
      this.addNotificacao({
        id: `notif-${Date.now()}`,
        destinatarioPerfil: 'MASTER',
        osId: os.id,
        numeroOS: os.numeroOS,
        titulo: `Serviço Concluído: ${os.numeroOS}`,
        mensagem: `A oficina finalizou o serviço da OS ${os.numeroOS} (${os.prefixo}). Aguardando NF e laudos.`,
        tipo: 'INFO',
        lida: false,
        dataHora: now,
      });
    } else if (novoStatus === 'AGUARDANDO_CONFERENCIA') {
      this.addNotificacao({
        id: `notif-${Date.now()}`,
        destinatarioPerfil: 'MASTER',
        osId: os.id,
        numeroOS: os.numeroOS,
        titulo: `Nota Fiscal Enviada: ${os.numeroOS}`,
        mensagem: `A oficina anexou a NF-e da OS ${os.numeroOS} (${os.prefixo}) para conferência documental.`,
        tipo: 'AVISO',
        lida: false,
        dataHora: now,
      });
    } else if (novoStatus === 'FINALIZADA') {
      this.addNotificacao({
        id: `notif-${Date.now()}`,
        destinatarioPerfil: 'UNIDADE',
        unidadeId: os.unidadeId,
        osId: os.id,
        numeroOS: os.numeroOS,
        titulo: `Viatura Liberada / OS Finalizada: ${os.numeroOS}`,
        mensagem: `A viatura ${os.prefixo} (${os.nomeViatura}) teve sua OS ${os.numeroOS} finalizada e está 100% pronta e disponível para serviço operacional.`,
        tipo: 'SUCESSO',
        lida: false,
        dataHora: now,
      });
      if (os.oficinaId) {
        this.addNotificacao({
          id: `notif-${Date.now() + 1}`,
          destinatarioPerfil: 'OFICINA',
          oficinaId: os.oficinaId,
          osId: os.id,
          numeroOS: os.numeroOS,
          titulo: `OS Finalizada com Sucesso: ${os.numeroOS}`,
          mensagem: `A OS ${os.numeroOS} foi finalizada administrativamente com NF conferida e liberada para faturamento.`,
          tipo: 'SUCESSO',
          lida: false,
          dataHora: now,
        });
      }
    }
  }

  // --- ITENS DE ORÇAMENTO ---
  public getItensOrcamento(osId?: string): ItemOrcamento[] {
    try {
      const all: ItemOrcamento[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITENS_ORCAMENTO) || '[]');
      if (osId) {
        return all.filter((item) => item.osId === osId);
      }
      return all;
    } catch {
      return [];
    }
  }

  public saveItemOrcamento(item: ItemOrcamento) {
    const list = this.getItensOrcamento();
    const idx = list.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      list[idx] = { ...item, atualizadoEm: new Date().toISOString() };
    } else {
      list.push(item);
    }
    localStorage.setItem(STORAGE_KEYS.ITENS_ORCAMENTO, JSON.stringify(list));
    this.recalculateOSTotals(item.osId);
    this.notify();
  }

  public deleteItemOrcamento(itemId: string, osId: string) {
    const list = this.getItensOrcamento();
    const filtered = list.filter((i) => i.id !== itemId);
    localStorage.setItem(STORAGE_KEYS.ITENS_ORCAMENTO, JSON.stringify(filtered));
    this.recalculateOSTotals(osId);
    this.notify();
  }

  public saveAllItensOrcamento(osId: string, itens: ItemOrcamento[]) {
    const list = this.getItensOrcamento().filter((i) => i.osId !== osId);
    list.push(...itens);
    localStorage.setItem(STORAGE_KEYS.ITENS_ORCAMENTO, JSON.stringify(list));
    this.recalculateOSTotals(osId);
    this.notify();
  }

  private recalculateOSTotals(osId: string) {
    const itens = this.getItensOrcamento(osId);
    const total = itens.reduce((acc, curr) => acc + (curr.valorTotal || curr.quantidade * curr.valorUnitario), 0);
    const os = this.getOrdemServicoById(osId);
    if (os) {
      this.updateOrdemServico({
        ...os,
        valorFinal: total,
      });
    }
  }

  // --- DOCUMENTOS ---
  public getDocumentos(osId?: string): DocumentoOS[] {
    try {
      const all: DocumentoOS[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCUMENTOS) || '[]');
      if (osId) {
        return all.filter((d) => d.osId === osId);
      }
      return all;
    } catch {
      return [];
    }
  }

  public getDocumentoById(id: string): DocumentoOS | undefined {
    return this.getDocumentos().find((d) => d.id === id);
  }

  public saveDocumento(doc: DocumentoOS) {
    const list = this.getDocumentos();
    const idx = list.findIndex((d) => d.id === doc.id);
    if (idx >= 0) {
      list[idx] = { ...doc, atualizadoEm: new Date().toISOString() };
    } else {
      list.push(doc);
    }
    localStorage.setItem(STORAGE_KEYS.DOCUMENTOS, JSON.stringify(list));
    this.notify();
  }

  public deleteDocumento(id: string) {
    const list = this.getDocumentos();
    const filtered = list.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DOCUMENTOS, JSON.stringify(filtered));
    this.notify();
  }

  // --- CONFERENCIA DE NOTA FISCAL ---
  public conferirNotaFiscal(
    docId: string,
    usuario: Usuario
  ): { success: boolean; message: string } {
    const doc = this.getDocumentoById(docId);
    if (!doc) return { success: false, message: 'Documento não encontrado.' };

    const os = this.getOrdemServicoById(doc.osId);
    if (!os) return { success: false, message: 'Ordem de serviço associada não encontrada.' };

    const now = new Date().toISOString();

    // Mark document as CONFERIDO
    const updatedDoc: DocumentoOS = {
      ...doc,
      statusDocumento: 'CONFERIDO',
      conferidoPor: usuario.id,
      conferidoPorNome: usuario.nome,
      dataConferencia: now,
      driveSyncStatus: 'SINCRONIZADO',
      driveFileId: `drv-${Date.now()}`,
      driveWebViewLink: `https://drive.google.com/file/d/gestao2027-${doc.numeroDocumento || 'nf'}/view`,
      atualizadoEm: now,
    };
    this.saveDocumento(updatedDoc);

    // Log Drive synchronization
    this.logDriveSync({
      id: `log-${Date.now()}`,
      dataHora: now,
      numeroOS: os.numeroOS,
      tipoDoc: 'NOTA_FISCAL',
      caminhoDrive: `Credenciamento 2027 > Documentos OS > ${os.unidadeId} > ${os.oficinaId || 'Oficina'} > ${os.numeroOS} > Nota Fiscal`,
      status: 'SUCESSO',
      mensagem: `NF-e ${doc.numeroDocumento || ''} (R$ ${(doc.valor || 0).toLocaleString('pt-BR')}) conferida por ${usuario.nome} e sincronizada no Google Drive.`,
      driveLink: updatedDoc.driveWebViewLink,
    });

    // Add History in OS
    this.addHistorico({
      id: `hist-${Date.now()}`,
      osId: os.id,
      usuarioId: usuario.id,
      usuarioNome: usuario.nome,
      perfilUsuario: usuario.perfil,
      evento: 'Conferência de Nota Fiscal Aprovada',
      observacao: `Nota Fiscal nº ${doc.numeroDocumento || 'S/N'} no valor de R$ ${(doc.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} validada e conferida com sucesso.`,
      dataHora: now,
    });

    // Notify Workshop & Unit
    if (os.oficinaId) {
      this.addNotificacao({
        id: `notif-${Date.now()}`,
        destinatarioPerfil: 'OFICINA',
        oficinaId: os.oficinaId,
        osId: os.id,
        numeroOS: os.numeroOS,
        titulo: `NF Conferida e Aprovada: ${os.numeroOS}`,
        mensagem: `A NF-e ${doc.numeroDocumento || ''} foi conferida pelo Master e está aprovada.`,
        tipo: 'SUCESSO',
        lida: false,
        dataHora: now,
      });
    }

    this.notify();
    return { success: true, message: 'Nota Fiscal conferida com sucesso e copiada para o Google Drive!' };
  }

  public rejeitarNotaFiscal(
    docId: string,
    usuario: Usuario,
    motivoRejeicao: string
  ): { success: boolean; message: string } {
    const doc = this.getDocumentoById(docId);
    if (!doc) return { success: false, message: 'Documento não encontrado.' };

    const os = this.getOrdemServicoById(doc.osId);
    if (!os) return { success: false, message: 'Ordem de serviço associada não encontrada.' };

    const now = new Date().toISOString();

    // Mark document as REJEITADO
    const updatedDoc: DocumentoOS = {
      ...doc,
      statusDocumento: 'REJEITADO',
      conferidoPor: usuario.id,
      conferidoPorNome: usuario.nome,
      dataConferencia: now,
      motivoRejeicao,
      driveSyncStatus: 'ERRO',
      atualizadoEm: now,
    };
    this.saveDocumento(updatedDoc);

    // Update OS remarks
    this.updateOrdemServico({
      ...os,
      motivoRejeicaoNF: motivoRejeicao,
    });

    // Add History
    this.addHistorico({
      id: `hist-${Date.now()}`,
      osId: os.id,
      usuarioId: usuario.id,
      usuarioNome: usuario.nome,
      perfilUsuario: usuario.perfil,
      evento: 'Nota Fiscal Rejeitada na Conferência',
      observacao: `NF-e ${doc.numeroDocumento || ''} rejeitada. Motivo: ${motivoRejeicao}`,
      dataHora: now,
    });

    // Notify Workshop
    if (os.oficinaId) {
      this.addNotificacao({
        id: `notif-${Date.now()}`,
        destinatarioPerfil: 'OFICINA',
        oficinaId: os.oficinaId,
        osId: os.id,
        numeroOS: os.numeroOS,
        titulo: `PENDÊNCIA: NF Rejeitada na OS ${os.numeroOS}`,
        mensagem: `A NF-e ${doc.numeroDocumento || ''} foi rejeitada na conferência: ${motivoRejeicao}. Favor emitir carta de correção ou refazer o envio.`,
        tipo: 'ALERTA',
        lida: false,
        dataHora: now,
      });
    }

    this.notify();
    return { success: true, message: 'Nota fiscal rejeitada com registro da pendência para a oficina.' };
  }

  // --- HISTORICO ---
  public getHistorico(osId?: string): HistoricoOS[] {
    try {
      const all: HistoricoOS[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORICO) || '[]');
      if (osId) {
        return all
          .filter((h) => h.osId === osId)
          .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());
      }
      return all.sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());
    } catch {
      return [];
    }
  }

  public addHistorico(hist: HistoricoOS) {
    const list = this.getHistorico();
    list.unshift(hist);
    localStorage.setItem(STORAGE_KEYS.HISTORICO, JSON.stringify(list));
    this.notify();
  }

  // --- NOTIFICACOES ---
  public getNotificacoes(): Notificacao[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICACOES) || '[]').sort(
        (a: Notificacao, b: Notificacao) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
      );
    } catch {
      return [];
    }
  }

  public addNotificacao(notif: Notificacao) {
    const list = this.getNotificacoes();
    list.unshift(notif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICACOES, JSON.stringify(list));
    this.notify();
  }

  public markNotificacaoAsRead(id: string) {
    const list = this.getNotificacoes();
    const idx = list.findIndex((n) => n.id === id);
    if (idx >= 0) {
      list[idx].lida = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICACOES, JSON.stringify(list));
      this.notify();
    }
  }

  public markAllNotificacoesAsRead(perfil: string, targetId?: string) {
    const list = this.getNotificacoes().map((n) => {
      if (
        n.destinatarioPerfil === 'TODOS' ||
        n.destinatarioPerfil === perfil ||
        (n.unidadeId && n.unidadeId === targetId) ||
        (n.oficinaId && n.oficinaId === targetId)
      ) {
        return { ...n, lida: true };
      }
      return n;
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICACOES, JSON.stringify(list));
    this.notify();
  }

  // --- GOOGLE DRIVE CONFIG ---
  public getGoogleDriveConfig(): GoogleDriveConfig {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.GOOGLE_DRIVE) || JSON.stringify(SEED_GOOGLE_DRIVE));
    } catch {
      return SEED_GOOGLE_DRIVE;
    }
  }

  public updateGoogleDriveConfig(config: GoogleDriveConfig) {
    localStorage.setItem(STORAGE_KEYS.GOOGLE_DRIVE, JSON.stringify(config));
    this.notify();
  }

  public logDriveSync(log: {
    id: string;
    dataHora: string;
    numeroOS: string;
    tipoDoc: string;
    caminhoDrive: string;
    status: 'SUCESSO' | 'FALHA';
    mensagem: string;
    driveLink?: string;
  }) {
    const config = this.getGoogleDriveConfig();
    config.logSincronizacoes.unshift(log);
    config.ultimaSincronizacao = log.dataHora;
    this.updateGoogleDriveConfig(config);
  }
}

export const storageService = new StorageService();
