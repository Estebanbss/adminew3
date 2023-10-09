import { Component, OnInit } from '@angular/core';
import { ModalServiceService } from 'src/app/core/services/modal-service.service';
import { PrestadoresService } from 'src/app/core/services/prestadores.service';

@Component({
  selector: 'app-pagina-inicio',
  templateUrl: './pagina-inicio.component.html',
  styleUrls: ['./pagina-inicio.component.css']
})
export class PaginaInicioComponent implements OnInit {
  public cerrado: boolean = true;
  modalsuichtodo!:boolean;
  warning!:boolean;

  openmodalwarningtodo(){
    this.prestadoresService.borrarTodosLosDocumentos("prestadores")
    this.prestadoresService.borrarTodosLosDocumentos("atractivos")
    this.prestadoresService.borrarTodosLosDocumentos("rutas")
    this.prestadoresService.borrarTodosLosDocumentos("municipios")
    alert("SE BORRO TODO D:")

  }


  hidden(){
    this.cerrado == true ? this.cerrado = false : this.cerrado = true;
  }
  constructor(  private prestadoresService: PrestadoresService, // Inyectamos el servicio
  private modalService: ModalServiceService){

  }
  ngOnInit(): void {
    this.modalService.modalsuichtodo$.subscribe((value) => {
      this.modalsuichtodo = value;
    });

    this.modalService.warning$.subscribe((value) => {
      this.warning = value;
    });
  }
}

