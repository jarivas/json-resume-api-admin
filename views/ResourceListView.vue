<template>
  <div>
    <h1>{{ $t('resource.title') }}</h1>
    <table class="table">
      <tbody>
        <tr v-for="item in store.items" :key="item.id">
          <td>{{ item.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useResourceStore } from '../stores/resource'
import { onMounted } from 'vue'

const store = useResourceStore()
const fetchAll = () => store.fetchAll()

onMounted(fetchAll)
</script>
