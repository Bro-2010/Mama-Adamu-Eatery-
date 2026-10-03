// ===== EDIT YOUR MENU HERE =====
const WHATSAPP_NUMBER = "233000000000"; // Replace with Mama Adamu's WhatsApp number, without + or spaces.

const menuItems = [
  {id:1,name:"Waakye",category:"Main Meals",price:30,desc:"Tasty waakye served with your choice of sides.",image:"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80"},
  {id:2,name:"Kenkey & Fish",category:"Main Meals",price:35,desc:"Soft kenkey with fish and tasty pepper.",image:"https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=80"},
  {id:3,name:"Jollof Rice",category:"Main Meals",price:35,desc:"Flavorful Ghana-style jollof rice.",image:"https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80"},
  {id:4,name:"Fried Rice",category:"Main Meals",price:35,desc:"Fried rice prepared fresh for you.",image:"https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80"},
  {id:5,name:"Chicken",category:"Sides & Protein",price:20,desc:"Seasoned chicken portion.",image:"https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=900&q=80"},
  {id:6,name:"Fried Fish",category:"Sides & Protein",price:20,desc:"Crispy fried fish portion.",image:"https://images.unsplash.com/photo-1510130387422-82bed34b37e1?auto=format&fit=crop&w=900&q=80"},
  {id:7,name:"Soft Drink",category:"Drinks",price:10,desc:"Chilled soft drink.",image:"https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=900&q=80"},
  {id:8,name:"Bottled Water",category:"Drinks",price:5,desc:"Cold bottled water.",image:"https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=900&q=80"}
];

let activeCategory="All";
let cart={};

const menuEl=document.getElementById("menu");
const categoriesEl=document.getElementById("categories");
const searchEl=document.getElementById("search");
const emptyEl=document.getElementById("empty");
const countEl=document.getElementById("count");

function money(n){return "GH₵"+Number(n).toFixed(2).replace(".00","")}
function categories(){
  const cats=["All",...new Set(menuItems.map(x=>x.category))];
  categoriesEl.innerHTML=cats.map(c=>`<button class="cat ${c===activeCategory?"active":""}" onclick="setCategory('${c.replaceAll("'","\\'")}')">${c}</button>`).join("");
}
function setCategory(c){activeCategory=c;categories();render()}
function render(){
  const q=searchEl.value.toLowerCase().trim();
  const items=menuItems.filter(x=>(activeCategory==="All"||x.category===activeCategory)&&(!q||x.name.toLowerCase().includes(q)||x.desc.toLowerCase().includes(q)));
  menuEl.innerHTML=items.map(x=>`
    <article class="card">
      <img class="food-img" src="${x.image}" alt="${x.name}" loading="lazy">
      <div class="card-body">
        <h3>${x.name}</h3>
        <p class="desc">${x.desc}</p>
        <div class="price">${money(x.price)}</div>
        <button class="add" onclick="addToCart(${x.id})">+ Add to order</button>
      </div>
    </article>`).join("");
  emptyEl.hidden=items.length!==0;
}
function addToCart(id){cart[id]=(cart[id]||0)+1;updateCount()}
function updateCount(){countEl.textContent=Object.values(cart).reduce((a,b)=>a+b,0)}
function openCart(){
  const ids=Object.keys(cart);
  if(!ids.length){alert("Your order is empty. Add a menu item first.");return}
  document.getElementById("cartItems").innerHTML=ids.map(id=>{
    const x=menuItems.find(m=>m.id==id), q=cart[id];
    return `<div class="cart-row"><span><strong>${x.name}</strong><br>${money(x.price)} × ${q}</span><span class="qty"><button onclick="changeQty(${x.id},-1)">−</button> ${q} <button onclick="changeQty(${x.id},1)">+</button></span></div>`
  }).join("");
  document.getElementById("total").textContent=money(ids.reduce((s,id)=>s+menuItems.find(m=>m.id==id).price*cart[id],0));
  document.getElementById("cartModal").classList.add("show");
}
function changeQty(id,d){cart[id]=(cart[id]||0)+d;if(cart[id]<=0)delete cart[id];updateCount();openCart()}
function sendOrder(){
  const ids=Object.keys(cart);
  let message="Hello Mama Adamu Eatery, I would like to place an order:%0A%0A";
  let total=0;
  ids.forEach(id=>{const x=menuItems.find(m=>m.id==id),q=cart[id];total+=x.price*q;message+=`• ${x.name} × ${q} — ${money(x.price*q)}%0A`});
  message+=`%0ATotal: ${money(total)}%0A%0AName:%0ADelivery/Pickup:`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,"_blank");
}
searchEl.addEventListener("input",render);
document.getElementById("orderBtn").onclick=openCart;
document.getElementById("closeModal").onclick=()=>document.getElementById("cartModal").classList.remove("show");
document.getElementById("sendBtn").onclick=sendOrder;
document.getElementById("cartModal").addEventListener("click",e=>{if(e.target.id==="cartModal")e.currentTarget.classList.remove("show")});
categories();render();