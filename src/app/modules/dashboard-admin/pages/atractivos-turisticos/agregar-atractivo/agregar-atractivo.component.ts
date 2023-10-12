import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AtractivoTuristico } from 'src/app/common/place.interface';
import { AtractivosService } from 'src/app/core/services/atractivos.service';

@Component({
  selector: 'app-agregar-atractivo',
  templateUrl: './agregar-atractivo.component.html',
  styleUrls: ['./agregar-atractivo.component.css']
})
export class AgregarAtractivoComponent implements OnInit {

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

  //? Inyecciones de Dependencias
  constructor(
    private fb: FormBuilder, // Modulo para Formulario - Permite validar el formulario de manera sencilla.
    private atractivosService: AtractivosService, // Servicio con los métodos CRUD para Prestadores
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

    //Inicializamos la propiedad PrestadorTurístico
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
      pathImagePortada: { // -> lo conseguimos en la inserción de imágenes
        path:'',
        url: ''
      }
    }

  } //? -> Fin Constructor

  ngOnInit():void {

  }

  //? -> Método para agregar un Prestador en Firestore
  //Aquí se gestionan los datos que se digitan desde el html - Se ejecuta lo que queremos hacer inmediatamente enviemos el Form.
  agregarAtractivo() {

    this.submitted = true; //Confirmamos que se envió el formulario.

    //Usamos una validación en caso de que el Formulario sea inválido. (Se ve en el status).
    //Es inválido cuando no se han llenado todos los campos
    if(this.createAtractivo.invalid) {
      return; //Sale del método y no ejecuta nada más.
    }

    //? -> Cambiamos la variable a true para indicar que empieza el proceso lógico con los métodos una vez enviado el form y validandos los valores del form
    this.loading = true;

    //Ahora vamos a inicializar nuestra constante de tipo Object pre-definida en la Interfaz, en este caso PrestadorTuristico
    //El objeto lo vamos a enviar a Firebase para almacenar
    this.atractivoTuristico = {
      //id -> Nos lo da firebase
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
      pathImages: [], // -> lo conseguimos en la inserción de imágenes
      meGusta: 0, // -> # de Me gustas en la App
      pathImagePortada: { // -> lo conseguimos en la inserción de imágenes
        path:'',
        url: ''
      }
    }

    console.log(this.atractivoTuristico); //Quiero ver lo que mi objeto guardó y se va a mandar a la BD

    //Servicio llamando al método para Agregar Prestador Turístico a Firestore con la galería de imágenes
    this.atractivosService.agregarAtractivo(this.atractivoTuristico, this.files, this.portadaFile) //DEBO ENVIAR LOS ARCHVOS (imágenes) TAMBIEN y el Proceso de carga de archivos se ejecuta en el servicio
    .then(() => {
      //Mensaje
      alert('El atractivo fue registrado con éxito');
      //El loading pasa a false una vez obtenemos las respuesta a nuestra promesa del método.
      this.loading = false;
      //El router nos direcciona a otro componente
      this.router.navigate(['/dashboard-admin/pagina-inicio/list-atractivo-turistico']);
    })
    .catch((error:any) => {
      console.log(error)
      console.log('Error en la respuesta a la inserción de Datos Firestore')
    })

  } //? -> Fin Método Agregar Prestador

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

} //? -> Fin clase agregarAtractivo
