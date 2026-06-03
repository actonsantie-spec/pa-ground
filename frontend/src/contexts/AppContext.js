import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCurrentUser, getUser, logout as authLogout } from '../api/auth';
import { initSocket, disconnectSocket } from '../socket/socketClient';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => getUser());
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('pa_ground_cart');
    try {
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('pa_ground_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const token = localStorage.getItem('pa_ground_token');
    const storedUser = getUser();
    if (!token) {
      if (storedUser) {
        authLogout();
        setUser(null);
      }
      return;
    }

    let mounted = true;
    fetchCurrentUser()
      .then((freshUser) => {
        if (mounted) setUser(freshUser);
      })
      .catch((err) => {
        if (!mounted) return;
        if (err?.status === 401) {
          authLogout();
          setUser(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (user) {
      initSocket();
    } else {
      disconnectSocket();
    }
  }, [user]);

  const cartCount = cartItems.reduce((count, item) => count + (item.quantity || 0), 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);

  const addToCart = (product, quantity = 1) => {
    if (!product || product.id == null) return;
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartItem = (productId, quantity) => {
    setCartItems(prev =>
      prev
        .map(item => (item.id === productId ? { ...item, quantity } : item))
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCartItems([]);

  const logout = () => {
    authLogout();
    disconnectSocket();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      logout,
    }),
    [user, cartItems, cartCount, cartTotal]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
