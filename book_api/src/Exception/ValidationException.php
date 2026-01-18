<?php

namespace App\Exception;

use Symfony\Component\HttpKernel\Exception\HttpException;

class ValidationException extends HttpException
{
    private array $errors;

    public function __construct(array $errors)
    {
        $this->errors = $errors;
        // 400 es el código de estado para errores de validación
        parent::__construct(400, 'Error de validación');
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}