import { Address } from './address';

export class Client {
    name: string;
    address: Address;
    creation_date: Date;
    modified_date: Date;

    constructor(name: string, address: Address){
        this.name = name;
        this.address = address;
    }

    setCreationDate(){
        this.creation_date = new Date();
    }

    setModifiedDate(){
        this.modified_date = new Date();
    }
}
