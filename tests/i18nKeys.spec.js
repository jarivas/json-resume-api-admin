import { describe, it, expect } from 'vitest'
import messages from '../locales'

describe('i18n keys', () => {
  it('contains expected form and common keys in both locales', () => {
    const keys = [
      ['form', 'language'],
      ['form', 'fluency'],
      ['form', 'reference'],
      ['form', 'organization'],
      ['form', 'position'],
      ['form', 'startDate'],
      ['form', 'endDate'],
      ['form', 'reset'],
      ['common', 'reset'],
    ]

    for (const locale of Object.keys(messages)) {
      const dict = messages[locale]
      for (const path of keys) {
        const [a, b] = path
        expect(dict[a], `${locale}.${a} exists`).toBeDefined()
        expect(dict[a][b], `${locale}.${a}.${b} exists`).toBeDefined()
      }
    }
  })
})
