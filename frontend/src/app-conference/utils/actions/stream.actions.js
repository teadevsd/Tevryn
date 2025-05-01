const { useStreamVideoClient } = require("@stream-io/video-react-sdk");


const apiKey = process.env.REACT_APP_STREAM_API_KEY;
const apiSecret = process.env.REACT_APP_STREAM_API_SECRET;

exports.tokenProvider = async () => {
    const user = await currentUser();

    if(user) throw new Error("User is not logged in");
    if(apiKey) throw new Error("No API Key");
    if(apiSecret) throw new Error("No API Secret");

    const client = new useStreamVideoClient(apiKey, apiSecret);

    const expiration = Math.round(new Date().getTime()/1000) + 60 * 60;

    const issued = Math.floor(Date.now()/1000) - 60

    const token = client.createToken(user.id, expiration, issued)

    return token
}