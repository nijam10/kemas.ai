import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AuthNavbar from '@/components/layout/auth-navbar'
import { useSession } from 'next-auth/react'

// Mock the custom hook
vi.mock('@/hooks/use-credits', () => ({
  useCredits: () => ({ data: { balance: 40 } })
}))

describe('AuthNavbar', () => {
  it('renders public navigation when unauthenticated', () => {
    // Session is unauthenticated by default in setup.ts
    render(<AuthNavbar />)
    
    // Should see Login button
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
    
    // Should not see Generate
    expect(screen.queryByText('Generate')).not.toBeInTheDocument()
  })

  it('renders private navigation when authenticated', () => {
    // Override useSession mock for this test
    vi.mocked(useSession).mockReturnValue({
      data: { user: { name: 'Test User', email: 'test@example.com', role: 'USER' } },
      status: 'authenticated',
      update: vi.fn()
    } as any)

    render(<AuthNavbar />)
    
    // Should see Generate link
    expect(screen.getAllByText('Generate').length).toBeGreaterThan(0)
    
    // Should not see Login button
    expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument()
  })
})
