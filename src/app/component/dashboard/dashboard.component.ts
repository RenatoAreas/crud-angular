import { Component, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CepService } from '../../services/cep/cep.service';
import { UserService, User } from '../../services/user/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [CepService, UserService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  formulario = {
    nome: '',
    idade: '',
    cep: '',
    endereco: '',
    complemento: ''
  };

  usuarios: User[] = [];
  cepCarregando = false;
  mensagem = '';
  tipoMensagem: 'sucesso' | 'erro' = 'sucesso';
  usuarioEditando: number | null = null;

  constructor(
    private cepService: CepService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.carregarUsuarios();
  }

  buscarCep() {
    if (!this.formulario.cep || this.formulario.cep.replace(/\D/g, '').length < 8) {
      this.exibirMensagem('CEP inválido', 'erro');
      return;
    }

    this.cepCarregando = true;
    this.cepService.buscarPorCep(this.formulario.cep).subscribe({
      next: (dados) => {
        if (dados.erro) {
          this.exibirMensagem('CEP não encontrado', 'erro');
          this.formulario.endereco = '';
        } else {
          this.formulario.endereco = dados.logradouro;
        }
        this.cepCarregando = false;
      },
      error: () => {
        this.exibirMensagem('Erro ao buscar CEP', 'erro');
        this.cepCarregando = false;
      }
    });
  }

  cadastrarOuAtualizarUsuario() {
    if (!this.validarFormulario()) {
      this.exibirMensagem('Preencha todos os campos', 'erro');
      return;
    }

    const dados = {
      nome: this.formulario.nome,
      idade: parseInt(this.formulario.idade),
      cep: this.formulario.cep,
      endereco: this.formulario.endereco,
      complemento: this.formulario.complemento
    };

    if (this.usuarioEditando !== null) {
      // Modo edição
      this.userService.atualizarUsuario(this.usuarioEditando, dados);
      this.exibirMensagem('Usuário atualizado com sucesso!', 'sucesso');
      this.usuarioEditando = null;
    } else {
      // Modo criação
      this.userService.adicionarUsuario(dados);
      this.exibirMensagem('Usuário cadastrado com sucesso!', 'sucesso');
    }

    this.limparFormulario();
    this.carregarUsuarios();
  }

  editarUsuario(usuario: User) {
    this.usuarioEditando = usuario.id ?? null;
    this.formulario = {
      nome: usuario.nome,
      idade: usuario.idade.toString(),
      cep: usuario.cep,
      endereco: usuario.endereco,
      complemento: usuario.complemento
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicao() {
    this.usuarioEditando = null;
    this.limparFormulario();
  }

  validarFormulario(): boolean {
    return (
      this.formulario.nome.trim() !== '' &&
      this.formulario.idade !== '' &&
      this.formulario.cep.trim() !== '' &&
      this.formulario.endereco.trim() !== ''
    );
  }

  limparFormulario() {
    this.formulario = {
      nome: '',
      idade: '',
      cep: '',
      endereco: '',
      complemento: ''
    };
  }

  carregarUsuarios() {
    this.usuarios = this.userService.obterUsuarios();
  }

  deletarUsuario(id: number | undefined) {
    if (id && this.userService.deletarUsuario(id)) {
      this.exibirMensagem('Usuário removido!', 'sucesso');
      this.carregarUsuarios();
    }
  }

  exibirMensagem(msg: string, tipo: 'sucesso' | 'erro') {
    this.mensagem = msg;
    this.tipoMensagem = tipo;
    setTimeout(() => {
      this.mensagem = '';
    }, 3000);
  }
}
