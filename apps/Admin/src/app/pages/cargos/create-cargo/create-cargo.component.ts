import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { CargoModel } from '../../../models/cargo.model';
import { FormsModule, NgForm } from '@angular/forms';
import BlankComponent from '../../../components/blank/blank.component';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { FlexiStepperModule } from 'flexi-stepper';
import { FormValidateDirective } from 'form-validate-angular';
import { NgxMaskDirective } from 'ngx-mask';
import { api } from '../../../constants';
import { HttpClient } from '@angular/common/http';
import { ResultModel } from '../../../models/result.model';
import { FlexiToastService } from 'flexi-toast';
import { Location } from '@angular/common';

@Component({
  imports: [
    FormsModule,
    BlankComponent,
    FlexiStepperModule,
    FormValidateDirective,
    NgxMaskDirective,
  ],
  templateUrl: './create-cargo.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CreateCargoComponent {
  data = signal<CargoModel>(new CargoModel());
  loading = signal<boolean>(false);

  #breadcrumb = inject(BreadcrumbService);
  #http = inject(HttpClient);
  #toast = inject(FlexiToastService);
  #location = inject(Location);

  constructor() {
    this.#breadcrumb.reset();
    this.#breadcrumb.add('Cargos', '/cargos', 'local_shipping');
    this.#breadcrumb.add('Create', '/cargos/create', 'add');
  }

  save(form: NgForm) {
    if (form.valid) {
      const endpoint = `${api}/cargos`;
      this.loading.set(true);

      console.log(this.data());
      this.#http
        .post<ResultModel<string>>(endpoint, this.data())
        .subscribe((res) => {
          this.#toast.showToast('Success', res.data!, 'success');
          this.loading.set(false);
          this.#location.back();
        });
    } else {
      this.#toast.showToast(
        'Warning',
        'Fill in the required fields.',
        'warning'
      );
    }
  }
}
