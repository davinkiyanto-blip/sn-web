import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Contoh test sederhana
describe('Example Test', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should render text', () => {
    render(<div>Hello World</div>)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
