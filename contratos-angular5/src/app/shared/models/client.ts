import { Address } from './address';

export class Client {
    name: string;
    address: Address;
    creation_date: Date;
    modified_date: Date;

    constructor(name: string, address: Address){
        this.name = name;
        this.address = address;
        this.creation_date = new Date();
        this.modified_date = new Date();
    }

    public getApiPostData(): any {
		let data = {
			"name": this.name,
            "address": this.address.getApiPostData(),
            "creation_date": this.creation_date,
            "modified_date": this.modified_date
		}
		return data;
	}
}
