let currentCartId: string | null = null;

export const getCartId = () => currentCartId;

export const setCartId = (id?: string | null) => {
  if (id) currentCartId = id;
};

export const clearCartId = () => {
  currentCartId = null;
};


