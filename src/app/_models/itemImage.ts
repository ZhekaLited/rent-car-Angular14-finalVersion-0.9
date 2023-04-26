export class ItemImage {

  constructor(itemImageSrc:string,thumbnailImageSrc:string,alt:string,title:string) {
    this.itemImageSrc = itemImageSrc;
    this.thumbnailImageSrc = thumbnailImageSrc;
    this.alt = alt;
    this.title = title;
  }

  itemImageSrc:string;
  thumbnailImageSrc:string;
  alt:string;
  title:string;
}
