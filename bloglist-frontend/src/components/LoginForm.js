import React from 'react'
const blogForm = ({ handleLogin, username, password }) => {
  return (

    <div>
      <form onSubmit={handleLogin} className='login'>
        <div>
          username
          <input {...username} />
        </div>
        <div>
          password
          <input {...password} />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}


export default blogForm