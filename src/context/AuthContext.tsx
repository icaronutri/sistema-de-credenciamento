import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario, PerfilUsuario, Unidade, Oficina } from '../types';
import { storageService } from '../services/storage';

interface Permissoes {
  isMaster: boolean;
  isUnidade: boolean;
  isOficina: boolean;
  podeAprovarOrcamento: boolean;
  podeDevolverOrcamento: boolean;
  podeConferirNF: boolean;
  podeFinalizarOS: boolean;
  podeCancelarOS: boolean;
  podeGerenciarCadastros: boolean;
  podeVisualizarTodasOS: boolean;
  podeCriarOS: boolean;
  podePreencherOrcamento: boolean;
  podeIniciarExecucao: boolean;
  podeConcluirExecucao: boolean;
  podeAnexarDocumentos: boolean;
  podeConfigurarDrive: boolean;
}

interface AuthContextType {
  currentUser: Usuario;
  perfil: PerfilUsuario;
  unidadeAtual?: Unidade;
  oficinaAtual?: Oficina;
  permissoes: Permissoes;
  allUsers: Usuario[];
  switchUser: (userId: string) => void;
  loginWithEmail: (email: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState<string>(() => storageService.getCurrentUserId());
  const [users, setUsers] = useState<Usuario[]>(() => storageService.getUsuarios());

  useEffect(() => {
    const unsub = storageService.subscribe(() => {
      setUsers(storageService.getUsuarios());
      setCurrentUserId(storageService.getCurrentUserId());
    });
    return unsub;
  }, []);

  const currentUser =
    users.find((u) => u.id === currentUserId) ||
    users.find((u) => u.perfil === 'MASTER') ||
    users[0];

  const perfil = currentUser?.perfil || 'MASTER';

  const unidadeAtual = currentUser?.unidadeId
    ? storageService.getUnidadeById(currentUser.unidadeId)
    : undefined;

  const oficinaAtual = currentUser?.oficinaId
    ? storageService.getOficinaById(currentUser.oficinaId)
    : undefined;

  const isMaster = perfil === 'MASTER';
  const isUnidade = perfil === 'UNIDADE';
  const isOficina = perfil === 'OFICINA';

  const permissoes: Permissoes = {
    isMaster,
    isUnidade,
    isOficina,
    podeAprovarOrcamento: isMaster,
    podeDevolverOrcamento: isMaster,
    podeConferirNF: isMaster,
    podeFinalizarOS: isMaster,
    podeCancelarOS: isMaster,
    podeGerenciarCadastros: isMaster,
    podeVisualizarTodasOS: isMaster,
    podeCriarOS: isMaster || isUnidade,
    podePreencherOrcamento: isOficina,
    podeIniciarExecucao: isOficina,
    podeConcluirExecucao: isOficina,
    podeAnexarDocumentos: true, // Everyone can attach relevant docs, but with role rules
    podeConfigurarDrive: isMaster,
  };

  const switchUser = (userId: string) => {
    storageService.setCurrentUserId(userId);
    setCurrentUserId(userId);
  };

  const loginWithEmail = (email: string): boolean => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (found) {
      switchUser(found.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    // Switch to first master or fallback
    const firstMaster = users.find((u) => u.perfil === 'MASTER');
    if (firstMaster) {
      switchUser(firstMaster.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        perfil,
        unidadeAtual,
        oficinaAtual,
        permissoes,
        allUsers: users,
        switchUser,
        loginWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
