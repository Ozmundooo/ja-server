const express = require('express');
const session = require('express-session');
const app = express();
const cors = require('cors');
const axios = require('axios');

require('dotenv').config();

const port = process.env.PORT || 8080;
const domainName = process.env.API_DOMAIN;
const apiKey = process.env.API_KEY;

app.use(cors({
	origin: true,
	credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
	axios
		.get(`${process.env.API_DOMAIN}/listings/`, {
			headers: {
				"REPLIERS-API-KEY": `${process.env.API_KEY}`
			}
		})
		.then(response => {
			res.status(200).json(response.data);

		})
		.catch(err => {
			console.log(err);
		});
});

app.get('/city/:city', (req, res) => {
	let city = '';
	if (req.params.city === 'kw') {
		city = `kitchener&city=waterloo`
	} 
	else if(req.params.city === 'gma'){
		city = `miami`
	}
	else if(req.params.city === 'fortmyers'){
		city = `Fort+Myers`
	}
	else {
		city = req.params.city;
	};
	let pageNum = req.query.pageNum;
	let resultsPerPage = req.query.resultsPerPage;
	let sortBy = req.query.sortBy;
	let mlsNumber = req.query.mlsNumber;
	let className = req.query.class;
	let beds = req.query.beds;
	let baths = req.query.baths;
	let price = req.query.price;
	let sqRange = req.query.sqRange;
	let additionalQuery = '';
	if (mlsNumber !== '') {
		additionalQuery = additionalQuery.concat('&mlsNumber=', mlsNumber);
	}
	if (className === 'residential' || className === 'condo' || className === 'commercial') {
		additionalQuery = additionalQuery.concat('&class=', className);
	}
	if (beds !== '0') {
		additionalQuery = additionalQuery.concat('&minBeds=', beds);
		additionalQuery = additionalQuery.concat('&maxBeds=', beds);
	};
	if (baths !== '0') {
		additionalQuery = additionalQuery.concat('&minBaths=', baths);
		additionalQuery = additionalQuery.concat('&maxBaths=', baths);
	};
	if (price[0] !== '0') {
		additionalQuery = additionalQuery.concat('&minPrice=', price[0]);
	};
	if (price[1] !== '5000000') {
		additionalQuery = additionalQuery.concat('&maxPrice=', price[1]);
	};
	if (sqRange[0] !== '0') {
		additionalQuery = additionalQuery.concat('&minSqft=', sqRange[0]);
	};
	if (sqRange[1] !== '10000') {
		additionalQuery = additionalQuery.concat('&maxSqft=', sqRange[1]);
	};
	axios
		.get(`${process.env.API_DOMAIN}/listings?city=${city}&pageNum=${pageNum}&resultsPerPage=${resultsPerPage}&sortBy=${sortBy}${additionalQuery}`, {
			headers: {
				"REPLIERS-API-KEY": `${process.env.API_KEY}`
			}
		})
		.then(response => {
			res.status(200).json(response.data);
		})
		.catch(err => {
			console.log(err);
		});
})
app.get('/:mlslisting/:boardId', (req, res) => {
	axios
		.get(`${process.env.API_DOMAIN}/listings/${req.params.mlslisting}?boardId=${req.params.boardId}`, {
			headers: {
				"REPLIERS-API-KEY": `${process.env.API_KEY}`
			}
		})
		.then(response => {
			res.status(200).json(response.data);
		})
		.catch(err => {
			console.log(err);
		});
});
app.listen(port, () => console.log(`Listening on port ${port}`));
