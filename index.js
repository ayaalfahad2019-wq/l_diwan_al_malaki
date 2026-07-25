const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
app.use(cors());

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

app.get('/rtc/:channel/:role/:type/:uid', (req, res) => {
    const channelName = req.params.channel;
    const uid = parseInt(req.params.uid) || 0;
    const role = req.params.role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    if (!APP_ID || !APP_CERTIFICATE) {
        return res.status(500).json({ error: 'App ID or Certificate missing' });
    }

    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpiredTs);
    
    return res.json({ 'rtcToken': token });
});

module.exports = app;
