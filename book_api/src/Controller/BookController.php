<?php

namespace App\Controller;

use App\Service\BookService;
use App\Service\ReviewService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class BookController extends AbstractController
{
    public function __construct(
        private BookService $bookService,
        private ReviewService $reviewService
    ) {}

    #[Route('/books', name: 'books_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        return $this->json($this->bookService->getAllBooksWithRating());
    }


    #[Route('/reviews', name: 'review_create', methods: ['POST'])]
    public function createReview(Request $request): JsonResponse
    {
        $data = $request->toArray();    # Obtiene el contenido JSON decodificado como un arreglo y arroja excepción si no es válido

        # Crea la reseña usando el servicio
        $review = $this->reviewService->createReview($data);
        return $this->json([
            'status' => 'success',
            'message' => 'Reseña creada correctamente',
            'data' => [
                'id' => $review->getId(),
                'created_at' => $review->getCreatedAt()->format('Y-m-d H:i:s')
            ]
        ], Response::HTTP_CREATED);
    }
}
