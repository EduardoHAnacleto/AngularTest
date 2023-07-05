import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface DadosCep{
  cep:string;
  logradouro:string;
  localidade:string;
  bairro:string;
  uf:string;
}

@Injectable({
  providedIn: 'root'
})
export class CepServiceService {

  constructor(private httpCliente: HttpClient) { }

  buscar(cep:string){
    return this.httpCliente.get<DadosCep>(`https://viacep.com.br/ws/${cep}/json/`)
  }

}
