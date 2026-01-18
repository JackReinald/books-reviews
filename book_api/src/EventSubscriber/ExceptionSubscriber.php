<?php

namespace App\EventSubscriber;

use App\Exception\ValidationException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class ExceptionSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            // Decimos que queremos escuchar cuando ocurra una excepción
            KernelEvents::EXCEPTION => 'onKernelException',
        ];
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        $response = new JsonResponse();

        // Si es nuestra excepción de validación personalizada
        if ($exception instanceof ValidationException) {
            $response->setData(['errors' => $exception->getErrors()]);
            $response->setStatusCode(400);
        }
        // Si es una excepción de Symfony (como un 404 o 403)
        elseif ($exception instanceof HttpExceptionInterface) {
            $response->setData(['error' => $exception->getMessage()]);
            $response->setStatusCode($exception->getStatusCode());
        }
        // Error genérico (500)
        else {
            $response->setData([
                'error' => 'Ocurrió un error interno en el servidor.',
                'debug_message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine()
            ]);

            $response->setStatusCode(500);
        }

        $event->setResponse($response);
    }
}
