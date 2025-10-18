import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { FormLoginService } from '../../../services/form-login/form-login.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterTestingModule.withRoutes([]),
        NoopAnimationsModule
      ],
      providers: [FormLoginService]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário com campos login e senha', () => {
    const form = component.form;
    expect(form.contains('login')).toBeTrue();
    expect(form.contains('senha')).toBeTrue();
  });

  it('deve desabilitar o botão quando o formulário é inválido', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeTrue();
  });

  it('deve ativar o spinner e exibir mensagem de sucesso em login válido', fakeAsync(() => {
  const navigateSpy = spyOn(router, 'navigate');

  component.form.setValue({
    login: 'admin@email.com',
    senha: '123456'
  });

  component.onSubmit();
  expect(component.isLoading).toBeTrue();

  // Avança o tempo do spinner (5 segundos)
  tick(5000);
  fixture.detectChanges();

  expect(component.isLoading).toBeFalse();
  expect(component.messageType).toBe('success');
  expect(component.message).toContain('Login realizado com sucesso!');

  // Avança 1 segundo (tempo do redirect)
  tick(1000);
  expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);

  // Avança mais 5 segundos (tempo do clear da mensagem)
  tick(5000);
}));

 it('deve exibir mensagem de erro em login inválido', fakeAsync(() => {
  component.form.setValue({
    login: 'usuario@teste.com',
    senha: 'senhaErrada'
  });

  component.onSubmit();
  tick(5000); // simula tempo do login
  fixture.detectChanges();

  expect(component.isLoading).toBeFalse();
  expect(component.messageType).toBe('error');
  expect(component.message).toContain('Usuário ou senha inválidos.');

  // Avança mais 5 segundos para limpar a mensagem
  tick(5000);
  fixture.detectChanges();

  expect(component.message).toBe('');
  expect(component.messageType).toBe('');
}));

  it('deve limpar a mensagem após 5 segundos', fakeAsync(() => {
    component.form.setValue({
      login: 'usuario@teste.com',
      senha: 'senhaErrada'
    });

    component.onSubmit();
    tick(5000);
    fixture.detectChanges();

    expect(component.messageType).toBe('error');

    // aguarda mais 5 segundos para desaparecer a mensagem
    tick(5000);
    fixture.detectChanges();

    expect(component.message).toBe('');
    expect(component.messageType).toBe('');
  }));
});
