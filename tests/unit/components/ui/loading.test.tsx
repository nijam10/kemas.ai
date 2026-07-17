import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { 
  CardSkeleton, 
  DesignCardSkeleton, 
  StatCardSkeleton, 
  TableRowSkeleton, 
  PageLoader, 
  Spinner, 
  PulseLoader,
  DesignGridSkeleton,
  StatsGridSkeleton
} from '@/components/ui/loading'

describe('Loading Components', () => {
  it('renders PageLoader correctly', () => {
    const { container } = render(<PageLoader />)
    expect(container.textContent).toContain('Loading...')
  })

  it('renders Spinner with default size', () => {
    const { container } = render(<Spinner />)
    expect(container.firstChild).toHaveClass('w-4', 'h-4')
  })

  it('renders Spinner with large size', () => {
    const { container } = render(<Spinner size="lg" />)
    expect(container.firstChild).toHaveClass('w-8', 'h-8')
  })

  it('renders PulseLoader correctly', () => {
    const { container } = render(<PulseLoader />)
    // PulseLoader has 3 pulsing dots
    expect(container.firstChild?.childNodes.length).toBe(3)
  })

  it('renders DesignGridSkeleton with default count', () => {
    const { container } = render(<DesignGridSkeleton />)
    // default count is 6
    expect(container.firstChild?.childNodes.length).toBe(6)
  })

  it('renders DesignGridSkeleton with specific count', () => {
    const { container } = render(<DesignGridSkeleton count={2} />)
    expect(container.firstChild?.childNodes.length).toBe(2)
  })

  it('renders StatsGridSkeleton with default count', () => {
    const { container } = render(<StatsGridSkeleton />)
    // default count is 4
    expect(container.firstChild?.childNodes.length).toBe(4)
  })

  it('renders all skeleton types without crashing', () => {
    render(<CardSkeleton />)
    render(<DesignCardSkeleton />)
    render(<StatCardSkeleton />)
    render(
      <table>
        <tbody>
          <TableRowSkeleton />
        </tbody>
      </table>
    )
    expect(true).toBeTruthy() // If no crash occurs, test passes
  })
})
