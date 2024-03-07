import { CartItem } from "../models/CartItem";
import { getMProducts, getWProducts } from "../services/productService";
import "./../scss/style.scss";

//Skapar variabel för varukorgs ikonen och hämtar p tagen som ska visa detta i domen senare
let cartValue:number = 0;
const cartValueTag = document.getElementById("cartValueTag") as HTMLElement;

// Skapar local storage för varukorgs ikonen
const cartValueLs = localStorage.getItem("cartValue");

if (cartValueLs) {
  cartValue = JSON.parse(cartValueLs);
}


// Hämtar dam produkterna från vårat api
const productsW = await getWProducts();

//Skapar html för våra produkter
const productsWContainer = document.getElementById("productsWContainer");

for (let i = 0; i < productsW.length; i++) {
  const productBox = document.createElement("div");
  const imgContainer = document.createElement("div");
  const img = document.createElement("img");
  const title = document.createElement("p");
  const price = document.createElement("p");
  const addToCartBtn = document.createElement("button");
  
  productBox.className = ("productBox");
  imgContainer.className = ("imgContainer")
  img.className = ("imgContainer--img");
  title.className = ("productBox--title");
  price.className = ("productBox--price");
  addToCartBtn.className = ("productBox--btn");
  
  img.src = productsW[i].image;
  title.innerHTML = productsW[i].title;
  price.innerHTML = productsW[i].price +" $".toString();
  addToCartBtn.innerHTML = "Add to cart";

  
  productBox.appendChild(imgContainer);
  imgContainer.appendChild(img);
  productBox.appendChild(title);
  productBox.appendChild(price);
  productBox.appendChild(addToCartBtn);
  productsWContainer?.appendChild(productBox);
  
  // Kollar ifall produkten finns i shopping cart och då ändras qty på produkten, annars läggs den till i shopping cart listan
  addToCartBtn.addEventListener("click", ()=>{
    let check = (shoppingCartList:CartItem[], id:number) => {
      return shoppingCartList.findIndex((obj) => obj.id === id)
    }
   const index = check(shoppingCartList, productsW[i].id)
  
    if(index === -1) {
      const cartItem:CartItem = new CartItem(0,productsW[i], productsW[i].id);
      cartItem.qty = 1;
      shoppingCartList.push(cartItem);
    }
    else{
      shoppingCartList[index].qty++;
    } 
    cartValue ++; 
    shoppingCartHtml(); 
    showShoppingCartValue(); 
  })
}

// Hämtar herr produkterna från vårat api
const productsM = await getMProducts();

//Skapar html för våra produkter
const productsMContainer = document.getElementById("productsMContainer");

for (let i = 0; i < productsM.length; i++) {
  const productBox = document.createElement("div");
  const imgContainer = document.createElement("div");
  const img = document.createElement("img");
  const title = document.createElement("p");
  const price = document.createElement("p");
  const addToCartBtn = document.createElement("button");
  
  productBox.className = ("productBox");
  imgContainer.className = ("imgContainer")
  img.className = ("imgContainer--img");
  title.className = ("productBox--title");
  price.className = ("productBox--price");
  addToCartBtn.className = ("productBox--btn");
  
  img.src = productsM[i].image;
  title.innerHTML = productsM[i].title;
  price.innerHTML = productsM[i].price +" $".toString();
  addToCartBtn.innerHTML = "Add to cart";
  
  productBox.appendChild(imgContainer);
  imgContainer.appendChild(img);
  productBox.appendChild(title);
  productBox.appendChild(price);
  productBox.appendChild(addToCartBtn);
  productsMContainer?.appendChild(productBox);
  
 // Kollar ifall produkten finns i shopping cart och då ändras qty på produkten, annars läggs den till i shopping cart listan
  addToCartBtn.addEventListener("click", ()=>{
    let check = (shoppingCartList:CartItem[], id:number) => {
      return shoppingCartList.findIndex((obj) => obj.id === id)
    }
   const index = check(shoppingCartList, productsM[i].id)
    if(index === -1) {
      const cartItem:CartItem = new CartItem(0,productsM[i], productsM[i].id);
      cartItem.qty = 1;
      shoppingCartList.push(cartItem);
    }
    else{
      shoppingCartList[index].qty++;
    } 
    cartValue++; 
    shoppingCartHtml(); 
    showShoppingCartValue(); 
  })
};
    
// Skapande av varukorg lista och local storage för den
let shoppingCartList:CartItem[] = [];

const valueFromLs = localStorage.getItem("shoppingCartList");

if (valueFromLs) {
  shoppingCartList = JSON.parse(valueFromLs);
}
const shoppingCartContainer = document.getElementById("shoppingCartContainer");

// Huvud funktion som sätter local storage och som styr summan i varukorgen
const shoppingCartHtml = () => {
  localStorage.setItem("shoppingCartList", JSON.stringify(shoppingCartList));
  
  const summaryOfValue = document.getElementById("summaryOfValue");

  let sum: number = 0;

//Tömma containern varje gång funktionen körs
  if(shoppingCartContainer){
  shoppingCartContainer.innerHTML= "";
}
  /* Loop för varukorg listan */
  for(let i = 0; i < shoppingCartList.length; i++){
    sum += Math.trunc(shoppingCartList[i].product.price * shoppingCartList[i].qty);

    const productBox = document.createElement("div");
    const imgContainer = document.createElement("div");
    const img = document.createElement("img");
    const title = document.createElement("p");
    const price = document.createElement("p");
    const qtyContainer = document.createElement("div");
    const plusBtn = document.createElement("button")
    const minusBtn = document.createElement("button")
    const removeBtn = document.createElement("button");
    const qty = document.createElement("p");
  

    productBox.className = ("shoppingCartBox");
    imgContainer.className = ("imgContainerSC");
    img.className = ("imgContainerSC--img");
    title.className = ("shoppingCartBox--title");
    price.className = ("shoppingCartBox--price");
    removeBtn.className = ("shoppingCartBox--removeBtn");
    
    qtyContainer.className =("qtyContainer");
    minusBtn.className = ("qtyContainer--changeQtyBtn");
    plusBtn.className = ("qtyContainer--changeQtyBtn");
    
    img.src = shoppingCartList[i].product.image;
    title.innerHTML = shoppingCartList[i].product.title;
    price.innerHTML = shoppingCartList[i].product.price +" $".toString();
    plusBtn.innerHTML = "+";
    qty.innerHTML = shoppingCartList[i].qty.toString();
    minusBtn.innerHTML = "-";
    removeBtn.innerHTML ="Remove";

    //Ta bort produkten ur listan och ändra varukorgs ikonen
    removeBtn.addEventListener("click", () => {
      cartValue = cartValue - shoppingCartList[i].qty;
      shoppingCartList.splice(i,1);
      productBox.remove();
      cartValueTag.innerHTML = "";
      sum = 0;

      checkSum() 
      shoppingCartHtml(); 
      showShoppingCartValue(); 
      checkIfEmpty(); 
    });

    //Plus knapp för varukorg
    plusBtn.addEventListener ("click", ()=>{
      if(shoppingCartContainer){
        shoppingCartContainer.innerHTML ="";
      };
      shoppingCartList[i].qty++;
      cartValue++;
      qty.innerHTML = shoppingCartList[i].qty.toString();
      shoppingCartHtml(); 
      showShoppingCartValue(); 
    });

    //Minus knapp för varukorg, ifall det ligger qty 1 på produkten och vi klickar så tas den bort helt annars minskar qty
    minusBtn.addEventListener ("click", ()=>{
      if(shoppingCartList[i].qty === 1){ 
        cartValue --; 
        productBox.remove();
        shoppingCartList.splice(i,1);
        sum =0;
        checkSum(); 
        shoppingCartHtml(); 
        showShoppingCartValue();
        checkIfEmpty();  

      } else{
        shoppingCartList[i].qty--;
        qty.innerHTML = shoppingCartList[i].qty.toString();
        cartValue--;
        checkSum(); 
        shoppingCartHtml(); 
        showShoppingCartValue();
    }
  });

    //Uppdatera total summan
    const checkSum = () => {
    if(summaryOfValue){
      summaryOfValue.innerHTML = "";
      summaryOfValue.innerHTML = "Sum: " + sum.toString() +"$";
     }
    };

    checkSum();

    imgContainer.appendChild(img);
    productBox.appendChild(imgContainer)
    productBox.appendChild(title);
    title.appendChild(price);
    qtyContainer.appendChild(minusBtn);
    qtyContainer.appendChild(qty);
    qtyContainer.appendChild(plusBtn);
    title.appendChild(qtyContainer);
    qtyContainer.appendChild(removeBtn);
    shoppingCartContainer?.appendChild(productBox);

  };
};

shoppingCartHtml()





//Klick funktion nedan för att navigera till woman/mens sidor från hero
const imgContainerW = document.querySelector(".main--imgContainerW");
const imgContainerM = document.querySelector(".main--imgContainerM");

imgContainerW?.addEventListener("click", ()=>{
  window.open("womens.html", "_self");
})

imgContainerM?.addEventListener("click", ()=>{
  window.open("mens.html", "_self");
})

//skapande av html för att visualisera val av betalning/konto/leverans
  const paymentChoice = document.getElementById("paymentChoice");
  const card = document.getElementById("card");
  const swish = document.getElementById("swish");
  
  
  card?.addEventListener("click", ()=>{
    if(paymentChoice){
      paymentChoice.innerHTML = "";
    }
    const cardNumberDiv = document.createElement("div");
    const cardNumberInput = document.createElement("input");
    const cardExtraNumberDiv = document.createElement("div");
    const cardExpireInput = document.createElement("input");
    const cardCvc = document.createElement("input");
  
    cardNumberInput.placeholder = "xxxx xxxx xxxx xxxx";
    cardExpireInput.placeholder = "M/Y";
    cardCvc.placeholder = "CVC";
  
    cardNumberInput.className = ("cardNumber");
    cardExtraNumberDiv.className = ("monthCvcDiv");
    cardExpireInput.className = ("monthCvc");
    cardCvc.className = ("monthCvc");
  
  
    paymentChoice?.appendChild(cardNumberDiv);
    cardNumberDiv.appendChild(cardNumberInput);
    paymentChoice?.appendChild(cardExtraNumberDiv);
    cardExtraNumberDiv.appendChild(cardExpireInput);
    cardExtraNumberDiv.appendChild(cardCvc);
  });
  
  swish?.addEventListener("click", ()=>{
    if(paymentChoice){
      paymentChoice.innerHTML = "";
    }
  
    const cardNumberDiv = document.createElement("div");
    const cardNumberInput = document.createElement("input");
  
    cardNumberInput.placeholder = "+46 ";
    cardNumberInput.className = ("cardNumber");
  
    paymentChoice?.appendChild(cardNumberDiv);
    cardNumberDiv.appendChild(cardNumberInput);
  });


  //Sparar ändringar för varukorgs ikon till local storage
  const showShoppingCartValue = ()=> {
    localStorage.setItem("cartValue", JSON.stringify(cartValue));
    if (cartValueTag){
      cartValueTag.innerHTML = "";
      cartValueTag.innerHTML = cartValue.toString();
    }
  }
  
  showShoppingCartValue();


 //Funktion för checkOutLoop
 const checkoutHTML =()=>{
 
const orderSummaryContainer = document.getElementById("orderSummaryContainer");
const summaryOfValue = document.getElementById("summaryOfValue") as HTMLParagraphElement;

let sum: number = 0;

//Tömma containern varje gång funktionen körs
if(orderSummaryContainer){
  orderSummaryContainer.innerHTML= "";
}

for (let i=0; i< shoppingCartList.length; i++){
  sum += shoppingCartList[i].product.price * shoppingCartList[i].qty;

  const productBox = document.createElement("div");
  const imgContainer = document.createElement("div");
  const img = document.createElement("img");
  const title = document.createElement("p");
  const price = document.createElement("p");
  const qtyContainer = document.createElement("div");
  const plusBtn = document.createElement("button")
  const minusBtn = document.createElement("button")
  const removeBtn = document.createElement("button");
  const qty = document.createElement("p");

  productBox.className = ("checkOut--productBox");
  imgContainer.className = ("checkOut--imgContainer")
  img.className = ("checkOut--img");
  title.className = ("checkOut--title");
  price.className = ("checkOut--price");
  removeBtn.className = ("checkOut--removeBtn");
  minusBtn.className = ("checkOut--minusBtn");
  plusBtn.className = ("checkOut--plusBtn");
  qtyContainer.className = ("checkOut--qty");

  img.src = shoppingCartList[i].product.image;
  title.innerHTML = shoppingCartList[i].product.title;
  price.innerHTML = shoppingCartList[i].product.price +" $".toString();
  plusBtn.innerHTML = "+";
  qty.innerHTML = shoppingCartList[i].qty.toString();
  minusBtn.innerHTML = "-";
  removeBtn.innerHTML ="Remove";
  
  //Ta bort produkten ur listan och ändra varukorgs ikonen
  removeBtn.addEventListener("click", () => {
      cartValue = cartValue - shoppingCartList[i].qty;
      console.log(shoppingCartList[i])
      shoppingCartList.splice(i,1);
      productBox.remove();
      sum =0;
      summaryOfValue.innerHTML = "Sum: " + sum.toString() +"$";
      
      shoppingCartHtml(); 
      showShoppingCartValue();
      checkoutHTML();  
      
  });
  
  imgContainer.appendChild(img);
  productBox.appendChild(imgContainer)
  productBox.appendChild(title);
  title.appendChild(price);
  orderSummaryContainer?.appendChild(productBox);
  qtyContainer.appendChild(minusBtn);
  qtyContainer.appendChild(qty);
  qtyContainer.appendChild(plusBtn);
  title.appendChild(qtyContainer);
  qtyContainer.appendChild(removeBtn);

 // plusknapp för varorna i checkouten
   plusBtn.addEventListener ("click", ()=>{
    if(shoppingCartContainer){
      shoppingCartContainer.innerHTML ="";
    } 
    shoppingCartList[i].qty++;
    cartValue++;
    qty.innerHTML = shoppingCartList[i].qty.toString();
    
    shoppingCartHtml();
    showShoppingCartValue();
  });

  //Minus knapp för varorna i checkouten
  minusBtn.addEventListener ("click", ()=>{
    if(shoppingCartList[i].qty === 1){ 
      cartValue --; 
      productBox.remove();
      shoppingCartList.splice(i,1);
      sum =0;
      summaryOfValue.innerHTML = "Sum: " + sum.toString() +"$";
      
      shoppingCartHtml();
      showShoppingCartValue();

    } else{
      shoppingCartList[i].qty--;
      qty.innerHTML = shoppingCartList[i].qty.toString();
      cartValue--;
      
      shoppingCartHtml();
      showShoppingCartValue();
  }
});

 }
}
checkoutHTML();

// Innehåll som visas när varukorgen är tom
const checkIfEmpty = () => {
  if(shoppingCartList.length === 0){
  const emtpyTitle = document.createElement("h3");
  const continueShoppingBtn = document.createElement("btn");

  emtpyTitle.className = ("emptyTitle");
  continueShoppingBtn.className = ("continueShoppingBtn");

  emtpyTitle.innerHTML = "Your shopping bag is empty!";
  continueShoppingBtn.innerHTML = "Continue shopping";
  continueShoppingBtn.addEventListener("click", ()=>{
    window.open("index.html", "_self");
  })

  shoppingCartContainer?.appendChild(emtpyTitle);
  shoppingCartContainer?.appendChild(continueShoppingBtn);

  const sumAside = document.querySelector(".sumAside") as HTMLDivElement;
  sumAside.className = ("sumAside__empty");
}
};

checkIfEmpty();

//Knapp för att ta sig vidare till kassa
const checkOutBtn = document.getElementById("checkOutBtn");
  checkOutBtn?.addEventListener("click", ()=>{
    window.open("checkOut.html", "_self");
  })

  //Knapp för att simulera köp
  const purchaseBtn = document.querySelector(".purchaseBtn");

  purchaseBtn?.addEventListener("click", () => {
    window.open("purchase.html", "_self");
  });

  //Knapp för att ta sig tillbaka till startsidan efter genomfört köp
  const continueShoppingBtn = document.getElementById("continueShopBtn");
  continueShoppingBtn?.addEventListener("click", () => {
    shoppingCartList.splice(0,shoppingCartList.length)
    cartValue = 0;
    shoppingCartHtml();
    showShoppingCartValue();
  });

