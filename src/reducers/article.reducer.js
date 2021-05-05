import { articleConstants } from '../constants';

export function articles(state = {}, action) {
  switch (action.type) {
    case articleConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case articleConstants.GETALL_SUCCESS:
      return {
        items: action.articles
      };
    case articleConstants.GETALL_FAILURE:
      return { 
        error: action.error
      };
    case articleConstants.ADD_REQUEST:
      return {
        added: true
      };
    case articleConstants.ADD_SUCCESS:
      return {
      };
    case articleConstants.ADD_FAILURE:
      return { 
        error: action.error
      };
    case articleConstants.DELETE_REQUEST:
      return {
        ...state,
        items: state.items.map(article =>
          article.id === action.id
            ? { ...article, deleting: true }
            : article
        )
      };
    case articleConstants.DELETE_SUCCESS:
      return {
        items: state.items.filter(article => article.id !== action.id)
      };
    case articleConstants.DELETE_FAILURE:
      return {
        ...state,
        items: state.items.map(article => {
          if (article.id === action.id) {
            const { deleting, ...articleCopy } = article;
            return { ...articleCopy, deleteError: action.error };
          }

          return article;
        })
      };
    default:
      return state
  }
}