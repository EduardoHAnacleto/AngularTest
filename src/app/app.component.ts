import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators,  } from '@angular/forms';
import { ICliente } from './shared/models/icliente.model';
import { CepServiceService } from './shared/services/cep-service.service';
import { CpfCnpjValidatorService } from './shared/services/cpfcnpj-validator.sevice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  listClientes: ICliente[] = [];
  formDisplay: boolean = true;
  clienteForm!: FormGroup;
  ultimoId: number = 0;
  submitted = false;


  constructor(private cepService: CepServiceService,
              private cpfcnpjValidatorService: CpfCnpjValidatorService) { }

  get fc(){
    return this.clienteForm.controls;
  }

  ngOnInit() {
    this.initializeForm();
    this.loadClientes();
  }

  consultaCep(event: any) {
    const cep = event.target.value;
    if (cep) {
      this.cepService.buscar(cep).subscribe(
        (dados) => this.populaForm(dados),
        (erro) => {
          console.error(erro);
          alert(erro);
        });
    }
  }

  populaForm(dados: any) {
    this.clienteForm.controls["endereco"].setValue(dados.logradouro);
    this.clienteForm.controls["bairro"].setValue(dados.bairro);
    this.clienteForm.controls["cidade"].setValue(dados.localidade);
  }



  initializeForm() {
    this.clienteForm = new FormGroup({
      tipo: new FormControl('', Validators.required),
      nomeFantasia: new FormControl(''),
      nome: new FormControl('', Validators.required),
      cpfcnpj: new FormControl('', [Validators.required, CpfCnpjValidatorService.validate]),
      cep: new FormControl(''),
      endereco: new FormControl(''),
      bairro: new FormControl(''),
      cidade: new FormControl(''),
      telefone: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  saveListClientes(novoCliente: ICliente) {
    this.listClientes.push(novoCliente);
    const clientes = JSON.stringify(this.listClientes);
    localStorage.setItem("listaClientes", clientes);
  }
  loadClientes() {
    const clientes = localStorage.getItem("listaClientes");
    if (clientes) {
      this.listClientes = JSON.parse(clientes);
      this.listClientes.forEach(cliente => {
        if (cliente.id > this.ultimoId) {
          this.ultimoId = cliente.id;
        }
      });
    }
    else {
      this.listClientes = [];
    }
  }

  displayForm() {
    this.initializeForm();
    this.submitted = false;
    this.formDisplay = true;

  }
  hideForm() {
    this.formDisplay = false;
  }
  saveClient() {
    this.submitted = true;
    if (this.clienteForm.invalid) {
          return;
    }

    const cliente: ICliente = {
      id: this.ultimoId + 1,
      tipo: this.clienteForm.value.tipo,
      registro: this.clienteForm.value.cpfcnpj,
      nome: this.clienteForm.value.nome,
      nome_fantasia: this.clienteForm.value.nomeFantasia,
      cep: this.clienteForm.value.cep,
      endereco: this.clienteForm.value.endereco,
      bairro: this.clienteForm.value.bairro,
      cidade: this.clienteForm.value.cidade,
      telefone: this.clienteForm.value.telefone,
      email: this.clienteForm.value.email
    };
    this.saveListClientes(cliente);
    this.hideForm();
  }

}
