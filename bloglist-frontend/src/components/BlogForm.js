import React from 'react'

const blogForm = ({
  handleAddBlog,
  title,
  author,
  url
}) => {
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleAddBlog}>
        <div>
          title
          <input { ...title } />
        </div>
        <div>
          author
          <input  { ...author } />
        </div>
        <div>
          url
          <input { ...url } />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default blogForm