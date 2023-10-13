import { Component, HostListener, OnInit } from '@angular/core';
import { ModalServiceService } from 'src/app/core/services/modal-service.service';
import { PrestadoresService } from 'src/app/core/services/prestadores.service';

@Component({
  selector: 'app-pagina-inicio',
  templateUrl: './pagina-inicio.component.html',
  styleUrls: ['./pagina-inicio.component.css']
})
export class PaginaInicioComponent implements OnInit {
  public cerrado: boolean = false;
  modalsuichtodo!:boolean;
  modaldata!:boolean;

  warningAll!:boolean;

  botonActivo:string = ""; // Variable para guardar el botón activo

  activarBoton(boton: string) {// Función para activar el botón seleccionado
    this.botonActivo = boton;// Guarda el botón seleccionado en la variable
    console.log(this.botonActivo )
  }

  // Escucha el evento mousedown
  onCloseMousedown(event: MouseEvent) {
    this.cerrado = false;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.closemodal();
    }
  }

  openmodaltodo() {
    this.modalService.setModalSuichTodo(true);
  }

  openmodaldata() {
    this.modalService.setData(true);
  }

  openWarningtodo() {
    this.modalService.setWarningAll(true);
  }


  DescargarArchivo(){
        // URL del archivo que deseas descargar
        const url = 'https://firebasestorage.googleapis.com/v0/b/centurhuila-b9e47.appspot.com/o/ManualDeUsuario%2FFormato.xlsx?alt=media&token=a5cd4d6c-bec4-416c-a4ca-1860633d1fd3&_gl=1*ywew72*_ga*NDA2NDgyOTM3LjE2ODY3NDgyNjA.*_ga_CW55HF8NVT*MTY5Njg4ODYzNy41MC4xLjE2OTY4ODg2NzcuMjAuMC4w';

        // Abre la URL en una nueva pestaña para forzar la descarga
        window.open(url, '_blank');
  }

 closemodal() {
    this.modalService.setWarning(false);//cierra el modal
    this.modalService.setModalSuichTodo(false);//cierra el modal
    this.modalService.setWarningAll(false);//cierra el modal
    this.modalService.setData(false);//cierra el modal
    this.modalService.setModalSuichAtrac(false);//cierra el modal
    this.modalService.setModalSuichPst(false);//cierra el modal
    this.cerrado = false;
   }



  hidden(){
    this.cerrado == false ? this.cerrado = true : this.cerrado = false;
  }
  constructor(  private prestadoresService: PrestadoresService, // Inyectamos el servicio
  private modalService: ModalServiceService){

  }
  ngOnInit(): void {
    this.modalService.modalsuichtodo$.subscribe((value) => {
      this.modalsuichtodo = value;
    });


    this.modalService.warningAll$.subscribe((value) => {
      this.warningAll = value;
    });

    this.modalService.modaldata$.subscribe((value) => {
      this.modaldata = value;
    });



  }
}

