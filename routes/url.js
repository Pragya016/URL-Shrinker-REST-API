import express from 'express';
import shortid from 'shortid'
import URL from '../models/URL.js';

const router = express.Router();

// Shorten URL
router.post('/shorten', async (req, res) => {
    const { fullUrl, customCode } = req.body;
    const shortUrl = customCode || shortid.generate();
    const url = new URL({ fullUrl, shortUrl });
    await url.save();
    res.json({ shortUrl });
});

// Redirect and Track
router.get('/:shortUrl', async (req, res) => {
    try {
        const shortUrl = await URL.findOne({ shortUrl: req.params.shortUrl });

        if (!shortUrl) {
            return res.status(404).send('Short URL not found');
        }

        shortUrl.visits++;
        await shortUrl.save();

        res.status(302).redirect(shortUrl.fullUrl);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Get Analytics
router.get('/analytics/:shortUrl', async (req, res) => {
    try {
        const shortUrl = await URL.findOne({ shortUrl: req.params.shortUrl });
        if (!shortUrl) return res.status(404).send('Short URL not found');

        res.json({
            originalUrl: shortUrl.fullUrl,
            shortUrl: shortUrl.shortUrl,
            visits: shortUrl.visits,
            createdAt: shortUrl.createdAt,
            expireAt: shortUrl.expireAt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
