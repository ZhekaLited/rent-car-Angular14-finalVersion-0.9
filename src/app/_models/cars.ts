export class Cars {
  constructor(id: bigint, price: number,namecars: string,model:string,image:string,release:string,kpp:string,
              dvigatel:string,mesta:string,carsimage:string,damage:string,status:boolean) {
    this.id = id;
    this.price = price;
    this.namecars = namecars;
    this.model = model;
    this.image = image;
    this.release = release;
    this.kpp = kpp;
    this.dvigatel = dvigatel;
    this.mesta = mesta;
    this.carsimage = carsimage;
    this.damage = damage;
    this.status = status;
  }

  id:bigint;
  price:number;
  namecars:string;
  model:string;
  image:string;
  release:string;
  kpp:string;
  dvigatel:string;
  mesta:string;
  carsimage:string;
  damage:string;
  status:boolean;
}
