const express = require('express');
const router = express.Router();    

require('dotenv').config();

const LOCATIONIQ_TOKEN = process.env.LOCATION_IQ_KEY;

router.get('/autoSuggest', async(req, res) => {
    const wordQuery = req.query.q;

    if(!wordQuery) return res.status(404).json({error: "word query for suggestion not found"});

    const url = `https://api.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_TOKEN}&q=${encodeURIComponent(wordQuery)}&limit=5`;

    try{
        const apiReq = await fetch(url);

        console.log("LOCATION IQ:  ",LOCATIONIQ_TOKEN);

        if(!apiReq.ok){
            if(res.status === 429) return res.status(429).json({error: "Too many requests"});
            return res.status(500).json({error: "error fetching auto sugg"});
        }

        const dataStr = await apiReq.json();
        res.json(dataStr);

    }catch(err){
        console.log(err);
        res.status(500).json({error: "Internal server error during location autocomplete."});
    }

});

module.exports = router;