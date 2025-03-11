import React,{createContext,useContext,useState,useEffect} from 'react'
import {toast} from 'react-hot-toast';
const Context=createContext();
export const StateContext = ({children}) => {
  //services
  const serviceList=[{name:'Career',id:6,slug:'career',price:1176,type:'reading',description:'This is a sample description'},
    {name:'Health',id:1,slug:'health',price:1176,type:'reading',description:'This is a sample description'},
    {name:'Relationship',id:2,slug:'relationship',price:1176,type:'reading',description:'This is a sample description'},
    {name:'Psycho counselling',id:3,slug:'psycho-counselling',price:1800,type:'reading',description:'This is a sample description'},
    {name:'Reiki',id:4,slug:'reiki',price:1800,type:'healing',description:'This is a sample description'},
    {name:'Lama Ferra',id:5,slug:'lama-ferra',price:1800,type:'healing',description:'This is a sample description'}
  ];
    const readingList=serviceList.filter((service)=>(service.type==='reading'));
    const healingList=serviceList.filter((service)=>(service.type==='healing'));
  const [showCart,setShowCart]=useState(false);
  //states
const [cartItems,setCartItems]=useState([]);
const [totalPrice,setTotalPrice]=useState(0);
const [totalQuantities,setTotalQuantities]=useState(0);
const [calc,setCalc]=useState(0);
//functions
useEffect(()=>{console.log("total price ="+totalPrice
);
console.log("calc="+calc);
},[totalPrice,calc]);
const onAdd=(service)=>{
   const checkServiceInCart=cartItems.find((item)=>item.id===service.id);
   //adding first,then making adjustments
   if(!checkServiceInCart){
    setTotalQuantities(prev=>prev+1);
    setCalc(prev=>prev+service.price);
    setCartItems(prev=>[...prev,service]);
    toast.success(`${service.name} is added to the cart.`);
    //start start
    const health=cartItems.find((item)=>item.name==="Health") || service.name=="Health";
   const rel=cartItems.find((item)=>item.name==="Relationship") || service.name=="Relationship";
   const career=cartItems.find((item)=>item.name==="Career") || service.name=="Career";
if(health && rel && career) setTotalPrice(calc+service.price-1176);//exclude health
else if(health && rel && !career)  setTotalPrice(calc+service.price-1176-1176+1800);
else if(health && !rel && career)   setTotalPrice(calc+service.price-1176-1176+1800);
else if(!health && rel && career)  {
  setCartItems(prev=>[...prev,serviceList[1]]);
  setCalc(prev=>prev+1176);//added for health
  setTotalQuantities(prev=>prev+1);
  toast.success("Health free added with Relationship+Career");
  setTotalPrice(calc+service.price);
}
else setTotalPrice(calc+service.price);
  }
  else{
    toast.success(`${service.name} is already in the cart.`);
  }
   }
const onRemove=(service)=>{
  setTotalQuantities(prev=>prev-1);
  const health=cartItems.find((item)=>item.name==="Health");
  const rel=cartItems.find((item)=>item.name==="Relationship");
  const career=cartItems.find((item)=>item.name==="Career");
  if(service.name==="Health"){
    if(rel && career){
      setTotalPrice(prev=>prev-0);
    }
    else if((rel && !career)||(career && !rel)){
      setTotalPrice(prev=>prev-624);
    }
    else 
    setTotalPrice(prev=>prev-1176);
  }
  else if(service.name==="Relationship"){
    if(health && career){
      setTotalPrice(prev=>prev-(1176+1176-1800));//(h+c+r)-(h+c)=r 
    }
    else if(health && !career)
    {
      setTotalPrice(prev=>prev-624);
    }
    else setTotalPrice(prev=>prev-1176);
  }
  else if(service.name==="Career"){
    if(health && rel){
      setTotalPrice(prev=>prev-(1176+1176-1800));//(h+c+r)-(h+r)=c 
    }
    else if(health && !rel){
      setTotalPrice(prev=>prev-624);
    }
    else
    {
      setTotalPrice(prev=>prev-1176);
    }
  }
  else setTotalPrice(prev=>prev-service.price);
  const finalCartItems=cartItems.filter((item)=>item.name!=service.name);
   setCartItems(finalCartItems);
   setCalc(prev=>prev-service.price);
}
  return (
    <Context.Provider
  value={{
    showCart,
    setShowCart,
    cartItems,
    setCartItems,
    totalPrice,
    setTotalPrice,
    totalQuantities,
    setTotalQuantities,
    onAdd,
    onRemove,
    serviceList,
    readingList,
    healingList,
  }}  >
    {children}
  </Context.Provider>
);
}
export const useStateContext=()=>{
  return useContext(Context);//instd of using useContext in every function,u just export this function and use this function directly to use the context
 }
 //fn that exports the context
