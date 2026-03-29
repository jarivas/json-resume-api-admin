// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ReferenceForm from '../views/modules/ReferenceForm.vue'

describe('ReferenceForm', () => {
  it('emits submit with name and reference when valid', async () => {
    const wrapper = mount(ReferenceForm)
    await wrapper.find('input').setValue('Referrer Name')
    await wrapper.find('textarea').setValue('This is a reference text')
    await wrapper.find('form').trigger('submit.prevent')
    const emitted = wrapper.emitted('submit')
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toEqual({ name: 'Referrer Name', reference: 'This is a reference text' })
  })
})