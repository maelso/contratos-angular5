import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

	routes: Object[] = [
		// {
		// 	title: 'Dashboard',
		// 	route: '/dashboard',
		// 	icon: 'dashboard',
		// },
		{
			title: 'Clientes',
			route: '/cliente',
			icon: 'account_circle',
		},
		{
			title: 'Contratos',
			route: '/contrato',
			icon: 'description',
		}
	];

	constructor(private header: HeaderComponent) { }

	ngOnInit() { }

	toggleMenu() {
		this.header.toggleMenu();
	}

}
