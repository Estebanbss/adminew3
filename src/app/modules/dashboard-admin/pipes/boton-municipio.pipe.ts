import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'botonMunicipio'
})
export class BotonMunicipioPipe implements PipeTransform {

  transform(prestadores: any[], municipio: string): any[] {

    if (municipio === 'todos') {
      return prestadores; //Retorna el arreglo tal cual
    } else {
      // Para filtrar se debe crear un arreglo nuevo con sólo los elementos que queremos mostrar e imprimirlos en el html.
      //Se crea un arreglo de prestadores con las condiciones del filtro.
      prestadores = prestadores.filter((prestador) => {
        // * Un .trim() que quita los espacios del string y .toLowerCase() transforma el elemento a minúsculas
        let municipioObjeto = prestador.municipio.trim().toLowerCase();
        //? -> Evitar el error por tíldes, transformar cada string en su equivalente string sin tílde
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
        municipioObjeto = quitarTildes(municipioObjeto);

        return municipioObjeto.localeCompare(municipio) === 0
      });
    }

    return prestadores; //Luego del else retorna el arreglo filtrado
  }


}
