# Node-Farm

Introductory project that demonstrates server side rendering. The project displays an online store with products containing product related details. 

Each product is stored in a div and each div has a 'Detail" link that when selected, navigates to the product page. 

The product page has a product card represented as a div that contains the format dictated by the 'template-card.html' file in the templates folder. The text in this html file are dynamic to whatever product is selected. The replaceTemplate.js file is responsible for updating the flags in the index.js file with the product detail (productName, image, price etc.). 
