import axios from 'axios';

const url = '/api/genres';

export const fetchGenres = () => axios.get(url);

export const fetchGenre = async (name: string) => {
    return await axios.get(`${url}/${name}`)
}
