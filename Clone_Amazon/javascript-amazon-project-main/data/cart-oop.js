export const cart={

    cartItems:JSON.parse(localStorage.getItem('cart'))||[],

    saveToStorage()
    {
        localStorage.setItem('cart',JSON.stringify(cart));
    },

      addItemsToCart(productId,productName,priceCents)
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
        this.saveToStorage();
    }
}