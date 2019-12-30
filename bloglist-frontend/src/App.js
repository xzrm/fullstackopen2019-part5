import React, { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import './App.css'
import { useField } from './hooks'



const compareLikes = (a, b) => {
  return a.likes - b.likes
}


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [className, setClassName] = useState('notification')
  const username = useField('text')
  const password = useField('password')
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')



  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs(blogs
        .sort(compareLikes)))
  }, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      console.log(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      console.log()
      const user = await loginService.login({
        username: username.attr.value,
        password: password.attr.value
      })
      blogService.setToken(user.token)
      setUser(user)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      setClassName('notification')
      setMessage('you are successfully logged in')
      setTimeout(() => {
        setMessage(null)
      }, 5000)

    } catch (exception) {
      setClassName('error')
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
    username.reset()
    password.reset()
  }


  const handleBlogChange = (updatedBlog) => {
    setBlogs((blogs.map(blog =>
      blog.id !== updatedBlog.id ? blog : updatedBlog)
    )
      .sort(compareLikes)
    )
  }

  const handleBlogRemove = async (blogToDelete) => {
    if (window.confirm(`remove blog ${blogToDelete.title} by ${blogToDelete.author}?`)) {
      await blogService.remove(blogToDelete.id)
      setBlogs((blogs.filter(blog => blog.id !== blogToDelete.id))
        .sort(compareLikes))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setClassName('notification')
    setMessage('you are successfully logged out')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }


  const addBlog = async (event) => {
    event.preventDefault()


    const blogObject = {
      title: title.attr.value,
      author: author.attr.value,
      url: url.attr.value
    }

    try {
      const data = await blogService.create(blogObject)
      setBlogs((blogs.concat(data)).sort(compareLikes))
      blogs.map(blog => console.log(blog))
      setClassName('notification')
      setMessage(`a new blog ${title.attr.value} by ${author.attr} added: username: ${user.username}`)
      setTimeout(() => {
        setMessage(null)
      }, 2000)
    } catch (exception) {
      console.log(exception)
    }
    title.reset()
    author.reset()
    url.reset()
  }

  const displayBlogs = () => {
    blogService
      .getAll()
      .then(blogs => setBlogs(blogs
        .sort(compareLikes)))
    return (
      blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleBlogChange={handleBlogChange}
          handleBlogRemove={handleBlogRemove}
          user={user}
        />
      ))
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <Notification message={message} className={className} />
      <form onSubmit={handleLogin} className='login'>
        <div>
          username
          <input { ...username.attr } />
        </div>
        <div>
          password
          <input {...password.attr } />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const blogForm = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={message} className={className} />
      <p>{user.name} is logged in</p>
      <button onClick={handleLogout}>
        logout
      </button>

      <Togglable buttonLabel="new note">
        <BlogForm
          handleAddBlog={addBlog}
          title={title.attr}
          author={author.attr}
          url={url.attr}
        />
      </Togglable>
      <div>{displayBlogs()}</div>

    </div>
  )

  return (
    <div>
      {user === null ?
        loginForm() :
        blogForm()
      }
    </div>
  )
}



export default App
