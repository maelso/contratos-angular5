import { Address } from './address';

export class Contract {
    name: string;
    address: Address;
    value: number;
    number_installments: number;
    creation_date: Date;
    modified_date: Date;

    constructor(name: string, address: Address, value: number, number_installments:number){
        this.name = name;
        this.address = address;
        this.value = value;
        this.number_installments = number_installments;
    }

    setCreationDate(){
        this.creation_date = new Date();
    }

    setModifiedDate(){
        this.modified_date = new Date();
    }
}
