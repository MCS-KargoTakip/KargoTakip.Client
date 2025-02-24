import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component'),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component'),
      },
      {
        path: 'cargos',
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/cargos/cargos.component'),
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./pages/cargos/create-cargo/create-cargo.component'),
          },
        ],
      },
    ],
  },
];
