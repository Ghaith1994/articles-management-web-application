import config from 'config';
import { authHeader } from '../helpers';

//uncommit this when testing
//import fetch from 'node-fetch';

export const articleService = {
    getAll,
    add,
    delete : _delete,
    update
};


function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/articles`, requestOptions).then(handleResponse);
}

function add(article) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(article)
    };

    return fetch(`${config.apiUrl}/articles`, requestOptions).then(handleResponse);
}

function update(article) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(article)
    };

    return fetch(`${config.apiUrl}/articles/${article.id}`, requestOptions).then(handleResponse);
}

function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/articles/${id}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}