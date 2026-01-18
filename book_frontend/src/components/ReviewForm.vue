<template>
    <div class="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <h4 class="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Dejar una reseña</h4>

        <form @submit.prevent="submitReview" class="space-y-3">
            <div class="flex items-center gap-2">
                <label class="text-xs font-bold text-slate-500">Puntuación:</label>
                <select v-model="rating"
                    class="bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option v-for="n in 5" :key="n" :value="n">{{ n }} ⭐</option>
                </select>
            </div>

            <textarea v-model="comment" placeholder="¿Qué te pareció este libro?" rows="2"
                class="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                required></textarea>

            <button type="submit" :disabled="isSubmitting"
                class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-all active:scale-95">
                {{ isSubmitting ? 'Enviando...' : 'Publicar Reseña' }}
            </button>

            <p v-if="message.text" :class="[
                'text-center text-[10px] font-bold mt-2',
                message.type === 'success' ? 'text-emerald-600' : 'text-rose-600',
            ]">
                {{ message.text }}
            </p>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import apiClient from '@/api/axios'

const props = defineProps({
    bookId: { type: Number, required: true },
})

const emit = defineEmits(['review-added'])

// Estado del formulario
const rating = ref(5)
const comment = ref('')
const isSubmitting = ref(false)
const message = ref({ text: '', type: '' })

const submitReview = async () => {
    if (!comment.value.trim()) return

    isSubmitting.value = true
    message.value = { text: '', type: '' }

    try {
        // POST /api/reviews
        await apiClient.post('/reviews', {
            book_id: props.bookId,
            rating: rating.value,
            comment: comment.value,
        })

        message.value = { text: '¡Reseña enviada con éxito!', type: 'success' }
        comment.value = ''
        rating.value = 5

        // Avisamos al padre para que recargue los libros (y el promedio)
        emit('review-added')
    } catch (err) {
        console.error(err)
        message.value = { text: 'Error al enviar la reseña.', type: 'error' }
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style lang="scss" scoped></style>
