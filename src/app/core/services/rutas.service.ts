import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import {
  Storage,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { Ruta } from 'src/app/common/place.interface';

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  //? Observable con el que compartimos información para editar un elemento de List a Editar
  private sharingDataRuta: BehaviorSubject<Ruta> =
    new BehaviorSubject<Ruta>({
      id: '', // -> Nos lo crea Firebase
      name: '',
      informacionAdicional: '',
      agenciaDeViajes: '',
      descripcion: '',
      latitud: 0,
      longitud: 0,
      googleMaps: '',
      pathImages: [], // -> lo conseguimos en la inserción de imágenes
      meGusta: 0, // -> # de Me gustas en la App
      pathImagePortada: {
        // -> lo conseguimos en la inserción de imágenes
        path: '',
        url: '',
      }
    });

  //? -> Inyecciones de Dependencias
  //Inyección de servicios Firebase
  constructor(
    private firestore: Firestore, //Inyectamos el servicio de Firestore
    private storage: Storage //Inyectamos el servicio de Storage
  ) {
    //Aquí inicializamos nuestras propiedades de la clase
  }

  //? SECCIÓN COMPARTIR INFORMACIÓN

  //? Métodos para compartir información entre componentes por Observable

  //? Nos suscribimos a éste método para obtener los datos que tiene el observable
  get sharingRuta() {
    return this.sharingDataRuta.asObservable();
  }

  //? Cambiamos la Información al observable
  set editRutaData(newValue: Ruta) {
    this.sharingDataRuta.next(newValue);
  }

  //? SECCIÓN AGREGAR

  //? Método para generar los empleados e insertarlos en la base de datos
  //Create - C
  agregarRuta(ruta: any, files: any, portadaFile: any): Promise<any> {
    //? Propiedad Array de Promesas para los path
    const arregloDePromesas: Promise<any>[] = []; //Lo utilizamos para guardar nuestras promesas en la carga de archivos al servicio storage y asegurarnos que se cumplan todas para poder trabajar con ellas sin problema.

    //? Propiedad para almacenar los paths
    const arrayPaths: any = [];

    //? Array de Promesas para url imágenes
    const urlPromesa: Promise<any>[] = [];

    //? Constante para almacenar la Imágnen Principal
    const promiseImgPrinc: Promise<any>[] = [];

    //? -> Deberíamos ejecutar la carga de archivos antes de guardar los datos en la BD para que se guarde el arreglo de paths de las Imágenes de una vez en Firestore.
    //Hacer una validación para ejecutar el código si hay Archivos para cargar, de otra forma no es necesario

    if (!(files.length === 0)) {
      //console.log('Exísten archivos a cargar');

      //Creamos una referencia al sitio de firebase
      //En la referencia se coloca el servicio y el path donde queremos guardar, aún si el path no exíste se puede declarar

      //? Creamos una forma para cargar todo el arreglo
      //Utilizamos un ciclo for para recorrer el arreglo e insertar archivo por archivo adquiriendo su referencia
      for (let file of files) {
        //Creamos la referencia para guardar en Storage
        const imgRef = ref(
          this.storage,
          `rutasStorage/${ruta.name}/${file.name}`
        );

        //? Procedemos a insertar las imágenes una a una en el Storage con el método uploadBytes y guardamos las respuestas en un arreglo de Promesas
        //Creamos un arreglo de promesas con lo que nos devuelve el método uploadBytes
        arregloDePromesas.push(uploadBytes(imgRef, file)); //Método para subir los archivos y retorna Promesas
      } //Fin del for

      //? Necesitamos los datos que dan las respuestas a las promesas de la carga de Imágenes, por eso gestionamos todo con un Promise.all para obtenerlas
      //Utilizamos un Promise all para asegurarnos de que el código no avanza hasta que todas las promesas se cumplan
      Promise.all(arregloDePromesas)
        .then((resultados) => {
          //Nos retorna un arreglo con las respuestas de las promesas
          //Procedemos a iterar para trabajar con cada resultado y obtener el o los path que queremos guardar
          for (let resultado of resultados) {
            // console.log(resultado);
            const fullPath = resultado.metadata.fullPath;
            // console.log(fullPath);
            //ruta.pathImages.push(fullPath); //Guardamos los Paths en nuestro arreglo pathImages
            arrayPaths.push(fullPath); //Tenemos un arreglo con todos los paths a las imágenes que vamos a recuperar
          }

          //Vamos a recorrer el arreglo de arrayPaths para traer las URL de descarga de cada referencia y luego encerrar el resultado en un objeto
          arrayPaths.forEach((path: any) => {
            // Creamos una referencia a las imágenes que deseamos descargar
            const pathReference = ref(this.storage, path);
            // Hacemos la solicitud a Storage de las Url para descargar las imágenes
            urlPromesa.push(getDownloadURL(pathReference));
          });

          Promise.all(urlPromesa)
            .then((results) => {
              for (let [indice, result] of results.entries()) {
                //Se está guardando el path y la url que obtenemos de la última promesa
                ruta.pathImages.push({
                  path: arrayPaths[indice],
                  url: result,
                });
              }

              //? -> Código para subir imágen Principal
              if (!(portadaFile === undefined)) {
                //Creamos la referencia a la dirección donde vamos a cargar la imágen en el Storage
                const imgRef = ref(
                  this.storage,
                  `rutasStorage/${ruta.name}/ImagenPrincipal/${portadaFile.name}`
                );

                promiseImgPrinc.push(uploadBytes(imgRef, portadaFile)); // Insertamos la promesa en la constante

                //Utilizamos el Promise.all para que el código espere la respuesta de las promesas antes de seguir ejecutandose
                Promise.all(promiseImgPrinc)
                  .then((resultados) => {
                    const resultado = resultados[0];
                    const path = resultado.metadata.fullPath;
                    const pathReference = ref(this.storage, path);
                    getDownloadURL(pathReference)
                      .then((url) => {
                        ruta.pathImagePortada.path = path;
                        ruta.pathImagePortada.url = url;
                        //? CARGA DE DATOS A FIRESTORE
                        //Creamos una referencia a la colleción
                        const rutaRef = collection(
                          this.firestore,
                          'rutas'
                        ); // Servicio y nombre de la colección
                        //Añadimos en un documento la referencia y los datos que lo componen
                        return addDoc(rutaRef, ruta); // Retorna una Promesa
                      })
                      .catch((error) => console.log('Error: ', error));
                  })
                  .catch((error) => console.log(error));
              } else {
                //? Si no hay archivos para cargar en Imágen Principal pero sí en Galería
                //? CARGA DE DATOS A FIRESTORE
                //Creamos una referencia a la colleción
                const rutaRef = collection(this.firestore, 'rutas'); // Servicio y nombre de la colección
                //Añadimos en un documento la referencia y los datos que lo componen
                return addDoc(rutaRef, ruta); // Retorna una Promesa
              } //? -> Fin para subir imágen Principal

              return; //? Retornamos por petición de la función un undefined
            })
            .catch((error) => {
              console.log(error);
              console.log('Error en el arreglo de Promesas de getDownload');
            }); //? Fin del Promise.all
        })
        .catch((error) => {
          console.log(error);
          console.log('Error en el arreglo de Promesas de uploadBytes');
        }); //? Fin del Promise.all
    } else {
      //? Si no hay archivos para cargar en Galería

      //? -> Código para subir imágen Principal
      if (!(portadaFile === undefined)) {
        //Creamos la referencia a la dirección donde vamos a cargar la imágen en el Storage
        const imgRef = ref(
          this.storage,
          `rutasStorage/${ruta.name}/ImagenPrincipal/${portadaFile.name}`
        );

        promiseImgPrinc.push(uploadBytes(imgRef, portadaFile)); // Insertamos la promesa en la constante

        //Utilizamos el Promise.all para que el código espere la respuesta de las promesas antes de seguir ejecutandose
        Promise.all(promiseImgPrinc)
          .then((resultados) => {
            const resultado = resultados[0];
            const path = resultado.metadata.fullPath;
            const pathReference = ref(this.storage, path);
            getDownloadURL(pathReference)
              .then((url) => {
                ruta.pathImagePortada.path = path;
                ruta.pathImagePortada.url = url;
                //? CARGA DE DATOS A FIRESTORE
                //Creamos una referencia a la colleción
                const rutaRef = collection(this.firestore, 'rutas'); // Servicio y nombre de la colección
                //Añadimos en un documento la referencia y los datos que lo componen
                return addDoc(rutaRef, ruta); // Retorna una Promesa
              })
              .catch((error) => console.log('Error: ', error));
          })
          .catch((error) => console.log(error));
      } else {
        //? Si no hay archivos para cargar en Galería y en Imágen Principal
        //? CARGA DE DATOS A FIRESTORE
        //Creamos una referencia a la colleción
        const rutaRef = collection(this.firestore, 'rutas'); // Servicio y nombre de la colección
        //Añadimos en un documento la referencia y los datos que lo componen
        return addDoc(rutaRef, ruta); // Retorna una Promesa
      } //? -> Fin para subir imágen Principal
    } //? -> Fin de la validación para carga de imágenes

    //? Código ChatGpt para solucionar return
    // Añadimos una declaración de retorno al final de la función
    return Promise.resolve(); // Puedes utilizar cualquier promesa vacía aquí
  } //? Fin método agregar ruta

  //? SECCIÓN LEER

  //? -> Creamos un método para obtener los datos de una colección
  //Read - R
  obtenerrutas(): Observable<Ruta[]> {
    // Creamos una referencia a la colección de la que queremos recibir los datos
    const rutaRef = collection(this.firestore, 'rutas'); // Servicio y nombre de la colección

    //Ordenamos los datos que queremos traer de la colleción usando orderBy y limit en un query
    //El query nos sirve para organizar los datos que queremos traer de la BD
    const q = query(rutaRef, orderBy('name', 'asc'));

    //Retornamos el observable que nos devuelve una función anónima a la que nos debemos suscribir y en la que recibimos los datos solicitados de la colección
    return collectionData(q, { idField: 'id' }) as Observable<
      Ruta[]
    >;
  } //? -> Fin del método obtener Prestador

  //? SECCIÓN BORRAR

  //? -> Método para eliminar datos de la BD
  //Delete - D
  //Aquí podemos elegir pasar como parámetro el objeto entero con todos los elementos ó sólo el elemento con el que queremos crear la referencia para borrar
  //En este caso pasamos el objeto con todos los elementos
  //? Aquí borramos los datos de Firestore para la opción de borrado en el Listado
  borrarruta(ruta: any): Promise<any> {
    //Creamos la referencia al documento que queremos borrar
    const docRef = doc(this.firestore, `rutas/${ruta.id}`); // Borramos por id
    return deleteDoc(docRef); // Nos retorna una promesa
  } //? Fin método eleminar ruta para la opción de borrado en el Listado

  //? Aquí borramos los datos de Storage para la opción de borrado en el Listado
  borrarImagenesruta(ruta: any) {
    //Primero capturamos los datos de path y arreglo de objetos con el path de las imágenes para borrarlas del Storage
    const pathImgPrincipal = ruta.pathImagePortada.path; //path para borrar imagen portada
    const arrayPathImages = ruta.pathImages; // arreglo de Objetos de tipo PathImage

    // Tenemos que hacer validación de si exíste algo qué borrar, ya que si se borra la imágen Principal en la actualización y se trata de borra todo el objeto en el listado y no exíste path entonces nos dispara un error y no nos deja borrar el elemento.

    //Primero borramos la imágen de portada
    // Validación para borrar imágenes Principales
    if (!(pathImgPrincipal === '')) {
      //Creamos una referencia a la imágen que deseamos borrar
      const refImgPrincipal = ref(this.storage, pathImgPrincipal);
      //Invocamos al método de firebase para eliminar datos del storage
      deleteObject(refImgPrincipal)
        .then(() => {
          console.log('Se ha borrado la img Principal de: ', ruta.name);
        })
        .catch((error) => {
          console.log('Error al borrar la img Principal: ', error);
        });
      // console.log('Tiene imágen Principal');
      // console.log(pathImgPrincipal);
    } else {
      console.log('No tiene imágen Principal');
      console.log(pathImgPrincipal);
    }

    //Luego borramos las imágenes de la galería en un for
    // Validación para borrar imágenes de Galería
    if (!(arrayPathImages.length === 0)) {
      //Iteramos el arreglo de objetos para acceder a la propiedad del path y eliminar las imágenes
      arrayPathImages.forEach((pathImage: any) => {
        //console.log(pathImage.path);
        //Creamos la referencia
        const refGaleriaImg = ref(this.storage, pathImage.path);
        deleteObject(refGaleriaImg)
          .then(() => {
            console.log('Se ha borrado la img Galeria');
          })
          .catch((error) => {
            console.log('Error al borrar imgs Galería', error);
          });
      });
    } else {
      console.log('El arreglo NO tiene elementos');
      console.log(arrayPathImages);
    }
  } //? -> Fin de Borrar los datos en el Storage para la opción de borrado en el Listado

  //? -> Método para borrar los datos del Storage para las imágenes en el componente Actualizar
  borrarImg(imgABorrar: any) {
    //Primero capturamos el dato del path del objeto para borrar la imágen del Storage
    const pathImg = imgABorrar.path;
    //Creamos una referencia a la imágen que deseamos borrar
    const refImg = ref(this.storage, pathImg);
    //Invocamos al método de firebase para eliminar datos del storage
    deleteObject(refImg)
      .then(() => {
        console.log('Se ha borrado la Imágen');
      })
      .catch((error) => {
        console.log('Error al borrar la Imágen: ', error);
      });
  }

  //? SECCIÓN ACTUALIZAR

  //? -> Actualizamos los datos del ruta una vez se haga el borrado de Img
  actualizarruta(ruta: any) {
    //Primero creamos una referencia al documento que queremos actualizar
    const docRef = doc(this.firestore, `rutas/${ruta.id}`); //Actualizamos por id
    updateDoc(docRef, ruta)
      .then(() => {
        console.log('Se actualizó la información de Firestore');
      })
      .catch((error) => console.log('Error', error));
  }

  //? Método para generar los empleados e insertarlos en la base de datos
  //Update - U
  editarruta(ruta: any, files: any, portadaFile: any): Promise<any> {
    //? Propiedad Array de Promesas para los path
    const arregloDePromesas: Promise<any>[] = []; //Lo utilizamos para guardar nuestras promesas en la carga de archivos al servicio storage y asegurarnos que se cumplan todas para poder trabajar con ellas sin problema.

    //? Propiedad para almacenar los paths
    const arrayPaths: any = [];

    //? Array de Promesas para url imágenes
    const urlPromesa: Promise<any>[] = [];

    //? Constante para almacenar la Imágnen Principal
    const promiseImgPrinc: Promise<any>[] = [];

    //? -> Deberíamos ejecutar la carga de archivos antes de guardar los datos en la BD para que se guarde el arreglo de paths de las Imágenes de una vez en Firestore.
    //Hacer una validación para ejecutar el código si hay Archivos para cargar, de otra forma no es necesario

    if (!(files.length === 0)) {
      //console.log('Exísten archivos a cargar');

      //Creamos una referencia al sitio de firebase
      //En la referencia se coloca el servicio y el path donde queremos guardar, aún si el path no exíste se puede declarar

      //? Creamos una forma para cargar todo el arreglo
      //Utilizamos un ciclo for para recorrer el arreglo e insertar archivo por archivo adquiriendo su referencia
      for (let file of files) {
        //Creamos la referencia para guardar en Storage
        const imgRef = ref(
          this.storage,
          `rutasStorage/${ruta.name}/${file.name}`
        );

        //? Procedemos a insertar las imágenes una a una en el Storage con el método uploadBytes y guardamos las respuestas en un arreglo de Promesas
        //Creamos un arreglo de promesas con lo que nos devuelve el método uploadBytes
        arregloDePromesas.push(uploadBytes(imgRef, file)); //Método para subir los archivos y retorna Promesas
      } //Fin del for

      //? Necesitamos los datos que dan las respuestas a las promesas de la carga de Imágenes, por eso gestionamos todo con un Promise.all para obtenerlas
      //Utilizamos un Promise all para asegurarnos de que el código no avanza hasta que todas las promesas se cumplan
      Promise.all(arregloDePromesas)
        .then((resultados) => {
          //Nos retorna un arreglo con las respuestas de las promesas
          //Procedemos a iterar para trabajar con cada resultado y obtener el o los path que queremos guardar
          for (let resultado of resultados) {
            // console.log(resultado);
            const fullPath = resultado.metadata.fullPath;
            // console.log(fullPath);
            //ruta.pathImages.push(fullPath); //Guardamos los Paths en nuestro arreglo pathImages
            arrayPaths.push(fullPath); //Tenemos un arreglo con todos los paths a las imágenes que vamos a recuperar
          }

          //Vamos a recorrer el arreglo de arrayPaths para traer las URL de descarga de cada referencia y luego encerrar el resultado en un objeto
          arrayPaths.forEach((path: any) => {
            // Creamos una referencia a las imágenes que deseamos descargar
            const pathReference = ref(this.storage, path);
            // Hacemos la solicitud a Storage de las Url para descargar las imágenes
            urlPromesa.push(getDownloadURL(pathReference));
          });

          Promise.all(urlPromesa)
            .then((results) => {
              for (let [indice, result] of results.entries()) {
                //Se está guardando el path y la url que obtenemos de la última promesa
                ruta.pathImages.push({
                  path: arrayPaths[indice],
                  url: result,
                });
              }

              //? -> Código para subir imágen Principal
              if (!(portadaFile === undefined)) {
                //Creamos la referencia a la dirección donde vamos a cargar la imágen en el Storage
                const imgRef = ref(
                  this.storage,
                  `rutasStorage/${ruta.name}/ImagenPrincipal/${portadaFile.name}`
                );

                promiseImgPrinc.push(uploadBytes(imgRef, portadaFile)); // Insertamos la promesa en la constante

                //Utilizamos el Promise.all para que el código espere la respuesta de las promesas antes de seguir ejecutandose
                Promise.all(promiseImgPrinc)
                  .then((resultados) => {
                    const resultado = resultados[0];
                    const path = resultado.metadata.fullPath;
                    const pathReference = ref(this.storage, path);
                    getDownloadURL(pathReference)
                      .then((url) => {
                        ruta.pathImagePortada.path = path;
                        ruta.pathImagePortada.url = url;
                        //? ACTUALIZACIÓN DE DATOS EN FIRESTORE
                        //Primero creamos una referencia al documento que queremos actualizar
                        const docRef = doc(
                          this.firestore,
                          `rutas/${ruta.id}`
                        ); //Actualizamos por id
                        updateDoc(docRef, ruta)
                          .then(() => {
                            console.log(
                              'Se actualizó la información de Firestore'
                            );
                          })
                          .catch((error) => console.log('Error', error));
                      })
                      .catch((error) => console.log('Error: ', error));
                  })
                  .catch((error) => console.log(error));
              } else {
                //? Si no hay archivos para cargar en Imágen Principal pero sí en Galería
                //? ACTUALIZACIÓN DE DATOS EN FIRESTORE
                //Primero creamos una referencia al documento que queremos actualizar
                const docRef = doc(
                  this.firestore,
                  `rutas/${ruta.id}`
                ); //Actualizamos por id
                updateDoc(docRef, ruta)
                  .then(() => {
                    console.log('Se actualizó la información de Firestore');
                  })
                  .catch((error) => console.log('Error', error));
              } //? -> Fin para subir imágen Principal

              return; //? Retornamos por petición de la función un undefined
            })
            .catch((error) => {
              console.log(error);
              console.log('Error en el arreglo de Promesas de getDownload');
            }); //? Fin del Promise.all
        })
        .catch((error) => {
          console.log(error);
          console.log('Error en el arreglo de Promesas de uploadBytes');
        }); //? Fin del Promise.all
    } else {
      //? Si no hay archivos para cargar en Galería

      //? -> Código para subir imágen Principal
      if (!(portadaFile === undefined)) {
        //Creamos la referencia a la dirección donde vamos a cargar la imágen en el Storage
        const imgRef = ref(
          this.storage,
          `rutasStorage/${ruta.name}/ImagenPrincipal/${portadaFile.name}`
        );

        promiseImgPrinc.push(uploadBytes(imgRef, portadaFile)); // Insertamos la promesa en la constante

        //Utilizamos el Promise.all para que el código espere la respuesta de las promesas antes de seguir ejecutandose
        Promise.all(promiseImgPrinc)
          .then((resultados) => {
            const resultado = resultados[0];
            const path = resultado.metadata.fullPath;
            const pathReference = ref(this.storage, path);
            getDownloadURL(pathReference)
              .then((url) => {
                ruta.pathImagePortada.path = path;
                ruta.pathImagePortada.url = url;
                //? ACTUALIZACIÓN DE DATOS EN FIRESTORE
                //Primero creamos una referencia al documento que queremos actualizar
                const docRef = doc(
                  this.firestore,
                  `rutas/${ruta.id}`
                ); //Actualizamos por id
                updateDoc(docRef, ruta)
                  .then(() => {
                    console.log('Se actualizó la información de Firestore');
                  })
                  .catch((error) => console.log('Error', error));
              })
              .catch((error) => console.log('Error: ', error));
          })
          .catch((error) => console.log(error));
      } else {
        //? Si no hay archivos para cargar en Galería y en Imágen Principal
        //? ACTUALIZACIÓN DE DATOS EN FIRESTORE
        //Primero creamos una referencia al documento que queremos actualizar
        const docRef = doc(this.firestore, `rutas/${ruta.id}`); //Actualizamos por id
        updateDoc(docRef, ruta)
          .then(() => {
            console.log('Se actualizó la información de Firestore');
          })
          .catch((error) => console.log('Error', error));
      } //? -> Fin para subir imágen Principal
    } //? -> Fin de la validación para carga de imágenes

    //? Código ChatGpt para solucionar return
    // Añadimos una declaración de retorno al final de la función
    return Promise.resolve(); // Puedes utilizar cualquier promesa vacía aquí
  } //? Fin método agregar Prestador

}
