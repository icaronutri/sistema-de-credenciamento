import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Unidade,
  Oficina,
  Viatura,
  OrdemServico,
  ItemOrcamento,
  DocumentoOS,
  HistoricoOS,
  Notificacao,
  GoogleDriveConfig,
  StatusOS,
  Usuario,
} from '../types';
import { storageService } from '../services/storage';
import { useAuth } from './AuthContext';

interface DataContextType {
  // Filtered by role
  ordensServico: OrdemServico[];
  viaturas: Viatura[];
  unidades: Unidade[];
  oficinas: Oficina[];
  notificacoes: Notificacao[];
  
  // All for references / dropdowns
  allUnidades: Unidade[];
  allOficinas: Oficina[];
  allViaturas: Viatura[];
  allUsuarios: Usuario[];
  allOrdensServico: OrdemServico[];
  googleDriveConfig: GoogleDriveConfig;

  // OS Actions
  createOS: (data: Omit<OrdemServico, 'id' | 'numeroOS' | 'criadoEm' | 'atualizadoEm'>) => OrdemServico;
  updateOS: (os: OrdemServico) => void;
  changeStatusOS: (osId: string, status: StatusOS, observacao?: string, extraFields?: Partial<OrdemServico>) => void;
  getOSById: (id: string) => OrdemServico | undefined;

  // Itens Orçamento
  getItensByOS: (osId: string) => ItemOrcamento[];
  saveItem: (item: ItemOrcamento) => void;
  deleteItem: (itemId: string, osId: string) => void;
  saveAllItens: (osId: string, itens: ItemOrcamento[]) => void;

  // Documentos & NF
  getDocumentosByOS: (osId: string) => DocumentoOS[];
  saveDoc: (doc: DocumentoOS) => void;
  deleteDoc: (id: string) => void;
  conferirNF: (docId: string) => { success: boolean; message: string };
  rejeitarNF: (docId: string, motivo: string) => { success: boolean; message: string };

  // Historico
  getHistoricoByOS: (osId: string) => HistoricoOS[];

  // Cadastros Management (Master)
  saveUnidade: (unidade: Unidade) => void;
  deleteUnidade: (id: string) => void;
  saveOficina: (oficina: Oficina) => void;
  deleteOficina: (id: string) => void;
  saveViatura: (viatura: Viatura) => void;
  deleteViatura: (id: string) => void;
  saveUsuario: (usuario: Usuario) => void;
  deleteUsuario: (id: string) => void;

  // Notificações
  unreadNotificacoesCount: number;
  markNotificacaoRead: (id: string) => void;
  markAllNotificacoesRead: () => void;

  // Google Drive
  updateDriveConfig: (config: GoogleDriveConfig) => void;
  syncDocToDrive: (docId: string) => Promise<{ success: boolean; message: string }>;

  // Reset demo
  resetDemoData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, perfil } = useAuth();

  const [rawUnidades, setRawUnidades] = useState<Unidade[]>(() => storageService.getUnidades() || []);
  const [rawOficinas, setRawOficinas] = useState<Oficina[]>(() => storageService.getOficinas() || []);
  const [rawViaturas, setRawViaturas] = useState<Viatura[]>(() => storageService.getViaturas() || []);
  const [rawUsuarios, setRawUsuarios] = useState<Usuario[]>(() => storageService.getUsuarios() || []);
  const [rawOS, setRawOS] = useState<OrdemServico[]>(() => storageService.getOrdensServico() || []);
  const [rawNotifs, setRawNotifs] = useState<Notificacao[]>(() => storageService.getNotificacoes() || []);
  const [driveConfig, setDriveConfig] = useState<GoogleDriveConfig>(() => storageService.getGoogleDriveConfig());

  const reloadData = () => {
    setRawUnidades(storageService.getUnidades() || []);
    setRawOficinas(storageService.getOficinas() || []);
    setRawViaturas(storageService.getViaturas() || []);
    setRawUsuarios(storageService.getUsuarios() || []);
    setRawOS(storageService.getOrdensServico() || []);
    setRawNotifs(storageService.getNotificacoes() || []);
    setDriveConfig(storageService.getGoogleDriveConfig());
  };

  useEffect(() => {
    const unsub = storageService.subscribe(() => {
      reloadData();
    });
    return unsub;
  }, []);

  // --- ROLE BASED ACCESS CONTROL FILTERS (Security Rule Enforcement) ---
  const ordensServico = useMemo(() => {
    const list = rawOS || [];
    if (perfil === 'MASTER') return list;
    if (perfil === 'UNIDADE' && currentUser?.unidadeId) {
      return list.filter((os) => os.unidadeId === currentUser.unidadeId);
    }
    if (perfil === 'OFICINA' && currentUser?.oficinaId) {
      return list.filter((os) => os.oficinaId === currentUser.oficinaId);
    }
    return list;
  }, [rawOS, perfil, currentUser]);

  const viaturas = useMemo(() => {
    const list = rawViaturas || [];
    if (perfil === 'MASTER') return list;
    if (perfil === 'UNIDADE' && currentUser?.unidadeId) {
      return list.filter((v) => v.unidadeId === currentUser.unidadeId);
    }
    if (perfil === 'OFICINA') {
      const assignedVtrIds = new Set((ordensServico || []).map((os) => os.viaturaId));
      return list.filter((v) => assignedVtrIds.has(v.id));
    }
    return list;
  }, [rawViaturas, perfil, currentUser, ordensServico]);

  const unidades = useMemo(() => {
    const list = rawUnidades || [];
    if (perfil === 'MASTER') return list;
    if (perfil === 'UNIDADE' && currentUser?.unidadeId) {
      return list.filter((u) => u.id === currentUser.unidadeId);
    }
    return list;
  }, [rawUnidades, perfil, currentUser]);

  const oficinas = useMemo(() => {
    const list = rawOficinas || [];
    if (perfil === 'MASTER' || perfil === 'UNIDADE') return list;
    if (perfil === 'OFICINA' && currentUser?.oficinaId) {
      return list.filter((o) => o.id === currentUser.oficinaId);
    }
    return list;
  }, [rawOficinas, perfil, currentUser]);

  const notificacoes = useMemo(() => {
    const list = rawNotifs || [];
    return list.filter((n) => {
      if (n.destinatarioPerfil === 'TODOS') return true;
      if (n.destinatarioPerfil === perfil) {
        if (perfil === 'MASTER') return true;
        if (perfil === 'UNIDADE' && n.unidadeId === currentUser?.unidadeId) return true;
        if (perfil === 'OFICINA' && n.oficinaId === currentUser?.oficinaId) return true;
      }
      return false;
    });
  }, [rawNotifs, perfil, currentUser]);

  const unreadNotificacoesCount = useMemo(() => {
    return (notificacoes || []).filter((n) => !n.lida).length;
  }, [notificacoes]);

  // Actions
  const createOS = (data: Omit<OrdemServico, 'id' | 'numeroOS' | 'criadoEm' | 'atualizadoEm'>) => {
    return storageService.createOrdemServico(data, currentUser);
  };

  const updateOS = (os: OrdemServico) => {
    storageService.updateOrdemServico(os);
  };

  const changeStatusOS = (
    osId: string,
    status: StatusOS,
    observacao?: string,
    extraFields?: Partial<OrdemServico>
  ) => {
    storageService.changeOSStatus(osId, status, currentUser, observacao, extraFields);
  };

  const getOSById = (id: string) => {
    return storageService.getOrdemServicoById(id);
  };

  const getItensByOS = (osId: string) => {
    return storageService.getItensOrcamento(osId);
  };

  const saveItem = (item: ItemOrcamento) => {
    storageService.saveItemOrcamento(item);
  };

  const deleteItem = (itemId: string, osId: string) => {
    storageService.deleteItemOrcamento(itemId, osId);
  };

  const saveAllItens = (osId: string, itens: ItemOrcamento[]) => {
    storageService.saveAllItensOrcamento(osId, itens);
  };

  const getDocumentosByOS = (osId: string) => {
    return storageService.getDocumentos(osId);
  };

  const saveDoc = (doc: DocumentoOS) => {
    storageService.saveDocumento(doc);
  };

  const deleteDoc = (id: string) => {
    storageService.deleteDocumento(id);
  };

  const conferirNF = (docId: string) => {
    return storageService.conferirNotaFiscal(docId, currentUser);
  };

  const rejeitarNF = (docId: string, motivo: string) => {
    return storageService.rejeitarNotaFiscal(docId, currentUser, motivo);
  };

  const getHistoricoByOS = (osId: string) => {
    return storageService.getHistorico(osId);
  };

  const saveUnidade = (u: Unidade) => storageService.saveUnidade(u);
  const deleteUnidade = (id: string) => storageService.deleteUnidade(id);
  const saveOficina = (o: Oficina) => storageService.saveOficina(o);
  const deleteOficina = (id: string) => storageService.deleteOficina(id);
  const saveViatura = (v: Viatura) => storageService.saveViatura(v);
  const deleteViatura = (id: string) => storageService.deleteViatura(id);
  const saveUsuario = (u: Usuario) => storageService.saveUsuario(u);
  const deleteUsuario = (id: string) => storageService.deleteUsuario(id);

  const markNotificacaoRead = (id: string) => storageService.markNotificacaoAsRead(id);
  const markAllNotificacoesRead = () => {
    const targetId = currentUser?.unidadeId || currentUser?.oficinaId;
    storageService.markAllNotificacoesAsRead(perfil, targetId);
  };

  const updateDriveConfig = (cfg: GoogleDriveConfig) => storageService.updateGoogleDriveConfig(cfg);

  const syncDocToDrive = async (docId: string): Promise<{ success: boolean; message: string }> => {
    const doc = storageService.getDocumentoById(docId);
    if (!doc) return { success: false, message: 'Documento não encontrado.' };

    const os = storageService.getOrdemServicoById(doc.osId);
    const now = new Date().toISOString();

    const driveLink = `https://drive.google.com/file/d/gestao2027-${doc.numeroDocumento || docId}/view`;
    const updatedDoc: DocumentoOS = {
      ...doc,
      driveSyncStatus: 'SINCRONIZADO',
      driveFileId: `drv-manual-${Date.now()}`,
      driveWebViewLink: driveLink,
      atualizadoEm: now,
    };
    storageService.saveDocumento(updatedDoc);

    storageService.logDriveSync({
      id: `log-${Date.now()}`,
      dataHora: now,
      numeroOS: os?.numeroOS || 'OS-2027-XXX',
      tipoDoc: doc.tipoDocumento,
      caminhoDrive: `Credenciamento 2027 > Documentos OS > ${os?.unidadeId || 'Unidade'} > ${os?.oficinaId || 'Oficina'} > ${os?.numeroOS || 'OS'} > ${doc.tipoDocumento}`,
      status: 'SUCESSO',
      mensagem: `Arquivo ${doc.nomeArquivo} sincronizado com a árvore do Google Drive.`,
      driveLink,
    });

    return { success: true, message: 'Arquivo sincronizado com o Google Drive com sucesso!' };
  };

  const resetDemoData = () => {
    storageService.resetToSeedData();
  };

  return (
    <DataContext.Provider
      value={{
        ordensServico,
        viaturas,
        unidades,
        oficinas,
        notificacoes,
        allUnidades: rawUnidades,
        allOficinas: rawOficinas,
        allViaturas: rawViaturas,
        allUsuarios: rawUsuarios,
        allOrdensServico: rawOS,
        googleDriveConfig: driveConfig,
        createOS,
        updateOS,
        changeStatusOS,
        getOSById,
        getItensByOS,
        saveItem,
        deleteItem,
        saveAllItens,
        getDocumentosByOS,
        saveDoc,
        deleteDoc,
        conferirNF,
        rejeitarNF,
        getHistoricoByOS,
        saveUnidade,
        deleteUnidade,
        saveOficina,
        deleteOficina,
        saveViatura,
        deleteViatura,
        saveUsuario,
        deleteUsuario,
        unreadNotificacoesCount,
        markNotificacaoRead,
        markAllNotificacoesRead,
        updateDriveConfig,
        syncDocToDrive,
        resetDemoData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
