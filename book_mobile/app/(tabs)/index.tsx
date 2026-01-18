import apiClient from "../../config/axios";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Interface actualizada
interface Book {
  id: number;
  title: string;
  author: string;
  published_year: number;
  average_rating: number;
}

export default function BookCatalog() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [books, setBooks] = useState<Book[]>([]);

  // Estados para el Formulario de Reseña
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/books"); // Usando el path relativo como un pro
      setBooks(response.data);
    } catch (error) {
      console.error("Error al obtener libros:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleOpenReview = (bookId: number) => {
    setSelectedBookId(bookId);
    setModalVisible(true);
  };

  const submitReview = async () => {
    if (!rating || !comment) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    try {
      setIsSubmitting(true);

      // LA RUTA CORRECTA: Según tu controlador es /api/reviews
      // El apiClient ya tiene el /api, así que solo ponemos /reviews
      await apiClient.post('/reviews', {
        book_id: selectedBookId, // <--- Enviamos el ID aquí adentro
        rating: parseFloat(rating),
        comment: comment
      });

      Alert.alert("¡Éxito!", "Tu reseña ha sido guardada.");
      setModalVisible(false);
      setRating('');
      setComment('');
      loadBooks();
    } catch (error) {
      console.error("Error al enviar:", (error as any).response?.data || (error as any).message);
      Alert.alert("Error", "No se pudo guardar la reseña.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadBooks}
            colors={['#4f46e5']} // Color del spinner en Android
            tintColor={'#4f46e5'} // Color del spinner en iOS
          />
        }>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Librería Central</Text>
            <Text style={styles.headerSubtitle}>
              Catálogo técnico con promedios
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={loadBooks}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Refrescar Catálogo</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* LISTA DE LIBROS */}
        <View style={styles.grid}>
          {books.map((book) => (
            <View key={book.id} style={styles.card}>
              <View>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>de {book.author}</Text>
                <View style={styles.yearBadge}>
                  <Text style={styles.yearText}>
                    AÑO: {book.published_year}
                  </Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.ratingBadge}>
                  <Text style={styles.star}>⭐</Text>
                  <Text style={styles.ratingText}>
                    {book.average_rating
                      ? book.average_rating.toFixed(1)
                      : "0.0"}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => handleOpenReview(book.id)}>
                  <Text style={styles.linkText}>Añadir reseña</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* MODAL DE RESEÑA */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Reseña</Text>

            <Text style={styles.label}>Puntuación (1-5)</Text>
            <View style={styles.ratingSelector}>
              {[1, 2, 3, 4, 5].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.ratingOption,
                    rating === num.toString() && styles.ratingOptionSelected
                  ]}
                  onPress={() => setRating(num.toString())}
                >
                  <Text style={[
                    styles.ratingOptionText,
                    rating === num.toString() && styles.ratingOptionSelectedText
                  ]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Comentario</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="¿Qué te pareció el libro?"
              multiline
              numberOfLines={4}
              value={comment}
              onChangeText={setComment}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={submitReview}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Enviar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (Tus estilos anteriores se mantienen iguales)
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { padding: 20 },
  header: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    elevation: 4,
  },
  headerTitle: { fontSize: 28, fontWeight: "900", color: "#0f172a" },
  headerSubtitle: { fontSize: 16, color: "#64748b" },
  button: {
    backgroundColor: "#4f46e5",
    padding: 12,
    borderRadius: 16,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  grid: { gap: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    minHeight: 180,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  bookTitle: { fontSize: 20, fontWeight: "bold", color: "#1e293b" },
  bookAuthor: { fontSize: 16, fontStyle: "italic", color: "#475569" },
  yearBadge: {
    backgroundColor: "#cbd5e1",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  yearText: { fontSize: 10, fontWeight: "bold", color: "#64748b" },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 15,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fffbeb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingText: { fontSize: 16, fontWeight: "900", color: "#b45309" },
  star: { marginRight: 4 },
  linkText: { color: "#4f46e5", fontWeight: "bold" },

  // ESTILOS NUEVOS PARA EL MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1e293b",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#64748b",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  modalButtons: { flexDirection: "row", gap: 10 },
  modalButton: { flex: 1, padding: 15, borderRadius: 12, alignItems: "center" },
  cancelButton: { backgroundColor: "#e2e8f0" },
  submitButton: { backgroundColor: "#4f46e5" },
  cancelButtonText: { color: "#64748b", fontWeight: "bold" },
  submitButtonText: { color: "#fff", fontWeight: "bold" },

  // ESTILOS PARA EL SELECTOR DE PUNTAJE DE RESEÑAS
  ratingSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  ratingOption: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  ratingOptionSelected: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  ratingOptionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748b',
  },
  ratingOptionSelectedText: {
    color: '#ffffff',
  },
});
