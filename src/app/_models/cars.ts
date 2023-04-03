export class Cars {
  constructor(id: number, price: number,name: string,model:string,image:string) {
    this.id = id;
    this.price = price;
    this.name = name;
    this.model = model;
    this.image = image;
  }

  id:number;
  price:number;
  name:string;
  model:string;
  image:string;
}
