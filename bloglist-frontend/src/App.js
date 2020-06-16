import React, { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import './App.css'
import { useField } from './hooks'



const compareLikes = (a, b) => {
  return b.likes - a.likes
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
      blog.id !== updatedBlog.id ? blog : updatedBlog))
      .sort(compareLikes)
    )
  }

  const handleBlogRemove = async (blogToDelete) => {
    if (window.confirm(`remove blog ${blogToDelete.title} by ${blogToDelete.author}?`)) {
      await blogService.remove(blogToDelete.id)
      setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
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

    const newBlog = {
      title: title.attr.value,
      author: author.attr.value,
      url: url.attr.value
    }

    try {
      const addedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(addedBlog))
      setClassName('notification')
      setMessage(`a new blog ${addedBlog.title} by ${addedBlog.author} added: username: ${user.username}`)
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

  /* There are several ways of solving the problem of displaying blogs.
  Adding a blog in the backend saves the user.id. Mongoose method .populate()
  works only for GET requests therefore the new/updated list of blogs
  has to be request with GET request after it was updated.

  The advantage of this solution is that the frontend displays the current
  version of blogs stored in db. Also error handling is easier.
  The downside is that when the list of blogs increases, it would take
  more time to receive all data from the server.

  Other possible solutions are discussed:
  https://dev.to/lenmorld/what-is-the-standard-way-to-keep-ui-state-and-backend-state-synced-during-updates-react-and-node-plm

  Additional option is to remove populate and update the user directly
  at the backend thus       const blog = new Blog({
                            title: body.title,
                            author: body.author,
                            url: body.url,
                            likes: body.likes === undefined ? 0 : body.likes,
                            user: user //<--- instead of user: user._id
                            })
  see the backend part-4.
  */
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


  const blogForm = () => (
    <div>
      <Togglable buttonLabel="new blog">
        <BlogForm
          handleAddBlog={addBlog}
          title={title.attr}
          author={author.attr}
          url={url.attr}
        />
      </Togglable>
    </div>
  )

  return (
    <div>
      {user === null
        ? <h2>log in to application</h2>
        : <h2>blogs</h2>}

      <Notification message={message} className={className} />
      {user !== null &&
        <p>{user.name} is logged in
          <button onClick={handleLogout}>logout</button>
        </p>
      }

      {user === null
        ? <LoginForm handleLogin={handleLogin}
          username={username.attr}
          password={password.attr}
        />
        : blogForm()
      }

      {user === null
        ? <div></div>
        : displayBlogs()
      }
    </div>
  )
}



export default App
