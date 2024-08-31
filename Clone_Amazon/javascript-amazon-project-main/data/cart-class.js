class Cart {
    
    constructor(localStoragekey){
        cartItems=JSON.parse(localStorage.getItem(localStoragekey))||[];
    }

    addItemsToCart(productId,productName,priceCents)
{
  let matchingItem;

    Cart.forEach((item) => {
      
      if(item.product_Id===productId)
      {
        matchingItem=item;
      }
    }
  )
  if(matchingItem)
  {
    matchingItem.quantity++;
  }
  else
  {
    cart.push(matchingItem={
      product_Id:productId,
      product_Name:productName,
      quantity:1,
      deliveryId:1,
      priceCents:priceCents
    })
  }
  this.saveToStorage();
}

saveToStorage()
{
  localStorage.setItem('cart',JSON.stringify(cart));
}
}

const cart=new cart('cart');