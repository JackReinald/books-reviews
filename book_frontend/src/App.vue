<template>
  <div class="min-h-screen bg-slate-50 p-6 md:p-12">
    <div class="max-w-6xl mx-auto">
      <header
        class="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-10 gap-6">
        <div>
          <h1 class="text-4xl font-black text-slate-900 tracking-tight">Librería Central</h1>
          <p class="text-slate-500 text-lg mt-1">Catálogo técnico con promedios en tiempo real</p>
        </div>

        <button @click="loadBooks" :disabled="isLoading"
          class="cursor-pointer flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-indigo-100">
          <span v-if="isLoading" class="animate-spin">🌀</span>
          {{ isLoading ? 'Sincronizando...' : 'Refrescar Catálogo' }}
        </button>
      </header>

      <div v-if="error" class="mb-8 p-5 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-xl shadow-sm">
        <span class="font-bold uppercase text-xs block mb-1">Aviso del sistema</span>
        <p>{{ error }}</p>
      </div>

      <main>
        <div v-if="!isLoading && books.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="book in books" :key="book.id"
            class="group bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-4">
                <h3
                  class="text-2xl font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                  {{ book.title }}
                </h3>
              </div>
              <p class="text-slate-600 text-lg italic">de {{ book.author }}</p>
              <div
                class="mt-4 inline-block bg-slate-300 text-slate-500 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-widest">
                Año: {{ book.published_year }}
              </div>
            </div>

            <div class="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
              <div
                class="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-100">
                <span class="text-xl">⭐</span>
                <span class="text-lg font-black">{{
                  book.average_rating ? book.average_rating.toFixed(1) : '0.0'
                }}</span>
              </div>

              <button @click="toggleReviewForm(book.id)"
                class="text-indigo-600 font-bold hover:underline decoration-2 underline-offset-4 cursor-pointer">
                {{ activeBookId === book.id ? 'Cerrar' : 'Añadir reseña' }}
              </button>
            </div>

            <transition enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100">
              <ReviewForm v-if="activeBookId===book.id"
              :book-id="book.id"
              @review-added="loadBooks"/>

            </transition>
          </div>
        </div>

        <div v-else-if="!isLoading && books.length === 0"
          class="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p class="text-slate-400 text-xl font-medium italic">
            El catálogo está vacío actualmente.
          </p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="i in 3" :key="i" class="h-64 bg-slate-200 rounded-3xl animate-pulse"></div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiClient from './api/axios'
import ReviewForm from './components/ReviewForm.vue'

// Estados reactivos
const books = ref([])
const isLoading = ref(false)
const error = ref(null)
const activeBookId = ref(null);

// Función para obtener libros (GET /api/books)
const loadBooks = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Se desestructura la respuesta para conseguir solo los datos
    const { data } = await apiClient.get('/books')
    console.log('Datos recibidos:', data)
    books.value = data
  } catch (err) {
    error.value =
      'No se pudo conectar con el servidor. Verifica que el backend Symfony esté activo.'
    console.error('Error API:', err)
  } finally {
    isLoading.value = false
  }
}

const toggleReviewForm = (id) => {
  activeBookId.value = activeBookId.value === id ? null : id;
};

onMounted(loadBooks)
</script>
