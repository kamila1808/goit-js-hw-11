import axios from "axios";

axios.defaults.baseURL = 'https://pixabay.com/api/';
const apiKey = "17973463-53e63e5df9e32372611cde074";

// const BASE_URL = 'https://pixabay.com/api/';
// const API_KEY = "17973463-53e63e5df9e32372611cde074";

// const fetchImages = async (page, q) => {
//   const params = new URLSearchParams({
//     key: API_KEY,
//     q,
//     page,
//     per_page: 40,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: 'true',
//   });
//   {const response = await axios.get(`${BASE_URL}?${params}`);
//     const images = response;
//     if (images.status !== 200) {
//       throw new Error('images.status');
//     }
//     return images.data;
//   }
// };


async function fetchImages(query, page, perPage) {
  const response = await axios.get(
    `?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
  );
  return response;
}

export {fetchImages};

