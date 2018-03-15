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
	// 	title: 'Login',
	// 	route: '/login',
	// 	icon: 'account_circle',
	// },
	// {
	// 	title: 'Dashboard',
	// 	route: '/dashboard',
	// 	icon: 'dashboard',
	// },
	{
		title: 'Cliente',
		route: '/cliente',
		icon: 'account_circle',
	}
	];

	constructor(private header: HeaderComponent) { }

	ngOnInit() {}

	toggleMenu(){
		this.header.toggleMenu();
	}

}
