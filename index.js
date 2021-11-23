
const express = require('express');
const exphbs  = require('express-handlebars');


let AvoShopper = require("./avo-shopper");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://coderr:1996@localhost:5432/avo_shopper';

const pool = new Pool({
    connectionString
});

const app = express();
const PORT =  process.env.PORT || 3019;

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');



app.get('/', function(req, res) {
	res.render('index', {
		
	});
});

app.get('/addShop', function(req, res) {
	res.render('addShop');
});

app.get('/listShop', async function(req, res) {
    const shops = await AvoShopper.listShops()
	res.render('listShop', {
        shops
    });
});

app.get('/addAvo', function(req, res) {
	res.render('addAvo');
});

app.get('/newDeal', async function(req, res) {
    const deal = await AvoShopper.createDeal()
	res.render('newDeal', {
        deal
    });
});

app.post('/addAvo', async function(req, res) {
	const shop = req.params.name;
	const qty = req.body.qty;
	const price = req.body.fruit_id;

	await AvoShopper.createDeal(shop, qty, price);

	res.redirect('/newDeal')
});

app.post('/addShop', async function(req, res) {
    try {
		await AvoShopper.createShop(req.body.name);
	} catch (err){

	}
	res.redirect('/addShop')
});

app.listen(PORT, function() {
	console.log(`AvoApp started on port ${PORT}`)
});