import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import EducationListView from '../views/modules/EducationListView.vue'
import { useEducationStore } from '../stores/modules/education'
import { nextTick } from 'vue'

describe('EducationListView import UI', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const store = useEducationStore()
    store.items = []
    store.loading = false
    store.error = null
    store.fetchAll = vi.fn()
    store.importFromUrl = vi.fn()
    store.importFile = vi.fn()
  })

  it('calls store.importFromUrl when import URL submitted', async () => {
    const wrapper = mount(EducationListView)
    await nextTick()
    const urlInput = wrapper.find('input[type="url"]')
    await urlInput.setValue('http://example.com/resume.pdf')
    const importButton = wrapper.findAll('button').find(b => b.text().includes('Import') || b.text().includes('Importar'))
    // fallback to first button nearby if text lookup fails
    const btn = importButton || wrapper.findAll('button')[1]
    await btn.trigger('click')
    expect(useEducationStore().importFromUrl).toHaveBeenCalledWith('http://example.com/resume.pdf')
  })

  it('calls store.importFile when file selected and import clicked', async () => {
    const wrapper = mount(EducationListView)
    await nextTick()
    const fileInput = wrapper.find('input[type="file"]')
    const file = new File(['hello'], 'resume.pdf', { type: 'application/pdf' })
    const inputEl = fileInput.element
    Object.defineProperty(inputEl, 'files', { value: [file] })
    await fileInput.trigger('change')
    // the import file button is the next button after the file input
    const importFileBtn = fileInput.element.nextElementSibling
    importFileBtn.click()
    await nextTick()
    expect(useEducationStore().importFile).toHaveBeenCalled()
  })
})
