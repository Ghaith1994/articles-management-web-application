import { articleConstants } from '../constants';
import { articleService } from '../services';
import { alertActions } from './';
import { history } from '../helpers';

export const articleActions = {
    getAll,
    addArticle,
    deletArticle: _delete,
    updateArticle
};

function getAll() {
    return dispatch => {
        dispatch(request());

        articleService.getAll()
            .then(
                articles => dispatch(success(articles)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: articleConstants.GETALL_REQUEST } }
    function success(articles) { return { type: articleConstants.GETALL_SUCCESS, articles } }
    function failure(error) { return { type: articleConstants.GETALL_FAILURE, error } }
}

function addArticle(artilce) {
    return dispatch => {
        dispatch(request(artilce));

        articleService.add(artilce)
            .then(
                artilce => { 
                    dispatch(success(artilce));
                    history.push('/');
                    dispatch(alertActions.success('added successfuly'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(artilce) { return { type: articleConstants.ADD_REQUEST, artilce } }
    function success(artilce) { return { type: articleConstants.ADD_SUCCESS, artilce } }
    function failure(error) { return { type: articleConstants.ADD_FAILURE, error } }
}


function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        articleService.delete(id)
            .then(
                artilce => {
                    dispatch(success(id));
                    dispatch(alertActions.success('deleted successfuly'));
                },
                error => {
                    error => dispatch(failure(id, error.toString()))
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(id) { return { type: articleConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: articleConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: articleConstants.DELETE_FAILURE, id, error } }
}

function updateArticle(artilce) {
    return dispatch => {
        dispatch(request(artilce));

        articleService.update(artilce)
            .then(
                artilce => { 
                    dispatch(success());
                    history.push('/');
                    dispatch(alertActions.success('updated successfuly'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(artilce) { return { type: articleConstants.UPDATE_REQUEST, artilce } }
    function success(artilce) { return { type: articleConstants.UPDATE_SUCCESS, artilce } }
    function failure(error) { return { type: articleConstants.UPDATE_FAILURE, error } }
}