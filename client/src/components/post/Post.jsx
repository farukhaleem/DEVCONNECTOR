import React, {useEffect} from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, useParams } from "react-router-dom";
import { getPost } from '../../actions/post';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';

const Post = ({ getPost, post: { post, loading} }) => {
  let { id } = useParams();

  useEffect(() => {
    getPost(id);
  },[])

  return loading || post === null ? <Spinner /> : <div className='container'>
    <Link to="/posts" className="btn">Back to Posts</Link>
    <PostItem post={post} showActions={false} />
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