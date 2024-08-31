export const cart=JSON.parse(localStorage.getItem('cart'))||[];

export function addItemsToCart(productId,productName,priceCents)
{
  let matchingItem;

    cart.forEach((item) => {
      
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
  saveToStorage();
}

export function saveToStorage()
{
  localStorage.setItem('cart',JSON.stringify(cart));
}

