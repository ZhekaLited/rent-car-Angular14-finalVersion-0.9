export class Cars {
  constructor(id: number, price: number,name: string,model:string,image:string,release:string,kpp:string,
              dvigatel:string,mesta:string,carsimage:string) {
    this.id = id;
    this.price = price;
    this.name = name;
    this.model = model;
    this.image = image;
    this.release = release;
    this.kpp = kpp;
    this.dvigatel = dvigatel;
    this.mesta = mesta;
    this.carsimage = carsimage;
  }

  id:number;
  price:number;
  name:string;
  model:string;
  image:string;
  release:string;
  kpp:string;
  dvigatel:string;
  mesta:string;
  carsimage:string;
}
