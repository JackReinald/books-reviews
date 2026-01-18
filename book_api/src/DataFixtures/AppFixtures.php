<?php

namespace App\DataFixtures;

use App\Entity\Book;
use App\Entity\Review;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Datos de ejemplo de los libros
        $booksData = [
            ['title' => 'El Arte de Programar', 'author' => 'Donald Knuth', 'year' => 1968],
            ['title' => 'Clean Code', 'author' => 'Robert C. Martin', 'year' => 2008],
            ['title' => 'Refactoring', 'author' => 'Martin Fowler', 'year' => 1999],
        ];

        foreach ($booksData as $data) {

            $book = new Book();
            $book->setTitle($data['title']);
            $book->setAuthor($data['author']);
            $book->setPublishedYear($data['year']);
            $manager->persist($book);

            // Crea 2 reseñas para cada libro (Total 6)
            for ($i = 1; $i <= 2; $i++) {
                $review = new Review();
                $review->setRating(rand(1, 5)); // Es aquí donde se asigna un puntaje al azar entre 1 y 5
                $review->setComment("Esta es la opinión $i del libro " . $data['title']);
                $review->setBook($book);

                // El createdAt se llena solo en el constructor si antes se lo configura    
                $manager->persist($review);
            }
        }

        $manager->flush();  # Persistencia de los datos en la base de datos
    }
}
