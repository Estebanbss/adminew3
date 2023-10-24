import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Component, OnInit } from '@angular/core';
import { ModalServiceService } from 'src/app/core/services/modal-service.service';
import { PrestadoresService } from 'src/app/core/services/prestadores.service';


@Component({
  selector: 'app-warning-all',
  templateUrl: './warning-all.component.html',
  styleUrls: ['./warning-all.component.css']
})
export class WarningALLComponent implements OnInit {

  constructor(private MatProgressBarModule: MatProgressBarModule, private modalService: ModalServiceService,private prestadoresService: PrestadoresService) { }

  ngOnInit(): void {
    this.modalService.currentValue.subscribe(value => this.Value = value);
  }

  inputValue: string = '';
  Value: string = '';

  closemodal() {
    this.modalService.setWarningAll(false);//cierra el modal

   }

  borrartodo(){
    this.prestadoresService.borrarTodosLosDocumentos("prestadores")
    this.prestadoresService.borrarTodosLosDocumentos("atractivos")
    this.prestadoresService.borrarTodosLosDocumentos("rutas")
    this.prestadoresService.borrarTodosLosDocumentos("municipios")
    this.closemodal()

  }
}
