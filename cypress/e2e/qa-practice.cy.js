describe("Front-end testing in webpage https://qa-practice.netlify.app/products_list", () => {
  beforeEach(() => {
    // Visit the webpage before each test
    cy.visit("https://qa-practice.netlify.app/products_list");
  });
  describe("Page Load", () => {
    it("should display shop products", () => {
      cy.get(".shop-item").should("be.visible");
    });
    it("should display product details correctly", () => {
      // Verify each product's name, image, and price
      cy.get(".shop-item").each(($item, index, $list) => {
        cy.wrap($item)
          .find(".shop-item-title")
          .should("not.be.empty")
          .should("be.visible");
        cy.wrap($item).find(".shop-item-image").should("be.visible");
        cy.wrap($item)
          .find(".shop-item-price")
          .should("not.be.empty")
          .should("be.visible");
      });
    });
  });
  describe("Products List and Shopping Cart", () => {
  it("should add a product to the cart and update the total", () => {
    // Add the first product to the cart and verify it appears in the cart with the correct price
    cy.get(".shop-item").first().find(".shop-item-button").click();
    
    let itemText; // Declare the variable to store the text
 
    // Get the text and store it in the variable
    cy.get('.shop-item').first().find('.shop-item-price').invoke('text').then((text) => {
        itemText = text; // Store the text in the variable
    });
     
    // Later on, you can use the variable in your assertions
    cy.get('.shop-item').first().find('.shop-item-price').invoke('text').then((text) => {
        expect(text).to.equal(itemText); // Example of using the stored value for assertion
    });
    cy.get(".cart-items")
      .find(".cart-row")
      .should("have.length", 1)
      .should("be.visible");
    cy.get(".cart-total-price")
      .should("contain", "$905.99")
      .should("be.visible");
  });
  it("should add few products after purchase", () => {
    cy.get(".shop-item")
      .eq(0)
      .find(".shop-item-button")
      .click()
      .should("be.visible");
    cy.get(".shop-item")
      .eq(1)
      .find(".shop-item-button")
      .click()
      .should("be.visible");
    cy.get(".btn-purchase").click();
    cy.get("#message").should("be.visible");
  });
  it("should remove product from shopping list", () => {
    cy.get(".shop-item")
      .eq(2)
      .find(".shop-item-button")
      .click()
      .should("be.visible");
    cy.get(".shop-item")
      .eq(3)
      .find(".shop-item-button")
      .click()
      .should("be.visible");
    cy.contains("button", "REMOVE").click();
  });
  it("should not update when two same products is added and receive error message", () => {
    cy.get(':nth-child(1) > .shop-item-details > .btn').click();
    cy.get(':nth-child(1) > .shop-item-details > .btn').click();
    });

  it("should update the cart total when multiple items are added", () => {
    // Add multiple products to the cart and verify the total price
    cy.get(".shop-item").each(($item) => {
      cy.wrap($item).find(".shop-item-button").click();
    });
    cy.get(".cart-items")
      .find(".cart-row")
      .should("have.length", 5)
      .should("be.visible");

    // Verify that the total price is greater than $0
    cy.get(".cart-total-price").then(($total) => {
      const totalPrice = parseFloat($total.text().replace("$", ""));
      expect(totalPrice).to.be.greaterThan(0);
    });
  });
  it("should add a product to the cart and update the quantity", () => {
    // Add the third product to the cart
    cy.get(".shop-item").eq(2).find(".shop-item-button").click();

    // Verify that the product has been added to the cart
    cy.get(".cart-items .cart-row").should("have.length", 1);

    // Update the quantity of the product in the cart
    cy.get(".cart-items .cart-row")
      .first()
      .find(".cart-quantity-input")
      .clear() // Clear the existing quantity
      .type("4") // Type in the new quantity
      .trigger("change"); // Trigger the change event to ensure the input is registered

    // Verify that the quantity has been updated to 2
    cy.get(".cart-items .cart-row")
      .first()
      .find(".cart-quantity-input")
      .should("have.value", "4");
  });

  it("should show a message when the purchase button is clicked", () => {
    // Add a product and click the purchase button, then verify the purchase message
    cy.get(".shop-item").first().find(".shop-item-button").click();
    cy.get(".btn-purchase").click();
    cy.get("#message").should("be.visible");
  });
  describe("Page Navigation", () => {
  it('should navigate back to the product list when "Go back" link is clicked', () => {
    // Add a product and click the purchase button, then click the "Go back" link
    cy.get(".shop-item").first().find(".shop-item-button").click();
    cy.get(".btn-purchase").click();
    cy.get("#back_to_prods_list").click();
    cy.url().should("include", "/products_list");
  });

  it("should toggle the sidebar menu visibility", () => {
    // Check if the sidebar toggles when the toggle button is clicked
    cy.get("#sidebarCollapse").click();
    cy.get("#sidebar").should("have.class", "active").should("be.visible");
    cy.get("#sidebarCollapse").click();
    cy.get("#sidebar").should("not.have.class", "active").should("be.visible");
  });
});
  });
});
