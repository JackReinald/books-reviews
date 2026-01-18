<?php

namespace App\Service;

use App\Entity\Book;
use App\Entity\Review;
use App\Repository\BookRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class BookService
{
    public function __construct(
        private BookRepository $bookRepository,
        private EntityManagerInterface $em,
        private ValidatorInterface $validator
    ) {}

    /**
     * Obtiene todos los libros con su promedio, formateando el rating.
     */
    public function getAllBooksWithRating(): array
    {
        $books = $this->bookRepository->findAllWithAverageRating();

        return array_map(function ($book) {
            $book['average_rating'] = $book['average_rating'] ? (float)$book['average_rating'] : null;
            return $book;
        }, $books);
    }

    /**
     * Lógica para registrar una nueva reseña con validaciones.
     * Si el libro no existe, lanza una excepción que capturará el manejador global.
     */
/*     public function createReview(array $data): Review
    {
        $book = $this->bookRepository->find($data['book_id'] ?? 0); # Se asegura de que el book_id exista. El operador '??' vuelve cero a book_id 
        # si es que no encuentra su correspondiente objeto en el arreglo $data 

        if (!$book) {
            throw new NotFoundHttpException('El libro con ID ' . ($data['book_id'] ?? 0) . ' no existe.');
        }

        $review = new Review();
        $review->setRating($data['rating'] ?? null);
        $review->setComment($data['comment'] ?? '');
        $review->setBook($book);

        // Valida la entidad según los #[Assert] definidos

        $this->validateEntity($review);

        $this->em->persist($review);
        $this->em->flush();

        return $review;
    } */

    private function validateEntity($entity): void
    {
        $errors = $this->validator->validate($entity);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[] = $error->getMessage();
            }
            throw new BadRequestHttpException(json_encode($messages));
        }
    }
}
