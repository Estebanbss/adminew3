import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Ruta } from 'src/app/common/place.interface';
import { RutasService } from 'src/app/core/services/rutas.service';

@Component({
  selector: 'app-agregar-rutas',
  templateUrl: './agregar-rutas.component.html',
  styleUrls: ['./agregar-rutas.component.css']
})
export class AgregarRutasComponent implements OnInit {
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

    //? Inyecciones de Dependencias
    constructor(
      private fb: FormBuilder, // Modulo para Formulario - Permite validar el formulario de manera sencilla.
      private rutasService: RutasService, // Servicio con los métodos CRUD para Prestadores
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

      //Inicializamos la propiedad PrestadorTurístico
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

    } //? -> Fin Constructor

    ngOnInit():void {

    }

    //? -> Método para agregar un Prestador en Firestore
    //Aquí se gestionan los datos que se digitan desde el html - Se ejecuta lo que queremos hacer inmediatamente enviemos el Form.
    agregarRuta() {

      this.submitted = true; //Confirmamos que se envió el formulario.

      //Usamos una validación en caso de que el Formulario sea inválido. (Se ve en el status).
      //Es inválido cuando no se han llenado todos los campos
      if(this.createRuta.invalid) {
        return; //Sale del método y no ejecuta nada más.
      }

      //? -> Cambiamos la variable a true para indicar que empieza el proceso lógico con los métodos una vez enviado el form y validandos los valores del form
      this.loading = true;

      //Ahora vamos a inicializar nuestra constante de tipo Object pre-definida en la Interfaz, en este caso PrestadorTuristico
      //El objeto lo vamos a enviar a Firebase para almacenar
      this.ruta = {
        //id -> Nos lo da firebase
        name: this.createRuta.value.nombre,
        informacionAdicional: this.createRuta.value.informacionAdicional,
        agenciaDeViajes: this.createRuta.value.agenciaDeViajes,
        descripcion: this.createRuta.value.descripcion,
        latitud: this.createRuta.value.latitud,
        longitud: this.createRuta.value.longitud,
        googleMaps: this.createRuta.value.googleMaps,
        pathImages: [], // -> lo conseguimos en la inserción de imágenes
        meGusta: 0, // -> # de Me gustas en la App
        pathImagePortada: { // -> lo conseguimos en la inserción de imágenes
          path:'',
          url: ''
        }
      }

      console.log(this.ruta); //Quiero ver lo que mi objeto guardó y se va a mandar a la BD

      //Servicio llamando al método para Agregar Prestador Turístico a Firestore con la galería de imágenes
      this.rutasService.agregarRuta(this.ruta, this.files, this.portadaFile) //DEBO ENVIAR LOS ARCHVOS (imágenes) TAMBIEN y el Proceso de carga de archivos se ejecuta en el servicio
      .then(() => {
        //Mensaje
        alert('El atractivo fue registrado con éxito');
        //El loading pasa a false una vez obtenemos las respuesta a nuestra promesa del método.
        this.loading = false;
        //El router nos direcciona a otro componente
        this.router.navigate(['/dashboard-admin/pagina-inicio/list-rutas-turisticas']);
      })
      .catch((error:any) => {
        console.log(error)
        console.log('Error en la respuesta a la inserción de Datos Firestore')
      })

    } //? -> Fin Método Agregar Prestador

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
