import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

// Create context
const Context = createContext();

// State Provider
export const StateContext = ({ children }) => {
  // All available services
  const serviceList = [
    {
      name: "Career",
      id: 6,
      slug: "career",
      price: 1176,
      type: "reading",
      description: "This is a sample description",
    },
    {
      name: "Health",
      id: 1,
      slug: "health",
      price: 1176,
      type: "reading",
      description: "This is a sample description",
    },
    {
      name: "Relationship",
      id: 2,
      slug: "relationship",
      price: 1176,
      type: "reading",
      description: "This is a sample description",
    },
    {
      name: "Psycho counselling",
      id: 3,
      slug: "psycho-counselling",
      price: 1800,
      type: "reading",
      description: "This is a sample description",
    },
    {
      name: "Reiki",
      id: 4,
      slug: "reiki",
      price: 1800,
      type: "healing",
      description: "This is a sample description",
    },
    {
      name: "Lama Ferra",
      id: 5,
      slug: "lama-ferra",
      price: 1800,
      type: "healing",
      description: "This is a sample description",
    },
  ];

  const readingList = serviceList.filter((s) => s.type === "reading");
  const healingList = serviceList.filter((s) => s.type === "healing");

  // States
  const [user, setUser] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [slotCount, setSlotCount] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [calc, setCalc] = useState(0);

  // ⬇️ Fetch user from backend when context loads
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/user/me", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    getUser();
  }, []);

  // ⬇️ Slot calculation when cartItems change
  useEffect(() => {
    let count = 0;
    cartItems.forEach((item) => {
      if (
        item.name === "Health" ||
        item.name === "Career" ||
        item.name === "Relationship"
      )
        count++;
    });
    const newSlotCount = cartItems.length - count + (count === 3 ? 2 : 1);
    setSlotCount(newSlotCount);
  }, [cartItems]);

  // Cart Add Logic
  const onAdd = (service) => {
    const exists = cartItems.find((item) => item.id === service.id);
    if (exists) {
      toast.success(`${service.name} is already in the cart.`);
      return;
    }

    setTotalQuantities((prev) => prev + 1);
    setCalc((prev) => prev + service.price);
    setCartItems((prev) => [...prev, service]);

    const health =
      cartItems.find((item) => item.name === "Health") ||
      service.name === "Health";
    const rel =
      cartItems.find((item) => item.name === "Relationship") ||
      service.name === "Relationship";
    const career =
      cartItems.find((item) => item.name === "Career") ||
      service.name === "Career";

    if (health && rel && career) {
      setTotalPrice(calc + service.price - 1176);
    } else if ((health && rel && !career) || (health && !rel && career)) {
      setTotalPrice(calc + service.price - 1176 - 1176 + 1800);
    } else if (!health && rel && career) {
      setCartItems((prev) => [...prev, serviceList[1]]);
      setCalc((prev) => prev + 1176);
      setTotalQuantities((prev) => prev + 1);
      toast.success("Health free added with Relationship+Career");
      setTotalPrice(calc + service.price);
    } else {
      setTotalPrice(calc + service.price);
    }

    toast.success(`${service.name} added to the cart.`);
  };

  // Cart Remove Logic
  const onRemove = (service) => {
    setTotalQuantities((prev) => prev - 1);

    const health = cartItems.find((item) => item.name === "Health");
    const rel = cartItems.find((item) => item.name === "Relationship");
    const career = cartItems.find((item) => item.name === "Career");

    if (service.name === "Health") {
      if (rel && career) setTotalPrice((prev) => prev - 0);
      else if ((rel && !career) || (career && !rel))
        setTotalPrice((prev) => prev - 624);
      else setTotalPrice((prev) => prev - 1176);
    } else if (service.name === "Relationship") {
      if (health && career)
        setTotalPrice((prev) => prev - (1176 + 1176 - 1800));
      else if (health && !career) setTotalPrice((prev) => prev - 624);
      else setTotalPrice((prev) => prev - 1176);
    } else if (service.name === "Career") {
      if (health && rel) setTotalPrice((prev) => prev - (1176 + 1176 - 1800));
      else if (health && !rel) setTotalPrice((prev) => prev - 624);
      else setTotalPrice((prev) => prev - 1176);
    } else {
      setTotalPrice((prev) => prev - service.price);
    }

    const newCart = cartItems.filter((item) => item.name !== service.name);
    setCartItems(newCart);
    setCalc((prev) => prev - service.price);
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        slotCount,
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
        user,
        setUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

// Custom hook
export const useStateContext = () => useContext(Context);
