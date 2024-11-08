import axios from 'axios';

const url = '/api/articles';


export const fetchArticles = (pageNumber?: number) => axios.get(`${url}?page=${pageNumber}`);

export const fetchArticle = async (name: string) => {
    return await axios.get(`${url}/${name}`)
}
