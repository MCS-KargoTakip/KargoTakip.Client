export class CargoModel {
  id: string = '';
  sender: CargoPersonModel = new CargoPersonModel();
  receiver: CargoPersonModel = new CargoPersonModel();
  deliveryAddress: CargoAddressModel = new CargoAddressModel();
  cargoInfo: CargoInfoModel = new CargoInfoModel();
  senderFullName: string = '';
  receiverFullName: string = '';
}

export class CargoPersonModel {
  firstName: string = '';
  lastName: string = '';
  identityNumber: string = '';
  email: string = '';
  phoneNumber: string = '';
}

export class CargoAddressModel {
  city: string = '';
  district: string = '';
  neighborhood: string = '';
  street: string = '';
  fullAddress: string = '';
}

export class CargoInfoModel {
  cargoTypeValue: number = 1;
  weight: number = 1;
}
