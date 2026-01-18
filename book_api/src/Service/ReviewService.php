<?php

namespace App\Service;

use App\Entity\Review;
use App\Repository\BookRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ReviewService
{
    public function __construct(
        private BookRepository $bookRepository,
        private EntityManagerInterface $em,
        private ValidatorInterface $validator
    ) {}

    public function createReview(array $data): Review
    {
        $book = $this->bookRepository->find($data['book_id'] ?? 0);
        
        if (!$book) {
            throw new NotFoundHttpException('No se puede crear la reseña: El libro no existe.');
        }

        $review = new Review();
        $review->setRating($data['rating'] ?? null);
        $review->setComment($data['comment'] ?? '');
        $review->setBook($book);

        $this->validateEntity($review);

        $this->em->persist($review);
        $this->em->flush();

        return $review;
    }

    private function validateEntity(Review $review): void
    {
        $errors = $this->validator->validate($review);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[] = $error->getMessage();
            }
            throw new BadRequestHttpException(json_encode($messages));
        }
    }
}