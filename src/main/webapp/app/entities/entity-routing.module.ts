import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'cliente',
        data: { pageTitle: 'Clientes' },
        loadChildren: () => import('./cliente/cliente.module').then(m => m.ClienteModule),
      },
      {
        path: 'insegnante',
        data: { pageTitle: 'Insegnantes' },
        loadChildren: () => import('./insegnante/insegnante.module').then(m => m.InsegnanteModule),
      },
      {
        path: 'corso',
        data: { pageTitle: 'Corsos' },
        loadChildren: () => import('./corso/corso.module').then(m => m.CorsoModule),
      },
      {
        path: 'concerto',
        data: { pageTitle: 'Concertos' },
        loadChildren: () => import('./concerto/concerto.module').then(m => m.ConcertoModule),
      },
      {
        path: 'foto',
        data: { pageTitle: 'Fotos' },
        loadChildren: () => import('./foto/foto.module').then(m => m.FotoModule),
      },
      {
        path: 'video',
        data: { pageTitle: 'Videos' },
        loadChildren: () => import('./video/video.module').then(m => m.VideoModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
