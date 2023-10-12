import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AtractivoTuristico } from 'src/app/common/place.interface';
import { AtractivosService } from 'src/app/core/services/atractivos.service';

@Component({
  selector: 'app-editar-atractivo',
  templateUrl: './editar-atractivo.component.html',
  styleUrls: ['./editar-atractivo.component.css']
})
export class EditarAtractivoComponent implements OnInit {
    //? Observable con el que vamos a recibir la información compartida desde el componente listar
    private data$: Observable<AtractivoTuristico>;

    //? Propiedad de tipo AtractivoTuristico para almacenar y manipular lo que trae el Observable
    atractivo!: AtractivoTuristico;

    // ? -> La propiedad createAtractivo no es un Objeto, es una Propiedad de Almacén de los datos HTML
    createAtractivo: FormGroup; //Propiedad para almacenar los valores del Formulario y Gestionarlos.

    // ? -> Lo vamos a utilizar en el ngIf del span del aviso una vez enviado el Form
    submitted = false; //Para saber si se envió el form de manera correcta.

    // ? -> Propiedad de tipo Object que va a almacenar nuestros datos y se va a pasar a Firestore
    atractivoTuristico: AtractivoTuristico;

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
      private atractivosService: AtractivosService, // Servicio con los métodos CRUD para atractivoes
      private router: Router, // Clase Router para moverme a otro componente una vez enviado el form
    ) {
      //Aquí inicializamos propiedades.
      //Formulario - Se declaran las variables que lo conforman.
      this.createAtractivo = this.fb.group({
        nombre: ['', Validators.required],
        bienOLugar: ['', Validators.required],
        descripcion: ['', Validators.required],
        clima: ['', Validators.required],
        zona: ['', Validators.required],
        municipio: ['', Validators.required],
        direccionBarrioVereda: ['', Validators.required],
        indicacionesAcceso: ['', Validators.required],
        googleMaps: ['', Validators.required],
        latitud: ['', Validators.required],
        longitud: ['', Validators.required],
        recomendaciones: ['', Validators.required],
        actividades: ['', Validators.required],
        horarioAtencion: ['', Validators.required],
        administrador: ['', Validators.required],
        contactoAdmin: ['', Validators.required],
        redSocial: ['', Validators.required]
      })

      //Inicializamos la propiedad atractivoTurístico
      this.atractivoTuristico = {
        //id -> Nos lo da firebase
        name: '',
        bienOLugar: '',
        descripcion: '',
        clima: '',
        zona: '',
        municipio: '',
        direccionBarrioVereda: '',
        indicacionesAcceso: '',
        latitud: 0,
        longitud: 0,
        googleMaps: '',
        recomendaciones: '',
        actividades: '',
        horarioAtencion: '',
        administrador: '',
        contactoAdmin: '',
        redSocial: '',
        pathImages: [], // -> lo conseguimos en la inserción de imágenes
        meGusta: 0, // -> # de Me gustas en la App
        pathImagePortada: {
          path: '',
          url: ''
        }
      }

      //Inicializamos el Observable y nos suscribimos a él para obtener la información
      this.data$ = this.atractivosService.sharingAtractivo;

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
      this.data$.subscribe((atractivo) => {
        //Pasamos los datos del Observable a nuestra propiedad nativa para mejor manipulación de datos
        this.atractivo = atractivo;
      })

      //Vamos a rellenar el formulario sólo con los datos que necesitan los campos
      this.createAtractivo.setValue({
        nombre: this.atractivo.name,
        bienOLugar: this.atractivo.bienOLugar,
        descripcion: this.atractivo.descripcion,
        clima: this.atractivo.clima,
        zona: this.atractivo.zona,
        municipio: this.atractivo.municipio,
        direccionBarrioVereda: this.atractivo.direccionBarrioVereda,
        indicacionesAcceso: this.atractivo.indicacionesAcceso,
        googleMaps: this.atractivo.googleMaps,
        latitud: this.atractivo.latitud,
        longitud: this.atractivo.longitud,
        recomendaciones: this.atractivo.recomendaciones,
        actividades: this.atractivo.actividades,
        horarioAtencion: this.atractivo.horarioAtencion,
        administrador: this.atractivo.administrador,
        contactoAdmin: this.atractivo.contactoAdmin,
        redSocial: this.atractivo.redSocial
      })

      //? Mostrar imágenes

      //Crear la validación en caso de que no exístan valores a mostrar de las imágenes no se llenen las propiedades

      //? Imágen de Portada
      //Pasamos el objeto que vamos a mostrar a una propiedad local
      this.imgPortada = this.atractivo.pathImagePortada;
      //Hacemos una validación por propiedades del objeto
      if(this.imgPortada.path === '' && this.imgPortada.url === '') {
        this.imgPortadaVal = false;
      } else {
        this.imgPortadaVal = true;
      }

      //? Imágenes de Galería
      //Primero colocamos nuestro arreglo de objetos de tipo {path: , url: } a un arreglo que vamos iterar en el html para mostrarlas
      this.atractivo.pathImages?.forEach(obj => {
        this.images.push(obj);
      })

    } //? -> Fin método Llenar Formulario

    //? -> Método para borrar las imágenes del Storage y del objeto que tengo actual (Además: Actualizar la BD por si sólo entro al componente Actualizar borro una imágen y luego me devuelvo)
    actualizarImagenPortada(imgPortada: any) {
      //Primero borramos en Storage (Servicio)
      this.atractivosService.borrarImg(imgPortada);
      //Luego hacemos el borrado en nuestra propiedad this.atractivo (En este componente)
      this.atractivo.pathImagePortada = {path: '', url: ''};
      //Cambiamos el dato de la variable que valida la existéncia de imágen de portada
      this.imgPortadaVal = false;
      //Luego actulizamos los datos de Firestore (Con nuetro this.atractivo, para que queden igual los datos de la BD y los datos del componente)
      this.atractivosService.actualizarAtractivo(this.atractivo);
    }

    //? -> Método para borrar las imágenes del Storage y del objeto que tengo actual (Además: Actualizar la BD por si sólo entro al componente Actualizar borro una imágen y luego me devuelvo)
    //Primero vamos a identificar qué imágenes debemos borrar según el click, en el html (El objeto)
    actualizarImagenesGaleria(image: any, indice: any) {
      //Borramos la imágen seleccionada en el storage
      this.atractivosService.borrarImg(image);
      //Luego borramos las imágenes en el arreglo de objetos que tenemos actualmente (En este componente)
      this.atractivo.pathImages?.splice(indice, 1); //Pasamos la posición del elemento y la cantidad de elementos que quiero borrar
      //Luego borramos las imágenes en el arreglo que se está renderizando en el html (Importante para mostrar el cambio de las imágenes en tiempo real ya que this.atractivo.pathImages y this.images son dos arreglo distintos)
      this.images.splice(indice, 1);
      //this.mostrarElemento = !this.mostrarElemento;
      //Luego actulizamos los datos de Firestore (Con nuetro this.atractivo, para que queden igual los datos de la BD y los datos del componente)
      this.atractivosService.actualizarAtractivo(this.atractivo);
    }

    //? -> Método para editaratractivo
    editarAtractivo() {
      //Creamos el objeto que queremos editar y que vamos a pasar a firebase, lo creamos con los valores que nos da el observable y lo que modificó el usuario en el formulario.
      this.atractivoTuristico = {
        id: this.atractivo.id, // -> No se modifica con el Form
        name: this.createAtractivo.value.nombre,
        bienOLugar: this.createAtractivo.value.bienOLugar,
        descripcion: this.createAtractivo.value.descripcion,
        clima: this.createAtractivo.value.clima,
        zona: this.createAtractivo.value.zona,
        municipio: this.createAtractivo.value.municipio,
        direccionBarrioVereda: this.createAtractivo.value.direccionBarrioVereda,
        indicacionesAcceso: this.createAtractivo.value.indicacionesAcceso,
        googleMaps: this.createAtractivo.value.googleMaps,
        latitud:this.createAtractivo.value.latitud,
        longitud:this.createAtractivo.value.longitud,
        recomendaciones:this.createAtractivo.value.recomendaciones,
        actividades:this.createAtractivo.value.actividades,
        horarioAtencion:this.createAtractivo.value.horarioAtencion,
        administrador: this.createAtractivo.value.administrador,
        contactoAdmin: this.createAtractivo.value.contactoAdmin,
        redSocial: this.createAtractivo.value.redSocial,
        pathImages: this.atractivo.pathImages, // -> No se modifica con el Form
        meGusta: this.atractivo.meGusta, // -> No se modifica con el Form
        pathImagePortada: this.atractivo.pathImagePortada, // -> No se modifica con el Form
      }

      //Utilizamos el servicio con el método de actualizar los datos en Firestore
      this.atractivosService.editarAtractivo(this.atractivoTuristico, this.files, this.portadaFile) //Manejamos la Promesa
      .then(() => {
        //Informamos
        alert('El atractivo fue modificado con éxito');
        //Nos direcciona a la página del Listado
        this.router.navigate(['/dashboard-admin/pagina-inicio/list-atractivo-turistico']);
      })
      .catch(error => console.log(error));

    } //? -> Fin método para Editar atractivo

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
