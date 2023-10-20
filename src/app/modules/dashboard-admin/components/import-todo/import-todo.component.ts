import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ModalServiceService } from 'src/app/core/services/modal-service.service';
import { AtractivoTuristico, Municipio, PrestadorTuristico, Ruta } from 'src/app/common/place.interface';
import { PrestadoresService } from 'src/app/core/services/prestadores.service';


@Component({
  selector: 'app-import-todo',
  templateUrl: './import-todo.component.html',
  styleUrls: ['./import-todo.component.css']
})
export class ImportTodoComponent {
  constructor( private MatProgressBarModule: MatProgressBarModule, private modalService: ModalServiceService,     private prestadoresService: PrestadoresService,) {

    this.prestadorTuristico = {
      //id -> Nos lo da firebase
      name: '',
      rntRm: '',
      descripcion: '',
      servicios: '',
      zona: '',
      municipio: '',
      direccion: '',
      indicacionesAcceso: '',
      googleMaps: '',
      latitud: 0,
      longitud: 0,
      whatsapp: 0,
      celular1: 0,
      celular2: 0,
      facebook: '',
      instagram: '',
      pagWeb: '',
      correo: '',
      horarioAtencion: '',
      alojamientoUrbano:"",
      alojamientoRural: "",
      tiendasDeCafe: "",
      antojosTipicos: "",
      sitioNatural:"",
      patrimonioCultural: "",
      miradores:"",
      parquesNaturales:"",
      agenciasDeViaje:"",
      centroRecreativo:"",
      guiasDeTurismo:"",
      aventura:"",
      agroYEcoturismo:"",
      planesORutas:"",
      artesanias:"",
      transporte:"",
      eventos:"",
      restaurantes:"",
    }

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
      googleMaps: '',
      latitud: 0,
      longitud: 0,
      actividades: '',
      horarioAtencion: '',
      recomendaciones: '',
      administrador: '',
      contactoAdmin : '',
      redSocial: '',

    }


    this.municipio = {
      //id -> Nos lo da firebase
      name: '',
      descripcion: '',
      servicios: '',
      gentilicio: '',
      clima: "",
      zona: '',
      poblacion: '',
      googleMaps: '',
      latitud: 0,
      longitud: 0,
      facebook: '',
      twitter: '',
      youtube: '',
      fiestasEventos: '',
      hechosHistoricos: '',
      instagram: '',
      sitioWeb: '',

    }

    this.ruta = {
      //id -> Nos lo da firebase
      name: '',
      descripcion: '',
      googleMaps: '',
      latitud: 0,
      longitud: 0,
      informacionAdicional: '',
      agenciaDeViajes: '',

    }



  }

  closemodal() {
    this.modalService.setModalSuichTodo(false);//cierra el modal
   }

  ngOnInit(): void {

  }


//?->data en crudo formato JSON (esta crudo osea hay que cocinarlo como un pollo asado)
  data:any = [];//almacena el archivo en formato JSON ROUTES
  data2:any = [];//almacena el archivo en formato JSON PST
  data3:any = [];//almacena el archivo en formato JSON MUNI
  data4:any = [];//almacena el archivo en formato JSON ATRAC

  //* -> valores de la barra de progreso
  progress:number = 0;//almacena el progreso de la carga del archivo
  mode='determinate'//modo de la barra de progreso
  value:any=0//valor de la barra de progreso

//* ->-----------------------------------------------------------------------

  // ? -> Propiedad para almacenar los archivos antes de cargarlos a la BD
  files: any[] = []; //Presupongo que los archivos son un arreglo de tipo any, no estoy seguro

   // ? -> Propiedad de tipo Object que va a almacenar nuestros datos y se va a pasar a Firestore
   prestadorTuristico: PrestadorTuristico;//almacena los datos del prestador turistico
   atractivoTuristico: AtractivoTuristico;//almacena los datos del atractivo turistico
   municipio: Municipio;//almacena los datos del  municipio
   ruta: Ruta;//almacena los datos de la ruta
  //? -> Propiedad para almacenar la imágen de portada antes de cargarla a la BD
  portadaFile: any;

  prestarrays:any=[]
  prestarrays2:any=[]
  prestarrays3:any=[]
  prestarrays4:any=[]


datocurioso(){
  console.log(this.data)
  console.log(this.data[0])
  console.log(this.data2[0])
  console.log(this.data3[0])
  console.log(this.data4[0])
  this.prestarrays=[]
  this.prestarrays2=[]
  this.prestarrays3=[]
  this.prestarrays4=[]


  for (let index = 0; index < this.data[0].length; index++) {
    this.prestadorTuristico = {
      //id -> Nos lo da firebase
      name: this.data[0][index].name === undefined  ? '--' : this.data[0][index].name,
      rntRm: this.data[0][index].rntRm === undefined  ? '--' : this.data[0][index].rntRm,
      descripcion: this.data[0][index].descripcion === undefined  ? '--' : this.data[0][index].descripcion,
      servicios: this.data[0][index].servicios === undefined  ? '--' : this.data[0][index].servicios,
      zona: this.data[0][index].zona === undefined  ? '--' : this.data[0][index].zona,
      municipio: this.data[0][index].municipio === undefined  ? '--' : this.data[0][index].municipio,
      direccion: this.data[0][index].direccion === undefined  ? '--' : this.data[0][index].direccion,
      indicacionesAcceso: this.data[0][index].indicacionesAcceso === undefined  ? '--' : this.data[0][index].indicacionesAcceso,
      googleMaps: this.data[0][index].googleMaps === undefined  ? '--' : this.data[0][index].googleMaps,
      latitud:this.data[0][index].latitud === undefined  ? 0 : this.data[0][index].latitud,
      longitud:this.data[0][index].longitud === undefined  ? 0 : (this.data[0][index].longitud)*-1,
      whatsapp:this.data[0][index].whatsapp === undefined  ? 0 : this.procesarValor(this.data[0][index].whatsapp),
      celular1:this.data[0][index].celular1 === undefined  ? 0 : this.procesarValor(this.data[0][index].celular1),
      celular2:this.data[0][index].celular2 === undefined  ? 0 : this.procesarValor(this.data[0][index].celular2),
      facebook: this.data[0][index].facebook === undefined  ? '--' : this.data[0][index].facebook,
      instagram: this.data[0][index].instagram === undefined  ? '--' : this.data[0][index].instagram,
      pagWeb: this.data[0][index].pagWeb === undefined  ? '--' : this.data[0][index].pagWeb,
      correo: this.data[0][index].correo === undefined  ? '--' : this.data[0][index].correo,
      horarioAtencion: this.data[0][index].horarioAtencion === undefined  ? '--' : this.data[0][index].horarioAtencion,
      alojamientoUrbano:this.data[0][index].alojamientoUrbano === undefined  ? '--' : this.data[0][index].alojamientoUrbano,
      alojamientoRural: this.data[0][index].alojamientoRural === undefined  ? '--' : this.data[0][index].alojamientoRural,
      tiendasDeCafe: this.data[0][index].tiendasDeCafe === undefined  ? '--' : this.data[0][index].tiendasDeCafe,
      antojosTipicos:this.data[0][index].antojosTipicos === undefined  ? '--' : this.data[0][index].antojosTipicos,
      sitioNatural:this.data[0][index].sitioNatural === undefined  ? '--' : this.data[0][index].sitioNatural,
      patrimonioCultural: this.data[0][index].patrimonioCultural === undefined  ? '--' : this.data[0][index].patrimonioCultural,
      miradores: this.data[0][index].miradores === undefined  ? '--' : this.data[0][index].miradores,
      parquesNaturales: this.data[0][index].parquesNaturales === undefined  ? '--' : this.data[0][index].parquesNaturales,
      agenciasDeViaje: this.data[0][index].agenciasDeViaje === undefined  ? '--' : this.data[0][index].agenciasDeViaje,
      centroRecreativo:this.data[0][index].centroRecreativo === undefined  ? '--' : this.data[0][index].centroRecreativo,
      guiasDeTurismo:this.data[0][index].guiasDeTurismo === undefined  ? '--' : this.data[0][index].guiasDeTurismo,
      aventura: this.data[0][index].aventura === undefined  ? '--' : this.data[0][index].aventura,
      agroYEcoturismo: this.data[0][index].agroYEcoturismo === undefined  ? '--' : this.data[0][index].agroYEcoturismo,
      planesORutas: this.data[0][index].planesORutas === undefined  ? '--' : this.data[0][index].planesORutas,
      artesanias: this.data[0][index].artesanias === undefined  ? '--' : this.data[0][index].artesanias,
      transporte: this.data[0][index].transporte === undefined  ? '--' : this.data[0][index].transporte,
      eventos: this.data[0][index].eventos === undefined  ? '--' : this.data[0][index].eventos,
      restaurantes: this.data[0][index].restaurantes === undefined  ? '--' : this.data[0][index].restaurantes,
    }
    this.prestarrays.push(this.prestadorTuristico)
  }

  for (let index = 0; index < this.data2[0].length; index++) {
    this.atractivoTuristico = {
      //id -> Nos lo da firebase
      name: this.data2[0][index].name === undefined  ? '--' : this.data2[0][index].name,
      bienOLugar: this.data2[0][index].bienOLugar === undefined  ? '--' : this.data2[0][index].bienOLugar,
      descripcion: this.data2[0][index].descripcion === undefined  ? '--' : this.data2[0][index].descripcion,
      clima: this.data2[0][index].clima === undefined  ? '--' : this.data2[0][index].clima,
      zona: this.data2[0][index].zona === undefined  ? '--' : this.data2[0][index].zona,
      municipio: this.data2[0][index].municipio === undefined  ? '--' : this.data2[0][index].municipio,
      direccionBarrioVereda: this.data2[0][index].direccionBarrioVereda === undefined  ? '--' : this.data2[0][index].direccionBarrioVereda,
      indicacionesAcceso: this.data2[0][index].indicacionesAcceso === undefined  ? '--' : this.data2[0][index].indicacionesAcceso,
      googleMaps: this.data2[0][index].googleMaps === undefined  ? '--' : this.data2[0][index].googleMaps,
      latitud: this.data2[0][index].latitud === undefined  ? 0 : this.data2[0][index].latitud,
      longitud: this.data2[0][index].longitud === undefined  ? 0 : (this.data2[0][index].longitud)*-1,
      actividades: this.data2[0][index].actividades === undefined  ? '--' : this.data2[0][index].actividades,
      horarioAtencion: this.data2[0][index].horarioAtencion === undefined  ? '--' : this.data2[0][index].horarioAtencion,
      recomendaciones: this.data2[0][index].recomendaciones === undefined  ? '--' : this.data2[0][index].recomendaciones,
      administrador: this.data2[0][index].administrador === undefined  ? '--' : this.data2[0][index].administrador,
      contactoAdmin : this.data2[0][index].contactoAdmin === undefined  ? '--' : this.data2[0][index].contactoAdmin,
      redSocial: this.data2[0][index].redSocial === undefined  ? '--' : this.data2[0][index].redSocial,
   }
   this.prestarrays2.push(this.atractivoTuristico)
  }

  for (let index = 0; index < this.data3[0].length; index++) {
   this.municipio = {
    //id -> Nos lo da firebase
    name: this.data3[0][index].name === undefined  ? '--' : this.data3[0][index].name,
    descripcion: this.data3[0][index].descripcion === undefined  ? '--' : this.data3[0][index].descripcion,
    servicios: this.data3[0][index].servicios === undefined  ? '--' : this.data3[0][index].servicios,
    gentilicio: this.data3[0][index].gentilicio === undefined  ? '--' : this.data3[0][index].gentilicio,
    clima: this.data3[0][index].clima === undefined  ? '--' : this.data3[0][index].clima,
    zona: this.data3[0][index].zona === undefined  ? '--' : this.data3[0][index].zona,
    poblacion: this.data3[0][index].poblacion === undefined  ? '--' : this.data3[0][index].poblacion,
    googleMaps: this.data3[0][index].googleMaps === undefined  ? '--' : this.data3[0][index].googleMaps,
    latitud: this.data3[0][index].latitud === undefined  ? 0 : this.data3[0][index].latitud,
    longitud: this.data3[0][index].longitud === undefined  ? 0 : (this.data3[0][index].longitud)*-1,
    facebook: this.data3[0][index].facebook === undefined  ? '--' : this.data3[0][index].facebook,
    twitter: this.data3[0][index].twitter === undefined  ? '--' : this.data3[0][index].twitter,
    youtube: this.data3[0][index].youtube === undefined  ? '--' : this.data3[0][index].youtube,
    fiestasEventos: this.data3[0][index].fiestasEventos === undefined  ? '--' : this.data3[0][index].fiestasEventos,
    hechosHistoricos: this.data3[0][index].hechosHistoricos === undefined  ? '--' : this.data3[0][index].hechosHistoricos,
    instagram: this.data3[0][index].instagram === undefined  ? '--' : this.data3[0][index].instagram,
    sitioWeb: this.data3[0][index].sitioWeb === undefined  ? '--' : this.data3[0][index].sitioWeb,
  }
  this.prestarrays3.push(this.municipio)
}

for (let index = 0; index < this.data4[0].length; index++) {
  this.ruta = {
    //id -> Nos lo da firebase
    name: this.data4[0][index].name === undefined  ? '--' : this.data4[0][index].name,
    descripcion: this.data4[0][index].descripcion === undefined  ? '--' : this.data4[0][index].descripcion,
    googleMaps: this.data4[0][index].googleMaps === undefined  ? '--' : this.data4[0][index].googleMaps,
    latitud: this.data4[0][index].latitud === undefined  ? 0 : this.data4[0][index].latitud,
    longitud: this.data4[0][index].longitud === undefined  ? 0: (this.data4[0][index].longitud)*-1,
    informacionAdicional: this.data4[0][index].informacionAdicional === undefined  ? '--' : this.data4[0][index].informacionAdicional,
    agenciaDeViajes: this.data4[0][index].agenciaDeViajes === undefined  ? '--' : this.data4[0][index].agenciaDeViajes,
  }
  this.prestarrays4.push(this.ruta)
}


  this.prestadoresService.agregarPrestadoresImportacion(this.prestarrays)
  this.prestadoresService.agregarAtractivoImportacion(this.prestarrays2)
  this.prestadoresService.agregarMunicipioImportacion(this.prestarrays3)
  this.prestadoresService.agregarRutasImportacion(this.prestarrays4)
  this.closemodal()
  alert("ya 👍")
}

procesarValor(valor: any): number {
  if (valor === undefined) {
    return 0;
  }

  const valorSinEspacios = String(valor).replace(/\s+/g, '');

  const valorComoNumero = parseInt(valorSinEspacios, 10);

  if (!isNaN(valorComoNumero)) {
    return valorComoNumero;
  } else {
    return 0;
  }
}


//? Método para subir el archivo
fileUpload(event:any) {
  this.progress = 0;
  const selectedFile = event.target.files[0];
  const fileReader = new FileReader();

  fileReader.readAsBinaryString(selectedFile);
  fileReader.onprogress = (event) => {
    this.progress = Math.round((event.loaded / event.total) * 100);
    this.value = this.progress;
    console.log(`Progress: ${this.progress}%`);
  };

  fileReader.onload = (event) => {
    let binaryData = event.target?.result;
    let workbook = XLSX.read(binaryData, {type: 'binary'});
    console.log("SheetNames del archivo:", workbook.SheetNames); // Lista todas las hojas
    let targetSheetNamesRoutes = ["rutas", "routes", "roots", "rutasturisticas"];
    let targetSheetNamesPST = ["pst", "prestadores"];
    let targetSheetNamesMUNI = ["municipio", "muni", "municipios"];
    let targetSheetNamesATRAC = ["atractivo", "atractivos", "atrac",];

    workbook.SheetNames.forEach(sheet => {


      if(targetSheetNamesRoutes.includes(sheet.toLowerCase().trim())) {
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        console.log("Datos de la hoja RUTAS", sheet, ":", data);
        this.data4.push(data);
      }

      else if (targetSheetNamesPST.includes(sheet.toLowerCase().trim())){
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        console.log("Datos de la hoja PRESTADORES", sheet, ":", data);
        this.data.push(data);
      }

      else if (targetSheetNamesMUNI.includes(sheet.toLowerCase().trim())){
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        console.log("Datos de la hoja MUNICIPIOS", sheet, ":", data);
        this.data3.push(data);
      }

      else if (targetSheetNamesATRAC.includes(sheet.toLowerCase().trim())){
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        console.log("Datos de la hoja ATRACTIVOS", sheet, ":", data);
        this.data2.push(data);
      }




    });
    console.log("Data final PRESTADORES:", this.data); // Muestra el arreglo completo
    console.log("Data final ATRACTIVOS:", this.data2); // Muestra el arreglo completo
    console.log("Data final MUNICIPIOS:", this.data3); // Muestra el arreglo completo
    console.log("Data final RUTAS:", this.data4); // Muestra el arreglo completo
  }
}
}
