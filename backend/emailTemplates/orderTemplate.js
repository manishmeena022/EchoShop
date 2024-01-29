const orderSuccessEmail = (name, cartItems) => {
    const email = {
      body: {
        name: name,
        intro: "Your order has been processed successfully.",
        table: {
          data: cartItems.map((item) => {
            return {
              product: item.name,
              price: item.price,
              quantity: item.cartQuantity,
              total: item.price * item.cartQuantity,
            };
          }),
          columns: {
            // Optionally, customize the column widths
            customWidth: {
              product: "40%",
            },
          },
        },
        action: {
          instructions:
            "You can check the status of your order and more in your dashboard:",
          button: {
            color: "#3869D4",
            text: "Go to Dashboard",
            link: "https://echoshop.com",
          },
        },
        outro: "We thank you for your purchase.",
      },
    };
    return email;
};
  
export default orderSuccessEmail
  