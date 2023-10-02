import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'botonServicios'
})
export class BotonServiciosPipe implements PipeTransform {

  transform(prestadores: any[], servicio: string): any[] {

    if (servicio === 'todos') {
      return prestadores; //Retorna el arreglo tal cual
    } else {
      //console.log(prestadores);
      // En caso de que seleccione otros valores se debe crear un arreglo nuevo con sólo los elementos que llevan ese o esos valores e imprimirlos en el html.
      prestadores = prestadores.filter((prestador) => {
        //? -> Primero debemos crear un arreglo de strings, ya que originalmente se está tomando un sólo string con todos los servicos, debemos dividir el string completo en distintos strings, en este punto prestador.servicios es un string y no un array de strings. Necesitamos recorrer un array de string no un string.
        const arrayDeServicios = prestador.servicios.split(', ');
        //Todo: Evitar el error por tíldes, transformar cada string del array de strings en su equivalente string sin tílde
        // Empezamos a evaluar en este caso los servicios que es mi arreglo de elementos que deseo filtrar
        for (const servi of arrayDeServicios) {
          if (servi.toLowerCase() === servicio) {
            return true; //Retornamos el caso de éxito para filter(), se incluye el elemento actual
          }
        }
        return false; //Aseguramos que luego del for se retorne algo en caso de que ningún elemento coincida
        //Aseguramos un retorno
      });
    }

    return prestadores; //Luego del else retorna el arreglo filtrado
  }

}
