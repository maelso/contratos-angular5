export class Address {
    country: string;
    state: string;
	city: string;

	constructor(country: string, state: string, city: string){
        this.country = country;
        this.state = state;
        this.city = city;
    }

	public getApiPostData(): any {
		let data = {
            "country": this.country,
            "state": this.state,
			"city": this.city
		}
		return data;
	}
}
