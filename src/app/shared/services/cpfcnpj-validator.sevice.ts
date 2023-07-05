import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CpfCnpjValidatorService {
    static validate(control: AbstractControl): ValidationErrors | null {
        const cpfcnpj = control.value;

        if (control.value === null || control.value === '') {
            return null;
        }

        const cleanedValue = cpfcnpj.replace(/\D/g, '');

        if (cleanedValue.length === 11) {
            if (!CpfCnpjValidatorService.validarCPF(cleanedValue)) {
                return { cpfcnpjInvalid: true };
            }
        } else if (cleanedValue.length === 14) {
            if (!CpfCnpjValidatorService.validarCNPJ(cleanedValue)) {
                return { cpfcnpjInvalid: true };
            }
        } else {
            return { cpfcnpjInvalid: true };
        }

        return null;
    }


    private static validarCPF(cpf: string): boolean {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11) {
            return false;
        }
        if (/^(\d)\1+$/.test(cpf)) {
            return false;
        }

        let sum = 0;
        let weight = 10;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * weight;
            weight--;
        }
        let digit = (sum % 11 < 2) ? 0 : 11 - (sum % 11);
        if (digit !== parseInt(cpf.charAt(9))) {
            return false;
        }

        sum = 0;
        weight = 11;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * weight;
            weight--;
        }
        digit = (sum % 11 < 2) ? 0 : 11 - (sum % 11);
        if (digit !== parseInt(cpf.charAt(10))) {
            return false;
        }

        return true;
    }

    private static validarCNPJ(cnpj: string): boolean {
        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj.length !== 14) {
            return false;
        }

        if (/^(\d)\1+$/.test(cnpj)) {
            return false;
        }

        let sum = 0;
        let weight = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        for (let i = 0; i < 12; i++) {
            sum += parseInt(cnpj.charAt(i)) * weight[i];
        }
        let digit = (sum % 11 < 2) ? 0 : 11 - (sum % 11);
        if (digit !== parseInt(cnpj.charAt(12))) {
            return false;
        }

        sum = 0;
        weight = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        for (let i = 0; i < 13; i++) {
            sum += parseInt(cnpj.charAt(i)) * weight[i];
        }
        digit = (sum % 11 < 2) ? 0 : 11 - (sum % 11);
        if (digit !== parseInt(cnpj.charAt(13))) {
            return false;
        }

        return true;
    }

}
