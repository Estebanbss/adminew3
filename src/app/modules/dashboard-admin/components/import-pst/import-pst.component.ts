import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ModalServiceService } from 'src/app/core/services/modal-service.service';
import { PrestadorTuristico } from 'src/app/common/place.interface';
import { PrestadoresService } from 'src/app/core/services/prestadores.service';

@Component({
  selector: 'app-import',
  templateUrl: './import-pst.component.html',
  styleUrls: ['./import-pst.component.css'],


})

export class ImportComponent implements OnInit{

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


  }

  closemodal() {
    this.modalService.setModalSuichPst(false);//cierra el modal
   }

  ngOnInit(): void {



  }


//?->data en crudo formato JSON (esta crudo osea hay que cocinarlo como un pollo asado)
  data:any = [];//almacena el archivo en formato JSON

  //* -> valores de la barra de progreso
  progress:number = 0;//almacena el progreso de la carga del archivo
  mode='determinate'//modo de la barra de progreso
  value:any=0//valor de la barra de progreso

//* ->-----------------------------------------------------------------------

  // ? -> Propiedad para almacenar los archivos antes de cargarlos a la BD
  files: any[] = []; //Presupongo que los archivos son un arreglo de tipo any, no estoy seguro

   // ? -> Propiedad de tipo Object que va a almacenar nuestros datos y se va a pasar a Firestore
   prestadorTuristico: PrestadorTuristico;//almacena los datos del prestador turistico


  //? -> Propiedad para almacenar la imágen de portada antes de cargarla a la BD
  portadaFile: any;

  prestarrays:any=[]


datocurioso(){
  this.prestarrays=[]



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

  this.prestadoresService.agregarPrestadoresImportacion(this.prestarrays)
}

verificar(){
  console.log(this.data)
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

onKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    this.closemodal();
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
    let targetSheetNames = ["pst", "prestadores"];
    workbook.SheetNames.forEach(sheet => {
      if(targetSheetNames.includes(sheet.toLowerCase().trim())) {
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        console.log("Datos de la hoja", sheet, ":", data);
        this.data.push(data);
      }
    });
    console.log("Data final:", this.data); // Muestra el arreglo completo
  }
}

}



