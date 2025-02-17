import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ODataModel } from '../../models/odata.model';
import { FlexiGridModule, FlexiGridService, StateModel } from 'flexi-grid';

@Component({
  imports: [RouterLink, FlexiGridModule],
  templateUrl: './cargos.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CargosComponent {
  token = signal<string>(
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImE5YjY3ZTU2LWQ3YzktNDRmOS05NDJkLTZmNzc0ZDI4ZTc4NiIsIm5iZiI6MTczOTgwMTQxNiwiZXhwIjoxNzM5ODg3ODE2LCJpc3MiOiJUYW5lciBTYXlkYW0iLCJhdWQiOiJUYW5lciBTYXlkYW0ifQ.3HcUV2zLnU8_aVAkX4Xu934E19PrdMs_Fxemw6JobPovrlVRgib52Hak_jdVbkcairQtej4W2mN9eeIP-NndFQ'
  );

  result = resource({
    request: () => this.state(),
    loader: async () => {
      let endPoint = 'https://localhost:7213/odata/cargos?$count=true';
      const odataEndPoint = this.#grid.getODataEndpoint(this.state());
      endPoint += '&' + odataEndPoint;

      var res = await lastValueFrom(
        this.#http.get<ODataModel<any[]>>(endPoint, {
          headers: { Authorization: 'bearer ' + this.token() },
        })
      );
      return res;
    },
  });

  data = computed(() => this.result.value()?.value);
  total = computed(() => this.result.value()?.['@odata.count']);
  loading = computed(() => this.result.isLoading());
  state = signal<StateModel>(new StateModel());

  #http = inject(HttpClient);
  #grid = inject(FlexiGridService);

  dataStateChange(event: StateModel) {
    this.state.set(event);
  }
}
