// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VolunteerForm from '../views/modules/VolunteerForm.vue'

describe('VolunteerForm', () => {
  it('emits submit with required fields when valid', async () => {
    const wrapper = mount(VolunteerForm)
    const inputs = wrapper.findAll('input')
    // organization
    await inputs[0].setValue('Charity Org')
    // position
    await inputs[1].setValue('Volunteer')
    // url (optional)
    if (inputs[2]) await inputs[2].setValue('http://example.com')
    await wrapper.find('form').trigger('submit.prevent')
    const emitted = wrapper.emitted('submit')
    expect(emitted).toBeTruthy()
    const payload = emitted[0][0]
    expect(payload.organization).toBe('Charity Org')
    expect(payload.position).toBe('Volunteer')
  })
})