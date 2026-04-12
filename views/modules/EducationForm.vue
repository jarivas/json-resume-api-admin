<template>
  <form @submit.prevent="onSubmit" novalidate>
    <!-- import by URL/file removed from popup per UX request -->
    <div class="mb-3">
      <label class="form-label">{{ $t('form.institution') }}</label>
      <input
        v-model="form.institution"
        class="form-control"
        :class="{ 'is-invalid': submitted && !form.institution }"
        placeholder="Massachusetts Institute of Technology"
        required
        :disabled="busy"
      />
      <div v-if="submitted && !form.institution" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.institution') }) }}
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.area') }}</label>
      <input v-model="form.area" class="form-control" placeholder="Arts" :disabled="busy" />
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.studyType') }}</label>
      <input
        v-model="form.studyType"
        class="form-control"
        placeholder="Bachelor"
        :disabled="busy"
      />
    </div>

    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">{{ $t('form.startDate') }}</label>
        <input
          v-model="form.startDate"
          class="form-control"
          type="date"
          placeholder="YYYY-MM-DD or YYYY-MM"
          :disabled="busy"
        />
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">{{ $t('form.endDate') }}</label>
        <input
          v-model="form.endDate"
          class="form-control"
          type="date"
          placeholder="YYYY-MM-DD or YYYY-MM"
          :disabled="busy"
        />
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.score') }}</label>
      <input v-model="form.score" class="form-control" placeholder="3.67/4.0" :disabled="busy" />
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.courses') }}</label>
      <textarea
        v-model="form.courses"
        class="form-control"
        placeholder="H1302 - Introduction to American history (one per line)"
        :disabled="busy"
      ></textarea>
    </div>

    <button type="submit" class="btn btn-primary" :disabled="busy">{{ $t('form.save') }}</button>
    <button type="button" class="btn btn-secondary ms-2" @click="$emit('cancel')" :disabled="busy">
      {{ $t('form.cancel') }}
    </button>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useEducationStore } from '../../stores/modules/education'
const props = defineProps({ modelValue: Object, busy: { type: Boolean, default: false } })
const emit = defineEmits(['submit', 'cancel', 'imported'])
const form = ref({
  institution: '',
  url: '',
  area: '',
  studyType: '',
  startDate: '',
  endDate: '',
  score: '',
  courses: '',
})
const submitted = ref(false)

const educationStore = useEducationStore()
// import functionality removed from popup (list views still support import)

watch(
  () => props.modelValue,
  (val) => {
    if (val) form.value = { ...form.value, ...val }
    else
      form.value = {
        institution: '',
        url: '',
        area: '',
        studyType: '',
        startDate: '',
        endDate: '',
        score: '',
        courses: '',
      }
  },
  { immediate: true }
)

function onSubmit() {
  if (props.busy) return
  submitted.value = true
  if (!form.value.institution) return
  const payload = { ...form.value }
  payload.courses = payload.courses
    ? payload.courses
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    : []
  emit('submit', payload)
}

// import handler removed

// file import via direct upload removed from popup; URL import remains
</script>
