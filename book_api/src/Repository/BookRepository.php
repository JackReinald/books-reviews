<?php

namespace App\Repository;

use App\Entity\Book;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Book>
 */
class BookRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Book::class);
    }

    public function findAllWithAverageRating(): array
    {
        return $this->createQueryBuilder('b')
            ->select('b.id', 'b.title', 'b.author', 'b.published_year')
            ->addSelect('AVG(r.rating) as average_rating')
            ->leftJoin('b.reviews', 'r')
            ->groupBy('b.id')
            ->getQuery()
            ->getResult();
    }
}
