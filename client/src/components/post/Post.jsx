import React, {useEffect} from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, useParams } from "react-router-dom";
import { getPost } from '../../actions/post';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import Alert from './../layout/Alert';
import CommentItem from './CommentItem'

const Post = ({ getPost, post: { post, loading} }) => {
  let { id } = useParams();

  useEffect(() => {
    getPost(id);
  },[])

  return loading || post === null ? <Spinner /> : <div className='container'>
    <Alert />
    <Link to="/posts" className="btn">Back to Posts</Link>
    <PostItem post={post} showActions={false} />
    <CommentForm postId={post._id} />
    <div className="comments">
      {post.comments.map(comment => (
        <CommentItem key={comment._id} comment={comment} postId={post._id} />
      ))}
    </div>
  </div>
}

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    post: state.post
  }
}
export default connect(mapStateToProps, { getPost })(Post)