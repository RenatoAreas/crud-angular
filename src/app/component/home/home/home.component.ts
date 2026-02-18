  import { Component } from '@angular/core';
  import { FormGroup, ReactiveFormsModule } from '@angular/forms';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatSelectModule } from '@angular/material/select';
  import { MatButtonModule } from '@angular/material/button';
  import { CommonModule } from '@angular/common';
  import { Router } from '@angular/router';
  import {
    MatProgressSpinner,
  } from '@angular/material/progress-spinner';
  import { FormLoginService } from '../../../services/form-login/form-login.service';

  @Component({
    selector: 'app-home',
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatButtonModule,
      MatProgressSpinner,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
  })
  export class HomeComponent {
    isLoading = false;
    form: FormGroup;
    message = '';
    messageType: 'success' | 'error' | '' = '';

    constructor(
      private formLoginService: FormLoginService,
      private router: Router
    ) {
      // injeta o formulário vindo do service
      this.form = this.formLoginService.createLoginForm();
    }

    onSubmit() {
      if (this.form.valid && !this.isLoading) {
        this.isLoading = true;
        this.message = '';
        this.messageType = '';

        const { login, senha } = this.form.value;
        console.log('Tentando login com:', login, senha);

        setTimeout(() => {
          const loginCorreto = login === 'admin@email.com';
          const senhaCorreta = senha === '123456';

          this.isLoading = false;
          // Simulação de login
          if (loginCorreto && senhaCorreta) {
            this.message = 'Login realizado com sucesso!';
            this.messageType = 'success';
            setTimeout(() => this.router.navigate(['/dashboard']), 1000);
          } else {
            this.message = 'Usuário ou senha inválidos.';
            this.messageType = 'error';
          }

          // limpa mensagem após 5 segundos
          setTimeout(() => {
            this.message = '';
            this.messageType = '';
          }, 5000);
        }, 5000);
      }
    }
  }
