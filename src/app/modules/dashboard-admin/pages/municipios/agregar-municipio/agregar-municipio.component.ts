import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Municipio } from 'src/app/common/place.interface';
import { MunicipiosService } from 'src/app/core/services/municipios.service';

@Component({
  selector: 'app-agregar-municipio',
  templateUrl: './agregar-municipio.component.html',
  styleUrls: ['./agregar-municipio.component.css']
})
export class AgregarMunicipioComponent implements OnInit{

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

    //? Inyecciones de Dependencias
    constructor(
      private fb: FormBuilder, // Modulo para Formulario - Permite validar el formulario de manera sencilla.
      private municipioService: MunicipiosService, // Servicio con los métodos CRUD para Prestadores
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

      //Inicializamos la propiedad PrestadorTurístico
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
    agregarMunicipio() {

      this.submitted = true; //Confirmamos que se envió el formulario.

      //Usamos una validación en caso de que el Formulario sea inválido. (Se ve en el status).
      //Es inválido cuando no se han llenado todos los campos
      if(this.createMunicipio.invalid) {
        return; //Sale del método y no ejecuta nada más.
      }

      //? -> Cambiamos la variable a true para indicar que empieza el proceso lógico con los métodos una vez enviado el form y validandos los valores del form
      this.loading = true;

      //Ahora vamos a inicializar nuestra constante de tipo Object pre-definida en la Interfaz, en este caso PrestadorTuristico
      //El objeto lo vamos a enviar a Firebase para almacenar
      this.municipio = {
        //id -> Nos lo da firebase
        name: this.createMunicipio.value.nombre,
        zona: this.createMunicipio.value.zona,
        descripcion: this.createMunicipio.value.descripcion,
        poblacion: this.createMunicipio.value.poblacion,
        gentilicio: this.createMunicipio.value.gentilicio,
        clima: this.createMunicipio.value.clima,
        servicios: this.createMunicipio.value.servicios,
        fiestasEventos: this.createMunicipio.value.fiestasEventos,
        hechosHistoricos: this.createMunicipio.value.hechosHistoricos,
        sitioWeb:this.createMunicipio.value.sitioWeb,
        facebook:this.createMunicipio.value.facebook,
        instagram:this.createMunicipio.value.instagram,
        twitter:this.createMunicipio.value.twitter,
        youtube:this.createMunicipio.value.youtube,
        latitud: this.createMunicipio.value.latitud,
        longitud: this.createMunicipio.value.longitud,
        googleMaps: this.createMunicipio.value.googleMaps,
        pathImages: [], // -> lo conseguimos en la inserción de imágenes
        meGusta: 0, // -> # de Me gustas en la App
        pathImagePortada: { // -> lo conseguimos en la inserción de imágenes
          path:'',
          url: ''
        }
      }

      console.log(this.municipio); //Quiero ver lo que mi objeto guardó y se va a mandar a la BD

      //Servicio llamando al método para Agregar Prestador Turístico a Firestore con la galería de imágenes
      this.municipioService.agregarMunicipio(this.municipio, this.files, this.portadaFile) //DEBO ENVIAR LOS ARCHVOS (imágenes) TAMBIEN y el Proceso de carga de archivos se ejecuta en el servicio
      .then(() => {
        //Mensaje
        alert('El municipio fue registrado con éxito');
        //El loading pasa a false una vez obtenemos las respuesta a nuestra promesa del método.
        this.loading = false;
        //El router nos direcciona a otro componente
        this.router.navigate(['/dashboard-admin/pagina-inicio/list-municipio']);
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
