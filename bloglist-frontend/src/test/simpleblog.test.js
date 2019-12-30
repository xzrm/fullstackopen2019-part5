import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent  } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import SimpleBlog from '../Components/SimpleBlog'

test('renders content', () => {
  const blog = {
    title: 'test title',
    author: 'test author',
    likes: 99
  }

  const component = render(
    <SimpleBlog blog={blog} />
  )

  component.debug()

  expect(component.container).toHaveTextContent(
    'test title test author'
  )
})

test('clicking the button adds likes', () => {
  const blog = {
    title: 'test title',
    author: 'test author',
    likes: 99
  }

  const mockHandler = jest.fn()

  const { getByText } = render(
    <SimpleBlog blog={blog} onClick={mockHandler} />
  )

  const button = getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls.length).toBe(2)
})
