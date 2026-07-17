import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('merges tailwind classes correctly', () => {
      expect(cn('px-2 py-1', 'bg-red-500')).toBe('px-2 py-1 bg-red-500')
    })

    it('resolves conflicts using tailwind-merge', () => {
      // px-2 and px-4 conflict, tailwind-merge should pick the latter
      expect(cn('px-2', 'px-4')).toBe('px-4')
    })

    it('handles conditional classes via clsx', () => {
      const isTrue = true
      const isFalse = false
      expect(cn('base-class', isTrue && 'truthy-class', isFalse && 'falsy-class')).toBe('base-class truthy-class')
    })

    it('handles arrays and objects', () => {
      expect(cn(['class1', 'class2'], { 'class3': true, 'class4': false })).toBe('class1 class2 class3')
    })
  })
})
