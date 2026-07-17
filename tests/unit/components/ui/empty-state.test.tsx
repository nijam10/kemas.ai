import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { 
  EmptyState, 
  EmptyGallery, 
  EmptyHistory, 
  EmptyCredits, 
  CompactEmptyState,
  IllustratedEmptyState
} from '@/components/ui/empty-state'
import { Package } from 'lucide-react'

describe('EmptyState Components', () => {
  it('renders the base EmptyState with title and description', () => {
    render(<EmptyState title="No Data" description="There is no data available." />)
    
    expect(screen.getByText('No Data')).toBeInTheDocument()
    expect(screen.getByText('There is no data available.')).toBeInTheDocument()
  })

  it('renders action link when actionHref is provided', () => {
    render(
      <EmptyState 
        title="No Data" 
        description="Desc" 
        actionLabel="Go to Home" 
        actionHref="/home" 
      />
    )
    
    const link = screen.getByRole('link', { name: /go to home/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/home')
  })

  it('calls onAction when action button is clicked', () => {
    const handleAction = vi.fn()
    render(
      <EmptyState 
        title="Actionable" 
        description="Desc" 
        actionLabel="Click Me" 
        onAction={handleAction} 
      />
    )
    
    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)
    expect(handleAction).toHaveBeenCalledTimes(1)
  })

  it('renders specific EmptyGallery variant properly', () => {
    render(<EmptyGallery />)
    expect(screen.getByText('No Designs Yet')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /create first design/i })).toHaveAttribute('href', '/generate')
  })

  it('renders CompactEmptyState correctly', () => {
    render(<CompactEmptyState message="Compact Message" />)
    expect(screen.getByText('Compact Message')).toBeInTheDocument()
  })

  it('renders IllustratedEmptyState with action correctly', () => {
    render(
      <IllustratedEmptyState 
        title="Illustrated Title" 
        description="Illustrated Desc" 
        actionLabel="Do It" 
        actionHref="/action"
      />
    )
    expect(screen.getByText('Illustrated Title')).toBeInTheDocument()
    expect(screen.getByText('Illustrated Desc')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /do it/i })).toHaveAttribute('href', '/action')
  })
})
