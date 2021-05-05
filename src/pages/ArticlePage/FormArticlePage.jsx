import React from 'react';
import { connect } from 'react-redux';

import { articleActions } from '../../actions';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./FormArticlePage.css";

import { convertToRaw, ContentState, EditorState } from 'draft-js';
import {convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

class FormArticlePage extends React.Component {
    constructor(props) {
        super(props);

        if(this.props && this.props.location && this.props.location.article){
            const article = this.props.location.article; 

            this.state = {
                id : article.id,
                title: article.title,
                content: article.content,
                date: new Date(new Date(article.date)),
                file: article.file,
                editorState:  EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(article.content))),
                errors: {}
                ,
            };
    
        }else{
            this.state = {
                id : null,
                title: '',
                content: '',
                date: new Date(),
                file: null,
                editorState: EditorState.createEmpty(),
                errors: {}
            };
    
        }      

    }
    
    handleChangeDate = (newDate) => {
        let {date} = this.state;
        date = newDate;
        this.setState({date});
    }

    handleChange = (e) => {
        const { name, value } = e.target;

        if(name == 'file'){
            let reader = new FileReader();
            let file = e.target.files[0];
        
            reader.onloadend = () => {
                this.setState({
                    file: reader.result
                });
            }
        
            reader.readAsDataURL(file)
        }else{
            this.setState({ [name]: value });
        }
    }

    getFileSizeInMb = (base64String) =>{

        let stringLength = base64String.length - 'data:image/png;base64,'.length;

        let sizeInBytes = 4 * Math.ceil((stringLength / 3))*0.5624896334383812;
        let sizeInKb=sizeInBytes/1000;

        return sizeInKb/1024;
    }

    handleValidation = () =>{
        let {title, content, date, file} = this.state;
        let errors = {};
        let formIsValid = true;

        //Title
        if(!title){
            formIsValid = false;
            errors["title"] = "Cannot be empty";
        }

        //Content
        if(!content){
            formIsValid = false;
            errors["content"] = "Cannot be empty";
        }

        //Date
        if(!date){
            formIsValid = false;
            errors["date"] = "Cannot be empty";
        }

        //File
        if(file){
            if(this.getFileSizeInMb(file) > 5){
                errors["file"] = "file chould not be more than 5 mb";
                formIsValid = false;
            }
            
        }
        
        this.setState({
            errors
          });

        return formIsValid;
    }

    onEditorStateChange = (editorState) => {
        const value = draftToHtml(convertToRaw(editorState.getCurrentContent()));

        this.setState({
            editorState,
            content  : value
          });
      };

    handleSubmit = (e) => {
        e.preventDefault();

        if(this.handleValidation()){            
            const { id, date} = this.state;
            if(id){
                this.props.update({...this.state, date : date.toISOString().split('T')[0]});
            }else{
                this.props.store({...this.state, date : date.toISOString().split('T')[0]});
            }
        }
    }

    render() {
        const { title, content, date, file } = this.state;
        const { added  } = this.props;
        const { editorState } = this.state;

        let $imagePreview = null;
        if (file) {
            $imagePreview = (<img src={file} />);
        } else {
            $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
        }

        return (
            <div className="col-md-12 col-md-offset-12">
                <h2>
                {this.state.id  ?  `Edit ${this.props.location.article.title}` : 'Add Artilce' }
                </h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (this.state.errors["title"] ? ' has-error' : '')}>
                        <label htmlFor="title">Title</label>
                        <input type="text" className="form-control" name="title" value={title} onChange={this.handleChange} />
                        <span style={{color: "red"}}>{this.state.errors["title"]}</span>
                    </div>
                    <div className={'form-group' + (this.state.errors["content"] ? ' has-error' : '')}>
                        <label htmlFor="content">Content</label>
                        
                        <Editor editorStyle={{ border: "1px solid" }}
                        editorState={editorState}
                        onEditorStateChange={this.onEditorStateChange}
                        />
                        <span style={{color: "red"}}>{this.state.errors["content"]}</span>
                    </div>
                    <div className={'form-group' + (this.state.errors["date"]  ? ' has-error' : '')}>
                        <label htmlFor="date">Date</label>
                        <DatePicker selected={date} name="date" onChange={ this.handleChangeDate } />
                        <div className="help-block">{this.state.errors["title"]}</div>
                    </div>
                    <div className={'form-group' + (this.state.errors["file"] ? ' has-error' : '')}>
                        <label htmlFor="file">Image</label>
                        <input type="file" name="file" onChange={this.handleChange}/>
                        <div className="imgPreview">
                            {$imagePreview}
                        </div>
                        <span style={{color: "red"}}>{this.state.errors["file"]}</span>
                    </div>
                    <div className="form-group">
                        {added && 
                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                        <button className="btn btn-primary">
                            {this.state.id  ?  'Edit Article' : 'Add Article' }
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

function mapState(state) {
    const { added } = state.articles;
    return { added };
}

const actionCreators = {
    store: articleActions.addArticle,
    update: articleActions.updateArticle,
};

const connectedFormArticlePage = connect(mapState, actionCreators)(FormArticlePage);
export { connectedFormArticlePage as FormArticlePage };