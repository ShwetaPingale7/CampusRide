const https = require('https');
const apiKey = 'AIzaSyCFwrjMsKEiYqSOHIEiFt9X6-4qfr_KiRE';

const query = 'kbt circle';
const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}&components=country:in&location=20.0110,73.7903&radius=30000`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Status Base:', json.status);
      if (json.error_message) {
        console.log('Error:', json.error_message);
      } else if (json.predictions) {
        console.log(`Success! Found ${json.predictions.length} predictions.`);
        json.predictions.forEach(p => console.log(' ->', p.description));
      }
    } catch (e) {
      console.log('Failed to parse:', e);
    }
  });
}).on('error', (err) => {
  console.log('Request Error:', err.message);
});
