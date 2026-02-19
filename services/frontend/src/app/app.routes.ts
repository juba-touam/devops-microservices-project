import { Routes } from '@angular/router';
import { CatalogueComponent } from './components/catalogue/catalogue.component';
import { CartComponent } from './components/cart/cart.component';
import { PaymentComponent } from './components/payment/payment.component';

export const routes: Routes = [
  { path: '', component: CatalogueComponent },
  { path: 'cart', component: CartComponent },
  { path: 'payment', component: PaymentComponent },
  { path: '**', redirectTo: '' }
];
