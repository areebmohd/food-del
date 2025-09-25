import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { url } from "../assets/assets";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [quantities, setQuantities] = useState({});
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch foods from backend
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`${url}/api/food/list`);
        const data = await response.json();
        if (data.success) {
          setFoods(data.data);
        }
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    fetchFoods();
  }, []);

  // Load user's cart when they login
  useEffect(() => {
    if (user && token) {
      loadUserCart();
    } else {
      // Clear cart when user logs out
      setQuantities({});
    }
  }, [user, token]);

  const loadUserCart = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${url}/api/cart/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        const cartQuantities = {};
        data.data.items?.forEach((item) => {
          cartQuantities[item.foodId._id] = item.quantity;
        });
        setQuantities(cartQuantities);
      }
    } catch (error) {
      console.error("Error loading user cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveToBackend = async (newQuantities) => {
    if (!user || !token) return;

    try {
      // Clear existing cart
      await fetch(`${url}/api/cart/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Add items to cart
      for (const [foodId, quantity] of Object.entries(newQuantities)) {
        if (quantity > 0) {
          await fetch(`${url}/api/cart/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              foodId,
              quantity,
            }),
          });
        }
      }
    } catch (error) {
      console.error("Error saving cart to backend:", error);
    }
  };

  const add = async (id, delta = 1) => {
    const newQuantities = {
      ...quantities,
      [id]: (quantities[id] || 0) + delta,
    };
    setQuantities(newQuantities);

    if (user && token) {
      await saveToBackend(newQuantities);
    }
  };

  const remove = async (id, delta = 1) => {
    const current = quantities[id] || 0;
    const next = Math.max(0, current - delta);

    let newQuantities;
    if (next === 0) {
      const { [id]: _omit, ...rest } = quantities;
      newQuantities = rest;
    } else {
      newQuantities = { ...quantities, [id]: next };
    }

    setQuantities(newQuantities);

    if (user && token) {
      await saveToBackend(newQuantities);
    }
  };

  const clear = async () => {
    setQuantities({});

    if (user && token) {
      try {
        await fetch(`${url}/api/cart/clear`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    }
  };

  const totalItems = useMemo(
    () => Object.values(quantities).reduce((s, n) => s + n, 0),
    [quantities]
  );

  const itemsById = useMemo(() => {
    const map = {};
    foods.forEach((food) => {
      map[food._id] = {
        id: food._id,
        itemname: food.name,
        price: `₹${food.price}`,
        img: `${url}/images/${food.image}`,
      };
    });
    return map;
  }, [foods]);

  const parseUnitPrice = (priceLike) =>
    parseFloat(String(priceLike).replace(/[^\d.]/g, "")) || 0;
  const formatCurrency = (n) => `₹${n}`;

  const cartItems = useMemo(() => {
    return Object.keys(quantities)
      .map((idStr) => {
        const item = itemsById[idStr];
        if (!item) return null;
        const qty = quantities[idStr];
        const unit = parseUnitPrice(item.price);
        const total = unit * qty;
        return { id: idStr, item, qty, unit, total };
      })
      .filter(Boolean);
  }, [quantities, itemsById]);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, it) => sum + it.total, 0),
    [cartItems]
  );
  const deliveryFee = cartItems.length > 0 ? 30 : 0;
  const grandTotal = subtotal + deliveryFee;

  const value = useMemo(
    () => ({
      quantities,
      add,
      remove,
      clear,
      totalItems,
      itemsById,
      cartItems,
      subtotal,
      deliveryFee,
      grandTotal,
      parseUnitPrice,
      formatCurrency,
      loading,
    }),
    [
      quantities,
      totalItems,
      itemsById,
      cartItems,
      subtotal,
      deliveryFee,
      grandTotal,
      loading,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export default CartContext;
