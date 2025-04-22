
async function scrapeKinguinPlatforms() {
  try {
    for (let i = 1; i <= 99; i++) {
      try {
        const response = await require("axios").get(`https://gateway.sandbox.kinguin.net/esa/api/v1/products?page=${i}`, {
          headers: {
            "X-Api-Key": "e48500efea0eab96a3c0c38226552bf2",
          },
        });

        if (response.data && response.data.results) {
          response.data.results.forEach((result) => {
            console.log(result.platform || null);
          });
        } else {
          console.log(`No results found on page ${i}`);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error scraping page ${i}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error in scraping process:', error.message);
  }
}

scrapeKinguinPlatforms();
