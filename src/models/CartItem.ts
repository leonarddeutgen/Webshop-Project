import { IProduct } from "../models/IProduct";

export class CartItem { 
    constructor(public qty: number, public product: IProduct, public id:number) { } 
   }; 

