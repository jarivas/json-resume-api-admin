// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LanguageForm from '../views/modules/LanguageForm.vue'

describe('LanguageForm', () => {
  it('emits submit with language and fluency when valid', async () => {
    const wrapper = mount(LanguageForm)
    await wrapper.find('input').setValue('Spanish')
    // second input is fluency
    const inputs = wrapper.findAll('input')
    if (inputs.length > 1) await inputs[1].setValue('Fluent')
    await wrapper.find('form').trigger('submit.prevent')
    const emitted = wrapper.emitted('submit')
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toEqual({ language: 'Spanish', fluency: 'Fluent' })
  })
})