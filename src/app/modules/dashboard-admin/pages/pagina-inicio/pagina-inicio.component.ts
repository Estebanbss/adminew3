import { Component } from '@angular/core';

@Component({
  selector: 'app-pagina-inicio',
  templateUrl: './pagina-inicio.component.html',
  styleUrls: ['./pagina-inicio.component.css']
})
export class PaginaInicioComponent {
  public cerrado: boolean = true;

  hidden(){
    this.cerrado == true ? this.cerrado = false : this.cerrado = true;
  }
}

