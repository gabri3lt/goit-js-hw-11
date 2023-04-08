import axios from 'axios';

async function fetchImages(options) {
  try {
    const response = await axios(options);

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
const ACCESS_KEY = '35202304-366566d77bce6cc6758b7abd9';
const SERVICE_URL = 'https://pixabay.com/api/';

const optionsForService = {
  key: ACCESS_KEY,
  q: '',
  page: 1,
  per_page: 40,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

const paramsForRequest = {
  method: 'get',
  url: SERVICE_URL,
  params: optionsForService,
};

export { optionsForService, paramsForRequest };
export { fetchImages };
