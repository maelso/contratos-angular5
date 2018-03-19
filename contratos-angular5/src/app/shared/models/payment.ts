export class Payment {
    value: number;
    expiration_date: Date;
    creation_date: Date;
    modified_date: Date;
    contractId: string;

    constructor(contractId: string, value: number, expiration_date: Date){
        this.contractId = contractId;
        this.value = value;
        this.expiration_date = expiration_date;
    }

    setCreationDate(){
        this.creation_date = new Date();
    }

    setModifiedDate(){
        this.modified_date = new Date();
    }
}
