import React, { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleBlogChange, handleBlogRemove, user }) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisiblity = () => {
    setVisible(!visible)
  }


  const handleLikeClick = async () => {
    const newBlog = {
      user: blog.user.id,
      likes: blog.likes ? (blog.likes + 1) : 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      id: blog.id
    }

    const returnedBlog = await blogService.update(newBlog.id, newBlog)
    handleBlogChange(returnedBlog)
  }


  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleRemoveButton = { display: user.username === blog.user.username ? '' : 'none' }


  return (
    <div style={blogStyle} className='blog'>
      <div onClick={toggleVisiblity}>
        {blog.title} {blog.author}
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {blog.url} <br />
        {blog.likes} likes
        <button onClick={handleLikeClick}>like</button><br />
        added by {blog.user.name}<br />
        <div style={toggleRemoveButton}>
          <button onClick={() => handleBlogRemove(blog)}>remove</button>
        </div>

      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object,
  user: PropTypes.object,
  handleBlogChange: PropTypes.func,
  handleRemoveClick: PropTypes.func
}

export default Blog