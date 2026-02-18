import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CepResponse {
  erro: any;
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private apiUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  buscarPorCep(cep: string): Observable<CepResponse> {
    const cepLimpo = cep.replace(/\D/g, '');
    return this.http.get<CepResponse>(`${this.apiUrl}/${cepLimpo}/json`);
  }
}
