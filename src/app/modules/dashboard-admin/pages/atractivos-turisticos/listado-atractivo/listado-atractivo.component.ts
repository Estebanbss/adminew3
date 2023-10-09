import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AtractivoTuristico } from 'src/app/common/place.interface';
import { AtractivosService } from 'src/app/core/services/atractivos.service';
import { ModalServiceService } from 'src/app/core/services/modal-service.service';
import { PrestadoresService } from 'src/app/core/services/prestadores.service';

@Component({
  selector: 'app-listado-atractivo',
  templateUrl: './listado-atractivo.component.html',
  styleUrls: ['./listado-atractivo.component.css']
})
export class ListadoAtractivoComponent implements OnInit {

  warning!:boolean;
  modalsuichatrac!:boolean;


    //?-> función que detecta la tecla presionada y si es igual a escape cierra el modal
    onKeyDown(event: KeyboardEvent) {//Función que detecta la tecla presionada y si es igual a escape cierra el modal
      if (event.key === "Escape") {//Si la tecla presionada es igual a escape
        this.closemodal();//Se ejecuta la función closemodal
      }
    }

    openmodalatrac() {
      this.modalService.setModalSuichAtrac(true);
    }

    openmodalwarning(value: string) {
      this.modalService.setWarning(true);
      this.modalService.setValue(value);
    }

    closemodal() {
      this.modalService.setModalSuichAtrac(false);//cierra el modal
      this.modalService.setWarning(false);//cierra el modal
     }


  //?Página donde estamos, propiedad para la paginación
  page: number = 1;

  //? -> Propiedad para el Pipe en el filtro de texto
  filterPost: string = '';

  //? -> Propiedad para el Pipe en el filtro por botón de Servicios
  servicio: string = 'todos'; //Almacena el valor de la opción que se elija en el botón a filtrar.

  //? -> Propiedad para el Pipe en el filtro por botón de Municipios
  municipio: string = 'todos'; //Almacena el valor de la opción que se elija en el botón a filtrar.

  //? -> Propiedad para almacenar el arreglo de objetos que nos va a traer la BD al disparar el método getAtractivo, la utilizamos para Bandear los datos en el html de list y mostrar los datos
  atractivosTuristicos: AtractivoTuristico[] = [];

  //? -> Inyecciones de dependencias
  constructor(
    private prestadoresService: PrestadoresService, // Inyectamos el servicio
    private atractivosService: AtractivosService, // Inyectamos el servicio
    private router: Router, // Clase Router para moverme a otro componente una vez enviado el form
    private modalService: ModalServiceService //Inyectamos el servicio del modal
  ) {

  }

  ngOnInit() {

    this.modalService.modalsuichatrac$.subscribe((value) => {
      this.modalsuichatrac = value;
    });

        this.modalService.warning$.subscribe((value) => {
      this.warning = value;
    });

    //Lo ejecutamos en el método OnInit para que dispare el método getAtractivo y me cargue los datos apenas se cargue el componente. Además de que disparamos el cold Observable para que se actualizen los datos a tiempo real.
    this.getAtractivo();
  }

  //? -> Método para obtener los elementos de la BD
  getAtractivo() {
    //? -> Aquí nos suscribimos a nuestro observable desde el método de nuestro servicio para que esté atento a los cambios que se hagan a tiempo real.
    this.atractivosService.obtenerAtractivos().subscribe(data => {
      // data nos trae un arreglo con el conjunto de elemento de tipo Object - Arreglo de Objetos
      // console.log(data);
      this.atractivosTuristicos = data; //Pasamos la información a una propiedad nativa de la clase para hacer el Banding
    })
  }


  //? -> Método para eliminar un Prestador
  eliminarAtractivo(atractivo: any) {
    //Primero borramos los datos del Storage ya que necesitamos el path de la imágenes que tiene nuestro objeto guardado en Firestore
    // Hacer Validación de si exísten imágenes para borrar en cada caso
    this.atractivosService.borrarImagenesAtractivo(atractivo);

    //Aquí eliminamos los datos de Firestore
    this.atractivosService.borrarAtractivo(atractivo)
    .then(() => {
      alert('Atractivo Turistico Eliminado');
    })
    .catch(error => console.log(error));
  }

  //? -> Método para obtener objeto a actualizar y enviarlo por medio de Observables
  obtenerAtractivo(atractivo: any) {
    //Utilizamos un BehaviorSubject para obtener el dato que queremos actualizar
    this.atractivosService.editAtractivoData = atractivo;
    this.router.navigate(['/dashboard-admin/pagina-inicio/editar-atractivo-turistico']);
  }

  //? -> Método para filtrar por medio del botón
  applyFilterServices(selectedCategory: any) {
    this.servicio = selectedCategory.target.value; // Obtenemos el valor seleccionado en el html.
    this.servicio = this.servicio.toLowerCase(); // Los valores de las opciones pasan a minúsculas para comparar.
  } //Fin Función applyFilterServices

  //? -> Método para filtrar por medio del botón
  applyFilterMunicipio(selectedCategory: any) {
    this.municipio = selectedCategory.target.value; // Obtenemos el valor seleccionado en el html.
    this.municipio = this.municipio.toLowerCase(); // Los valores de las opciones pasan a minúsculas para comparar.
  } //Fin Función applyFilterServices

}
