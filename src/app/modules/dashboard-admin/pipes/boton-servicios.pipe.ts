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
      // Para filtrar se debe crear un arreglo nuevo con sólo los elementos que queremos mostrar e imprimirlos en el html.
      //Se crea un arreglo de prestadores con las condiciones del filtro.
      prestadores = prestadores.filter((prestador) => {
        //? -> Primero debemos crear un arreglo de strings, ya que originalmente se está tomando un sólo string con todos los servicos, debemos dividir el string completo en distintos strings, en este punto prestador.servicios es un string y no un array de strings. Necesitamos recorrer un array de string no un string.
        // * .split(,) nos crea un array de string dividido por comas y .map() aplica a cada elemento del array un .trim() que quita los espacios del string
        const arrayDeServicios = prestador.servicios.split(',').map((service:any) => service.trim());
        //? -> Evitar el error por tíldes, transformar cada string del array de strings en su equivalente string sin tílde
        function quitarTildes(str: any) {
          return str
            .replace(/[áäâà]/g, 'a')
            .replace(/[éëêè]/g, 'e')
            .replace(/[íïîì]/g, 'i')
            .replace(/[óöôò]/g, 'o')
            .replace(/[úüûù]/g, 'u')
            .replace(/[ñ]/g, 'n')
            .replace(/[ç]/g, 'c');
        }
        // Empezamos a evaluar en este caso los servicios que es mi arreglo de elementos que deseo filtrar
        for (let servi of arrayDeServicios) {
          servi = quitarTildes(servi.toLowerCase());
          //console.log(servi);
          if (servi.localeCompare(servicio) === 0) {
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
