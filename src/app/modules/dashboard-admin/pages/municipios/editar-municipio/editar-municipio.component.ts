import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Municipio } from 'src/app/common/place.interface';
import { MunicipiosService } from 'src/app/core/services/municipios.service';

@Component({
  selector: 'app-editar-municipio',
  templateUrl: './editar-municipio.component.html',
  styleUrls: ['./editar-municipio.component.css']
})
export class EditarMunicipioComponent {

  //? Observable con el que vamos a recibir la información compartida desde el componente listar
  private data$: Observable<Municipio>;

  //? Propiedad de tipo municipio para almacenar y manipular lo que trae el Observable
  municipioObservable!: Municipio;

  // ? -> La propiedad createMunicipio no es un Objeto, es una Propiedad de Almacén de los datos HTML
  createMunicipio: FormGroup; //Propiedad para almacenar los valores del Formulario y Gestionarlos.

  // ? -> Lo vamos a utilizar en el ngIf del span del aviso una vez enviado el Form
  submitted = false; //Para saber si se envió el form de manera correcta.

  // ? -> Propiedad de tipo Object que va a almacenar nuestros datos y se va a pasar a Firestore
  municipio: Municipio;

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
    private municipiosService: MunicipiosService, // Servicio con los métodos CRUD para municipioObservablees
    private router: Router, // Clase Router para moverme a otro componente una vez enviado el form
  ) {
    //Aquí inicializamos propiedades.
    //Formulario - Se declaran las variables que lo conforman.
    this.createMunicipio = this.fb.group({
      nombre: ['', Validators.required],
      zona: ['', Validators.required],
      descripcion: ['', Validators.required],
      poblacion: ['', Validators.required],
      gentilicio: ['', Validators.required],
      clima: ['', Validators.required],
      servicios: ['', Validators.required],
      fiestasEventos: ['', Validators.required],
      hechosHistoricos: ['', Validators.required],
      sitioWeb: ['', Validators.required],
      facebook: ['', Validators.required],
      instagram: ['', Validators.required],
      twitter: ['', Validators.required],
      youtube: ['', Validators.required],
      latitud: ['', Validators.required],
      longitud: ['', Validators.required],
      googleMaps: ['', Validators.required]
    })

    //Inicializamos la propiedad municipioObservableTurístico
    this.municipio = {
      //id -> Nos lo da firebase
      name: '',
      zona: '',
      descripcion: '',
      poblacion: '',
      gentilicio: '',
      clima: '',
      servicios: '',
      fiestasEventos: '',
      hechosHistoricos: '',
      sitioWeb: '',
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
      latitud: 0,
      longitud: 0,
      googleMaps: '',
      pathImages: [], // -> lo conseguimos en la inserción de imágenes
      meGusta: 0, // -> # de Me gustas en la App
      pathImagePortada: {
        path: '',
        url: ''
      }
    }

    //Inicializamos el Observable y nos suscribimos a él para obtener la información
    this.data$ = this.municipiosService.sharingMunicipio;

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
    this.data$.subscribe((municipioObservable) => {
      //Pasamos los datos del Observable a nuestra propiedad nativa para mejor manipulación de datos
      this.municipioObservable = municipioObservable;
    })

    //Vamos a rellenar el formulario sólo con los datos que necesitan los campos
    this.createMunicipio.setValue({
      nombre: this.municipioObservable.name,
      zona: this.municipioObservable.zona,
      descripcion: this.municipioObservable.descripcion,
      poblacion: this.municipioObservable.poblacion,
      gentilicio: this.municipioObservable.gentilicio,
      clima: this.municipioObservable.clima,
      servicios: this.municipioObservable.servicios,
      fiestasEventos: this.municipioObservable.fiestasEventos,
      hechosHistoricos: this.municipioObservable.hechosHistoricos,
      sitioWeb: this.municipioObservable.sitioWeb,
      facebook: this.municipioObservable.facebook,
      instagram: this.municipioObservable.instagram,
      twitter: this.municipioObservable.twitter,
      youtube: this.municipioObservable.youtube,
      latitud: this.municipioObservable.latitud,
      longitud: this.municipioObservable.longitud,
      googleMaps: this.municipioObservable.googleMaps
    })

    //? Mostrar imágenes

    //Crear la validación en caso de que no exístan valores a mostrar de las imágenes no se llenen las propiedades

    //? Imágen de Portada
    //Pasamos el objeto que vamos a mostrar a una propiedad local
    this.imgPortada = this.municipioObservable.pathImagePortada;
    //Hacemos una validación por propiedades del objeto
    if(this.imgPortada.path === '' && this.imgPortada.url === '') {
      this.imgPortadaVal = false;
    } else {
      this.imgPortadaVal = true;
    }

    //? Imágenes de Galería
    //Primero colocamos nuestro arreglo de objetos de tipo {path: , url: } a un arreglo que vamos iterar en el html para mostrarlas
    this.municipioObservable.pathImages?.forEach(obj => {
      this.images.push(obj);
    })

  } //? -> Fin método Llenar Formulario

  //? -> Método para borrar las imágenes del Storage y del objeto que tengo actual (Además: Actualizar la BD por si sólo entro al componente Actualizar borro una imágen y luego me devuelvo)
  actualizarImagenPortada(imgPortada: any) {
    //Primero borramos en Storage (Servicio)
    this.municipiosService.borrarImg(imgPortada);
    //Luego hacemos el borrado en nuestra propiedad this.municipioObservable (En este componente)
    this.municipioObservable.pathImagePortada = {path: '', url: ''};
    //Cambiamos el dato de la variable que valida la existéncia de imágen de portada
    this.imgPortadaVal = false;
    //Luego actulizamos los datos de Firestore (Con nuetro this.municipioObservable, para que queden igual los datos de la BD y los datos del componente)
    this.municipiosService.actualizarMunicipio(this.municipioObservable);
  }

  //? -> Método para borrar las imágenes del Storage y del objeto que tengo actual (Además: Actualizar la BD por si sólo entro al componente Actualizar borro una imágen y luego me devuelvo)
  //Primero vamos a identificar qué imágenes debemos borrar según el click, en el html (El objeto)
  actualizarImagenesGaleria(image: any, indice: any) {
    //Borramos la imágen seleccionada en el storage
    this.municipiosService.borrarImg(image);
    //Luego borramos las imágenes en el arreglo de objetos que tenemos actualmente (En este componente)
    this.municipioObservable.pathImages?.splice(indice, 1); //Pasamos la posición del elemento y la cantidad de elementos que quiero borrar
    //Luego borramos las imágenes en el arreglo que se está renderizando en el html (Importante para mostrar el cambio de las imágenes en tiempo real ya que this.municipioObservable.pathImages y this.images son dos arreglo distintos)
    this.images.splice(indice, 1);
    //this.mostrarElemento = !this.mostrarElemento;
    //Luego actulizamos los datos de Firestore (Con nuetro this.municipioObservable, para que queden igual los datos de la BD y los datos del componente)
    this.municipiosService.actualizarMunicipio(this.municipioObservable);
  }

  //? -> Método para editarmunicipioObservable
  editarMunicipio() {
    //Creamos el objeto que queremos editar y que vamos a pasar a firebase, lo creamos con los valores que nos da el observable y lo que modificó el usuario en el formulario.
    this.municipio = {
      id: this.municipioObservable.id, // -> No se modifica con el Form
      name: this.createMunicipio.value.nombre,
      zona: this.createMunicipio.value.zona,
      poblacion: this.createMunicipio.value.poblacion,
      descripcion: this.createMunicipio.value.descripcion,
      gentilicio: this.createMunicipio.value.gentilicio,
      clima: this.createMunicipio.value.clima,
      servicios: this.createMunicipio.value.servicios,
      fiestasEventos: this.createMunicipio.value.fiestasEventos,
      hechosHistoricos: this.createMunicipio.value.hechosHistoricos,
      sitioWeb: this.createMunicipio.value.sitioWeb,
      facebook: this.createMunicipio.value.facebook,
      instagram: this.createMunicipio.value.instagram,
      twitter: this.createMunicipio.value.twitter,
      youtube: this.createMunicipio.value.youtube,
      latitud: 0,
      longitud: 0,
      googleMaps: this.createMunicipio.value.googleMaps,
      pathImages: this.municipioObservable.pathImages, // -> No se modifica con el Form
      meGusta: this.municipioObservable.meGusta, // -> No se modifica con el Form
      pathImagePortada: this.municipioObservable.pathImagePortada, // -> No se modifica con el Form
    }

    //Utilizamos el servicio con el método de actualizar los datos en Firestore
    this.municipiosService.editarMunicipio(this.municipio, this.files, this.portadaFile) //Manejamos la Promesa
    .then(() => {
      //Informamos
      alert('El municipioObservable fue modificado con éxito');
      //Nos direcciona a la página del Listado
      this.router.navigate(['/dashboard-admin/pagina-inicio/list-municipio']);
    })
    .catch(error => console.log(error));

  } //? -> Fin método para Editar municipioObservable

  selectedImages: any[] = [];
  selectedImages2: any[] = [];
  //? -> Método para Capturar los Archivos antes de enviar el Form - Se dispara el método con el Input
  uploadFiles($event: any) {

    const files = $event.target.files as FileList;
    this.files = $event.target.files;
    // Convertir FileList a Array y obtener vistas previas
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.selectedImages.push(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  } //? -> Fin Método cargar archivo


  //? -> Método para Cargar la imágen de portada o imágen principal
  uploadFilePortada($event: any) {
    this.selectedImages2 = []; //Vaciamos el arreglo de imágenes
    const files = $event.target.files as FileList;
    this.portadaFile = $event.target.files[0];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.selectedImages2.push(e.target.result);
      };

      reader.readAsDataURL(file);
    }
    // console.log(this.portadaFile);
  }

}
