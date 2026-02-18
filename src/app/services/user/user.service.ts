import { Injectable } from '@angular/core';

export interface User {
  id?: number;
  nome: string;
  idade: number;
  cep: string;
  endereco: string;
  complemento: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private idCounter = 1;

  constructor() {}

  adicionarUsuario(user: Omit<User, 'id'>): User {
    const novoUsuario: User = {
      id: this.idCounter++,
      ...user
    };
    this.users.push(novoUsuario);
    return novoUsuario;
  }

  obterUsuarios(): User[] {
    return this.users;
  }

  obterUsuarioPorId(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  atualizarUsuario(id: number, user: Omit<User, 'id'>): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index > -1) {
      this.users[index] = {
        id,
        ...user
      };
      return true;
    }
    return false;
  }

  deletarUsuario(id: number): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index > -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
}
