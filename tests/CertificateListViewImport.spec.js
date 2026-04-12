import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import CertificateListView from '../views/modules/CertificateListView.vue'
import { useCertificateStore } from '../stores/modules/certificate'
import { nextTick } from 'vue'

describe('CertificateListView import UI', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const store = useCertificateStore()
    store.items = []
    store.loading = false
    store.error = null
    store.fetchAll = vi.fn()
    store.importFromUrl = vi.fn()
    store.importFile = vi.fn()
  })

  it('calls store.importFromUrl when import URL submitted', async () => {
    const wrapper = mount(CertificateListView)
    await nextTick()
    const urlInput = wrapper.find('input[type="url"]')
    await urlInput.setValue('http://example.com/cert.pdf')
    const importButton = wrapper.findAll('button').find(b => b.text().includes('Import') || b.text().includes('Importar'))
    const btn = importButton || wrapper.findAll('button')[1]
    await btn.trigger('click')
    expect(useCertificateStore().importFromUrl).toHaveBeenCalledWith('http://example.com/cert.pdf')
  })

  it('calls store.importFile when file selected and import clicked', async () => {
    const wrapper = mount(CertificateListView)
    await nextTick()
    const fileInput = wrapper.find('input[type="file"]')
    const file = new File(['hello'], 'cert.pdf', { type: 'application/pdf' })
    const inputEl = fileInput.element
    Object.defineProperty(inputEl, 'files', { value: [file] })
    await fileInput.trigger('change')
    const importFileBtn = fileInput.element.nextElementSibling
    importFileBtn.click()
    await nextTick()
    expect(useCertificateStore().importFile).toHaveBeenCalled()
  })
})
