let currentCartId: string | null = null;

export const getCartId = () => currentCartId;

export const setCartId = (id?: string | null) => {
  if (id) currentCartId = id;
};


