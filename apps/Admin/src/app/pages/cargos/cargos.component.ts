import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  resource,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ODataModel } from '../../models/odata.model';
import { FlexiGridModule, FlexiGridService, StateModel } from 'flexi-grid';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import BlankComponent from '../../components/blank/blank.component';
import { api } from '../../constants';
import { CargoModel } from '../../models/cargo.model';
import { FlexiToastService } from 'flexi-toast';
import { ResultModel } from '../../models/result.model';
import { CommonModule } from '@angular/common';

@Component({
  imports: [RouterLink, FlexiGridModule, BlankComponent, CommonModule],
  templateUrl: './cargos.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CargosComponent {
  result = resource({
    request: () => this.state(),
    loader: async () => {
      let endPoint = `${api}/odata/cargos?$count=true`;
      const odataEndPoint = this.#grid.getODataEndpoint(this.state());
      endPoint += '&' + odataEndPoint;

      var res = await lastValueFrom(
        this.#http.get<ODataModel<any[]>>(endPoint)
      );
      return res;
    },
  });

  readonly data = computed(() => this.result.value()?.value ?? []);
  readonly total = computed(() => this.result.value()?.['@odata.count'] ?? 0);
  readonly loading = linkedSignal(() => this.result.isLoading());
  readonly state = signal<StateModel>(new StateModel());

  #http = inject(HttpClient); // inject yerine constructor'dan da alınabilir.
  #grid = inject(FlexiGridService);
  #breadcrumb = inject(BreadcrumbService);
  #toast = inject(FlexiToastService);

  constructor() {
    this.#breadcrumb.reset();
    this.#breadcrumb.add('Cargos', '/cargos', 'local_shipping');
  }

  dataStateChange(event: StateModel) {
    this.state.set(event);
  }

  async exportExcel() {
    let endPoint = `${api}/odata/cargos?$count=true`;
    var res = await lastValueFrom(this.#http.get<ODataModel<any[]>>(endPoint));
    this.#grid.exportDataToExcel(res.value, 'Cargo List');
  }

  delete(item: CargoModel) {
    const endpoint = `${api}/cargos/${item.id}`;
    this.#toast.showSwal(
      'Delete Cargo?',
      `Do you want to delete the cargo with the following details?<br/> <b>Sender:</b> ${item.senderFullName} <br/> <b>Receiver:</b> ${item.receiverFullName}`,
      () => {
        this.loading.set(true);
        this.#http.delete<ResultModel<string>>(endpoint).subscribe((res) => {
          this.#toast.showToast('Information', res.data!, 'info');
          this.result.reload();
        });
      }
    );
  }

  getStatus(status: string) {
    switch (status) {
      case 'Pending':
        return 'alert-warning';
      case 'Delivered to Vehicle':
        return 'alert-info';
      case 'In Transit':
        return 'alert-primary';
      case 'Arrived at Delivery Branch':
        return 'alert-secondary';
      case 'Out for Delivery':
        return 'alert-success';
      case 'Delivered':
        return 'alert-success';
      case 'Recipient Not Found at Address':
        return 'alert-danger';
      case 'Canceled':
        return 'alert-dark';
      default:
        return 'alert-light';
    }
  }
}
