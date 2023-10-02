import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroTexto'
})
export class FiltroTextoPipe implements PipeTransform {

  transform(prestadores: any[], filterPost: string): any[] {
    if (!filterPost) {
      return prestadores;
    }
    filterPost = filterPost.toLowerCase();
    return prestadores.filter(prestador => prestador.name.toLowerCase().includes(filterPost));
  }

}
