import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Municipio } from 'src/app/common/place.interface';
import { MunicipiosService } from 'src/app/core/services/municipios.service';

@Component({
  selector: 'app-listado-municipio',
  templateUrl: './listado-municipio.component.html',
  styleUrls: ['./listado-municipio.component.css']
})
export class ListadoMunicipioComponent implements OnInit {
  //?Página donde estamos, propiedad para la paginación
  page: number = 1;

  //? -> Propiedad para el Pipe en el filtro de texto
  filterPost: string = '';

  //? -> Propiedad para el Pipe en el filtro por botón de Servicios
  servicio: string = 'todos'; //Almacena el valor de la opción que se elija en el botón a filtrar.

  //? -> Propiedad para el Pipe en el filtro por botón de Municipios
  zonaFilter: string = 'todos'; //Almacena el valor de la opción que se elija en el botón a filtrar.

  //? -> Propiedad para almacenar el arreglo de objetos que nos va a traer la BD al disparar el método getAtractivo, la utilizamos para Bandear los datos en el html de list y mostrar los datos
  municipios: Municipio[] = [];

  //? -> Inyecciones de dependencias
  constructor(
    private municipiosService: MunicipiosService, // Inyectamos el servicio
    private router: Router, // Clase Router para moverme a otro componente una vez enviado el form
  ) {

  }

  ngOnInit() {
    //Lo ejecutamos en el método OnInit para que dispare el método getAtractivo y me cargue los datos apenas se cargue el componente. Además de que disparamos el cold Observable para que se actualizen los datos a tiempo real.
    this.getAtractivo();
  }

  //? -> Método para obtener los elementos de la BD
  getAtractivo() {
    //? -> Aquí nos suscribimos a nuestro observable desde el método de nuestro servicio para que esté atento a los cambios que se hagan a tiempo real.
    this.municipiosService.obtenerMunicipios().subscribe(data => {
      // data nos trae un arreglo con el conjunto de elemento de tipo Object - Arreglo de Objetos
      // console.log(data);
      this.municipios = data; //Pasamos la información a una propiedad nativa de la clase para hacer el Banding
    })
  }


  //? -> Método para eliminar un Prestador
  eliminarMunicipio(atractivo: any) {
    //Primero borramos los datos del Storage ya que necesitamos el path de la imágenes que tiene nuestro objeto guardado en Firestore
    // Hacer Validación de si exísten imágenes para borrar en cada caso
    this.municipiosService.borrarImagenesMunicipio(atractivo);

    //Aquí eliminamos los datos de Firestore
    this.municipiosService.borrarMunicipio(atractivo)
    .then(() => {
      alert('Atractivo Turistico Eliminado');
    })
    .catch(error => console.log(error));
  }

  //? -> Método para obtener objeto a actualizar y enviarlo por medio de Observables
  obtenerMunicipio(municipio: any) {
    //Utilizamos un BehaviorSubject para obtener el dato que queremos actualizar
    this.municipiosService.editMunicipioData = municipio;
    this.router.navigate(['/dashboard-admin/pagina-inicio/editar-municipio']);
  }

  // //? -> Método para filtrar por medio del botón
  // applyFilterServices(selectedCategory: any) {
  //   this.servicio = selectedCategory.target.value; // Obtenemos el valor seleccionado en el html.
  //   this.servicio = this.servicio.toLowerCase(); // Los valores de las opciones pasan a minúsculas para comparar.
  // } //Fin Función applyFilterServices

  //? -> Método para filtrar por medio del botón
  applyFilterZona(selectedCategory: any) {
    this.zonaFilter = selectedCategory.target.value; // Obtenemos el valor seleccionado en el html.
    this.zonaFilter = this.zonaFilter.toLowerCase(); // Los valores de las opciones pasan a minúsculas para comparar.
  } //Fin Función applyFilterServices

}
