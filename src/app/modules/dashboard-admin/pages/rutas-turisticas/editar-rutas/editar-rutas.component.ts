import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Ruta } from 'src/app/common/place.interface';
import { RutasService } from 'src/app/core/services/rutas.service';

@Component({
  selector: 'app-editar-rutas',
  templateUrl: './editar-rutas.component.html',
  styleUrls: ['./editar-rutas.component.css']
})
export class EditarRutasComponent {

  //? Observable con el que vamos a recibir la información compartida desde el componente listar
  private data$: Observable<Ruta>;

  //? Propiedad de tipo ruta para almacenar y manipular lo que trae el Observable
  rutaObservable!: Ruta;

  // ? -> La propiedad createRuta no es un Objeto, es una Propiedad de Almacén de los datos HTML
  createRuta: FormGroup; //Propiedad para almacenar los valores del Formulario y Gestionarlos.

  // ? -> Lo vamos a utilizar en el ngIf del span del aviso una vez enviado el Form
  submitted = false; //Para saber si se envió el form de manera correcta.

  // ? -> Propiedad de tipo Object que va a almacenar nuestros datos y se va a pasar a Firestore
  ruta: Ruta;

  // ? -> Propiedad para almacenar los archivos antes de cargarlos a la BD
  files: any[] = []; //Presupongo que los archivos son un arreglo de tipo any, no estoy seguro

  //? -> Propiedad para almacenar la imágen de portada antes de cargarla a la BD
  portadaFile: any;

  // ? -> Propiedad Loading que nos va a determinar cuándo aparece el ícono de carga del html, se debe disparar la carga sólamente en caso de que el programa esté a la espera de una respuesta por parte de una promesa
  loading = false;

  //? -> Arreglo de URL de imágenes
  images: any[] = [];

  //? -> Imágen de Portada
  imgPortada: any;

  //? -> Validación
  imgPortadaVal = true;

  //? -> Propiedad para controlar si se muestra un elemento en el *ngIf
  mostrarElemento: boolean = true;

  //? Inyecciones de Dependencias
  constructor(
    private fb: FormBuilder, // Modulo para Formulario - Permite validar el formulario de manera sencilla.
    private rutasService: RutasService, // Servicio con los métodos CRUD para rutaObservablees.
    private router: Router, // Clase Router para moverme a otro componente una vez enviado el form
  ) {
    //Aquí inicializamos propiedades.
    //Formulario - Se declaran las variables que lo conforman.
    this.createRuta = this.fb.group({
      nombre: ['', Validators.required],
      informacionAdicional: ['', Validators.required],
      agenciaDeViajes: ['', Validators.required],
      descripcion: ['', Validators.required],
      latitud: ['', Validators.required],
      longitud: ['', Validators.required],
      googleMaps: ['', Validators.required]
    })

    //Inicializamos la propiedad rutaObservableTurístico
    this.ruta = {
      //id -> Nos lo da firebase
      name: '',
      informacionAdicional: '',
      agenciaDeViajes: '',
      descripcion: '',
      latitud: 0,
      longitud: 0,
      googleMaps: '',
      pathImages: [], // -> lo conseguimos en la inserción de imágenes
      meGusta: 0, // -> # de Me gustas en la App
      pathImagePortada: { // -> lo conseguimos en la inserción de imágenes
        path:'',
        url: ''
      }
    }

    //Inicializamos el Observable y nos suscribimos a él para obtener la información
    this.data$ = this.rutasService.sharingRuta;

  } //? -> Fin Constructor

  ngOnInit():void {
    // this.data$.subscribe((valor) => {
    //   console.log('Valor emitido por BehaviorSubject:', valor);
    // })
    this.llenarFormulario(); // Disparamos el método que nos trae lo necesario para trabajar la actualización
  }

  //? -> Método para rellenar los campos del formulario con el objeto que tenemos y mostrar las imágenes que tiene el objeto asociadas
  llenarFormulario() {

    //Primero nos suscribimos a nuestro observable para obtener los datos del elemento que queremos actualizar
    this.data$.subscribe((rutaObservable) => {
      //Pasamos los datos del Observable a nuestra propiedad nativa para mejor manipulación de datos
      this.rutaObservable = rutaObservable;
    })

    //Vamos a rellenar el formulario sólo con los datos que necesitan los campos
    this.createRuta.setValue({
      nombre: this.rutaObservable.name,
      informacionAdicional: this.rutaObservable.informacionAdicional,
      agenciaDeViajes: this.rutaObservable.agenciaDeViajes,
      descripcion: this.rutaObservable.descripcion,
      latitud: this.rutaObservable.latitud,
      longitud: this.rutaObservable.longitud,
      googleMaps: this.rutaObservable.googleMaps,
    })

    //? Mostrar imágenes

    //Crear la validación en caso de que no exístan valores a mostrar de las imágenes no se llenen las propiedades

    //? Imágen de Portada
    //Pasamos el objeto que vamos a mostrar a una propiedad local
    this.imgPortada = this.rutaObservable.pathImagePortada;
    //Hacemos una validación por propiedades del objeto
    if(this.imgPortada.path === '' && this.imgPortada.url === '') {
      this.imgPortadaVal = false;
    } else {
      this.imgPortadaVal = true;
    }

    //? Imágenes de Galería
    //Primero colocamos nuestro arreglo de objetos de tipo {path: , url: } a un arreglo que vamos iterar en el html para mostrarlas
    this.rutaObservable.pathImages?.forEach(obj => {
      this.images.push(obj);
    })

  } //? -> Fin método Llenar Formulario

  //? -> Método para borrar las imágenes del Storage y del objeto que tengo actual (Además: Actualizar la BD por si sólo entro al componente Actualizar borro una imágen y luego me devuelvo)
  actualizarImagenPortada(imgPortada: any) {
    //Primero borramos en Storage (Servicio)
    this.rutasService.borrarImg(imgPortada);
    //Luego hacemos el borrado en nuestra propiedad this.rutaObservable (En este componente)
    this.rutaObservable.pathImagePortada = {path: '', url: ''};
    //Cambiamos el dato de la variable que valida la existéncia de imágen de portada
    this.imgPortadaVal = false;
    //Luego actulizamos los datos de Firestore (Con nuetro this.rutaObservable, para que queden igual los datos de la BD y los datos del componente)
    this.rutasService.actualizarRuta(this.rutaObservable);
  }

  //? -> Método para borrar las imágenes del Storage y del objeto que tengo actual (Además: Actualizar la BD por si sólo entro al componente Actualizar borro una imágen y luego me devuelvo)
  //Primero vamos a identificar qué imágenes debemos borrar según el click, en el html (El objeto)
  actualizarImagenesGaleria(image: any, indice: any) {
    //Borramos la imágen seleccionada en el storage
    this.rutasService.borrarImg(image);
    //Luego borramos las imágenes en el arreglo de objetos que tenemos actualmente (En este componente)
    this.rutaObservable.pathImages?.splice(indice, 1); //Pasamos la posición del elemento y la cantidad de elementos que quiero borrar
    //Luego borramos las imágenes en el arreglo que se está renderizando en el html (Importante para mostrar el cambio de las imágenes en tiempo real ya que this.rutaObservable.pathImages y this.images son dos arreglo distintos)
    this.images.splice(indice, 1);
    //this.mostrarElemento = !this.mostrarElemento;
    //Luego actulizamos los datos de Firestore (Con nuetro this.rutaObservable, para que queden igual los datos de la BD y los datos del componente)
    this.rutasService.actualizarRuta(this.rutaObservable);
  }

  //? -> Método para editarRuta
  editarRuta() {
    //Creamos el objeto que queremos editar y que vamos a pasar a firebase, lo creamos con los valores que nos da el observable y lo que modificó el usuario en el formulario.
    this.ruta = {
      id: this.rutaObservable.id, // -> No se modifica con el Form
      name: this.createRuta.value.nombre,
      informacionAdicional: this.createRuta.value.informacionAdicional,
      agenciaDeViajes: this.createRuta.value.agenciaDeViajes,
      descripcion: this.createRuta.value.descripcion,
      latitud: this.createRuta.value.latitud,
      longitud: this.createRuta.value.longitud,
      googleMaps: this.createRuta.value.googleMaps,
      pathImages: this.rutaObservable.pathImages, // -> No se modifica con el Form
      meGusta: this.rutaObservable.meGusta, // -> No se modifica con el Form
      pathImagePortada: this.rutaObservable.pathImagePortada, // -> No se modifica con el Form
    }

    //Utilizamos el servicio con el método de actualizar los datos en Firestore
    this.rutasService.editarRuta(this.ruta, this.files, this.portadaFile) //Manejamos la Promesa
    .then(() => {
      //Informamos
      alert('El rutaObservable fue modificado con éxito');
      //Nos direcciona a la página del Listado
      this.router.navigate(['/dashboard-admin/pagina-inicio/list-rutas-turisticas']);
    })
    .catch(error => console.log(error));

  } //? -> Fin método para Editar rutaObservable

  //? -> Método para Capturar los Archivos antes de enviar el Form - Se dispara el método con el Input
  uploadFiles($event: any) {
    //files es un arreglo de archivos que cargamos desde el html
    this.files = $event.target.files; //Apuntamos al input y luego los ficheros - los ficheros son un arreglo
    //console.log(this.files.length); // quiero saber el largo de mi arreglo
  } //? -> Fin Método cargar archivo

  //? -> Método para Cargar la imágen de portada o imágen principal
  uploadFilePortada($event: any) {
    this.portadaFile = $event.target.files[0];
    // console.log(this.portadaFile);
  }

}
