<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h3 class="mb-4">{{ $t('login.title') }}</h3>
            <form @submit.prevent="onLogin">
              <div class="mb-3">
                <label for="email" class="form-label">{{ $t('form.email') }}</label>
                <input v-model="email" type="email" class="form-control" id="email" required />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">{{ $t('login.password') }}</label>
                <input
                  v-model="password"
                  type="password"
                  class="form-control"
                  id="password"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="auth.loading">
                {{ auth.loading ? $t('login.loggingIn') : $t('login.login') }}
              </button>
              <div v-if="auth.error" class="alert alert-danger mt-3" style="white-space: pre-line">
                {{ auth.error }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const auth = useAuthStore()
const router = useRouter()

const onLogin = async () => {
  await auth.login(email.value, password.value)
  if (auth.token) {
    router.push('/')
  }
}
</script>
