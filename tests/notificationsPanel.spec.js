// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NotificationsPanel from '../components/NotificationsPanel.vue'

describe('NotificationsPanel', () => {
  it('emits mark-all-read when the button is clicked', async () => {
    const items = [
      { title: 'One', body: 'First', read: false, type: 'info' },
      { title: 'Two', body: 'Second', read: false, type: 'success' },
    ]
    const wrapper = mount(NotificationsPanel, { props: { show: true, items } })
    const btn = wrapper.find('button.btn-link')
    expect(btn.exists()).toBe(true)
    await btn.trigger('click')
    expect(wrapper.emitted('mark-all-read')).toBeTruthy()
  })
})
