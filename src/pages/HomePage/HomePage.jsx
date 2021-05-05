import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { articleActions } from '../../actions';


class HomePage extends React.Component {
    componentDidMount() {
        this.props.getArtilces();
    }

    handleDeleteArticle(id) {
        return (e) => this.props.deleteArtilce(id);
    }

    render() {
        const { user, articles } = this.props;
        return (
            
            <div className="col-md-12 col-md-offset-12">
                <h1>Hi { user ? user.firstName : '' }!</h1>
                <h3>All saved articles:</h3>
                {articles.loading && <em>Loading articles...</em>}
                {articles.error && <span className="text-danger">ERROR: {articles.error}</span>}
                <table className="table">
                    <thead>
                        <tr>
                           <th>Title</th>
                           <th>Content</th>
                           <th>Date</th>
                           <th></th>
                        </tr>
                    </thead>
                    {articles.items &&
                    <tbody>
                        {articles.items.map((article, index) =>
                            <tr key={article.id}>
                                <td>
                                    {article.title}
                                </td>
                                <td dangerouslySetInnerHTML={{__html: article.content}} >
                                    
                                </td>
                                <td>
                                    {article.date}
                                </td>
                                <td>
                                    {
                                        article.deleting ? <em> - Deleting...</em>
                                        : article.deleteError ? <span className="text-danger"> - ERROR: {article.deleteError}</span>
                                        : <a className="btn btn-danger" onClick={this.handleDeleteArticle(article.id)}>Delete</a>
                                    }

                                <Link className="btn btn-light"  to={
                                    {     
                                        pathname: "/form-article",
                                        article:article
                                        }
                                }>   
                                Edit                              
                                </Link>
                                    
                                </td>
                            </tr>
                        )}
                    </tbody>
                }
                </table>
                <p>
                    <Link className="btn btn-success" to="/form-article">Add New Article</Link>
                </p>
                <p>
                    <Link className="btn btn-info" to="/login">Logout</Link>
                </p>
            </div>
        );
    }
}

function mapState(state) {
    const { articles, authentication } = state;
    const { user } = authentication;
    return { user, articles };
}

const actionCreators = {
    getArtilces: articleActions.getAll,
    deleteArtilce: articleActions.deletArticle
}

const connectedHomePage = connect(mapState, actionCreators)(HomePage);
export { connectedHomePage as HomePage };