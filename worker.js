// Michael Macari
const redisConnection = require("./redis-connection");
const axios = require("axios");

const search_query = require("query-string");

// Main function for redis
async function main(){
    console.log("Starting Worker")


    // Research the query using pixabay
    redisConnection.on("research:request:*", async (message, channel) => {
        let requestId = message.requestId;
        let eventName = message.eventName;
        
        // Gets the query from what is sent to Redis
        let query = message.data.query;

        let successEvent = `${eventName}:success:${requestId}`;
        let failedEvent = `${eventName}:failed:${requestId}`;

        // Parameters for search query
        let params = {
            key: "Your API KEY HERE",
            q: query,
            image_type: "photo"
        }

        let searchString = search_query.stringify(params);

        try{
            // Get the data from pixabay
            let res = await axios.get("https://pixabay.com/api/?" + searchString);

            // We are only interested in the hits
            // Cannot send the entire res
            redisConnection.emit(successEvent, {
                requestId,
                eventName,
                data: {
                    results: res.data.hits
                }
            })
        }
        catch(e){
            console.log("Attempted request to pixabay failed");
            redisConnection.emit(failedEvent, {
                requestId,
                eventName,
                data: {
                    message: "Failed to get results from pixabay"
                }
            })
        }
    })
}


main();