const fs = require('fs'); //fs = file system module
const http = require('http'); // gives us networking capabilities like building a server
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

////////////////////////////////////////////////////////////////////////
// SERVER - Must create the server and start the server
////////////////////////////////////////////////////////////////////////

// ReadFileSync used to read a file and return its contents
// We read the templates for the following below:
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

// The data is the stored json data we have for each product.
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
//Parse the data to transform it into a JavaScript object
const dataObj = JSON.parse(data);

// Use map method on dataObj to create slug for each product using the
// product name and we store that slug in an array.
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
dataObj.forEach((el, i) => (el['slug'] = slugs[i]));

// Create the server by turning computer into an HTTP server
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //// Overview Page ///////////////////////////////////////////////////////
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    //// Product Page ///////////////////////////////////////////////////////
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const id = dataObj.findIndex((el) => el.slug === query.id);
    const product = dataObj[id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //// API ///////////////////////////////////////////////////////
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    //this method below needs to send back a string ansd not an object here
    res.end(data);

    //// Not found Page /////////////////////////////////////////////////////
  } else {
    // res.writeHead can send headers and to do so we need to specify an object in the {}
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
