

const API_KEY = import.meta.env.VITE_HERE_API_KEY2;

export async function fetchSuggestions(query: any) {
    const url = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${encodeURIComponent(query)}&apiKey=${API_KEY}&limit=4&types=city`;
    const response = await fetch(url);
    const data = await response.json();
    return data.items.map((item: any) => ({ name: item.title }));
  }
  
  export async function fetchCoordinates(cityName: any) {
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(cityName)}&apiKey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].position;
    } else {
      throw new Error('Coordinate non trovate.');
    }
  }
  