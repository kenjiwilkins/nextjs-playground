import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock the child components to simplify the test
jest.mock('@/app/components/hero', () => {
  return function DummyHero() {
    return <div data-testid="hero">Hero</div>
  }
})

jest.mock('@/app/components/navigation', () => {
  return function DummyNavigation() {
    return <div data-testid="navigation">Navigation</div>
  }
})

jest.mock('@/components/ui/theme-toggle', () => {
  return function DummyThemeToggle() {
    return <div data-testid="theme-toggle">ThemeToggle</div>
  }
})

describe('Home', () => {
  it('renders the home page', () => {
    render(<Home />)

    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()

    expect(screen.getByTestId('hero')).toBeInTheDocument()
    expect(screen.getByTestId('navigation')).toBeInTheDocument()
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
  })
})
