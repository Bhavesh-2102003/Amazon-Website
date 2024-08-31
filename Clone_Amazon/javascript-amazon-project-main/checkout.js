import {cart, saveToStorage} from './data/cart.js';
import { deliveryOptions } from './data/deliveryOptions.js';
import {loadFromBackend, products} from './data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import '../javascript-amazon-project-main/data/cart-oop.js'
console.log(cart);
async function load()
{
  await loadFromBackend();
  updateCheckout();
}
load();
function updateCheckout()
{
  let orderSummary='';
  cart.forEach((cartItems)=>{
    const productId=cartItems.product_Id;
    products.forEach((product)=>{
        if(product.id===productId)
        {
            orderSummary+=`<div class="cart-item-container-${product.id}" >
            <div class="delivery-date">
              Delivery date: ${(deliveryDateTitle(cartItems.deliveryId))}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${product.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${product.name}
                </div>
                <div class="product-price">
                  $${(product.priceCents/100).toFixed(2)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItems.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete" data-product-id='${product.id}'>
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
              <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                ${deliveryHtml(product.id,cartItems.deliveryId,cartItems.product_Id)}
                
              </div>
            </div>
          </div>`
        }
    })
 })
 document.querySelector('.order-summary').innerHTML=orderSummary;

 document.querySelectorAll('.js-delete').forEach((button)=>{
  button.addEventListener('click',()=>{
    
    let product_Id=button.dataset.productId;
    cart.forEach((items,index)=>{
      if(items.product_Id===product_Id)
      {
        
        cart.splice(index,1);
        saveToStorage();
        updateCheckout();
        console.log(cart);
        document.querySelector(`.cart-item-container-${product_Id}`).remove();
        addIllustration();
        
      }
    })
  })
  updateOrderSummary();
 })
 addIllustration();
 function addIllustration()
    {
      if(cart.length==0)
      {
        document.querySelector('.order-summary').innerHTML='<img class="empty-cart" src="./Illustrations/Empty-pana.png">'
      }
      
    }

    function deliveryDate(value)
    {
      const today=dayjs().add(value,'days').format('dddd, MMMM DD');
      return today;

    }
    function moneyConverter(value)
    {
      const price=value>0?'$'+(value/100).toFixed(2):'FREE '
      return price;
      
    }

    function deliveryHtml(id,deliveryId,cartId)
    {
      let deliveryHTML='';
      deliveryOptions.forEach((deliveryOption)=>{

        deliveryHTML+=`<div class="delivery-option">
                        <input type="radio" 
                          class="delivery-option-input"
                          data-radio-id=${deliveryOption.id} data-cart-id=${cartId}
                          name="delivery-option-${id}" ${ischeck(deliveryOption.id,deliveryId)?'checked':''}>
                          
                        <div>
                          <div class="delivery-option-date">
                            ${deliveryDate(deliveryOption.days)}
                          </div>
                          <div class="delivery-option-price">
                            ${moneyConverter(deliveryOption.priceCents)}
                            Shipping
                          </div>
                        </div>
                      </div>`
      })
      
      return deliveryHTML;
    }

    function ischeck(deliveryId,cartId)
    {
      if(deliveryId===cartId)
        return true;
      return false;
    }


    const radio=document.querySelectorAll('.delivery-option-input')
    radio.forEach((radio)=>{
      radio.addEventListener(('click'),()=>{

        const cartId=radio.dataset.cartId;
        const radioId=radio.dataset.radioId;
        console.log(radioId,cartId);
        console.log(typeof(radioId),typeof(cartId))
        cart.forEach((elements)=>{
          if(elements.product_Id==cartId)
          {
            elements.deliveryId=Number(radioId);
            saveToStorage();
            console.log(cart);
            updateCheckout();
            updateOrderSummary();
          }
        })
      })
    })

    function deliveryDateTitle(id)
    {
      let date='';
      deliveryOptions.forEach((elements)=>{
        if(id===elements.id)
        {
          date=deliveryDate(elements.days);
          }
        })
        return date;
    }
    console.log(cart);
  }
  function updateOrderSummary()
  {
    
    let orderSummaryHTML='';
    let quantity=0,totalPrice=0,shipping=0,tax=0,estimatedTax=0;
    cart.forEach((elements)=>{
      quantity+=elements.quantity;
      totalPrice+=Number(elements.priceCents/100);
      totalPrice.toFixed(2);
      shipping+=findShipping(elements.deliveryId);
      tax=shipping+totalPrice;
      estimatedTax=0.1*tax;
    })
    console.log('quantity:',quantity,'price:',totalPrice,'shiiping',shipping);


     orderSummaryHTML=`<div class="payment-summary-title">
              Order Summary
            </div>

            <div class="payment-summary-row">
              <div>Items (${quantity}):</div>
              <div class="payment-summary-money">$${(totalPrice).toFixed(2)}</div>
            </div>

            <div class="payment-summary-row">
              <div>Shipping &amp; handling:</div>
              <div class="payment-summary-money">$${shipping}</div>
            </div>

            <div class="payment-summary-row subtotal-row">
              <div>Total before tax:</div>
              <div class="payment-summary-money">$${tax.toFixed(2)}</div>
            </div>

            <div class="payment-summary-row">
              <div>Estimated tax (10%):</div>
              <div class="payment-summary-money">$${estimatedTax.toFixed(2)}</div>
            </div>

            <div class="payment-summary-row total-row">
              <div>Order total:</div>
              <div class="payment-summary-money">$${(tax+estimatedTax).toFixed(2)}</div>
            </div>

            <button class="place-order-button button-primary">
              Place your order
            </button>`

            document.querySelector('.payment-summary').innerHTML=orderSummaryHTML;
  }



  function findShipping(deliveryId){

    
    let shipping=0;
    deliveryOptions.forEach((items)=>{
      if(items.id===deliveryId)
      {
        shipping+=Number(items.priceCents)
      }
    })
    shipping/=100;
  return Number(shipping.toFixed(2));
  ;

  }
  
  updateOrderSummary();
  