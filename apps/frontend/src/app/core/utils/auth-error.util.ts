import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '@luthiers/utils';

export function parseAuthError(err: unknown): Record<string, string> {
  const errors: Record<string, string> = {};

  if (err instanceof HttpErrorResponse && err.error) {
    const errorBody = err.error as ErrorResponse;
    if (errorBody.details) {
      if (Array.isArray(errorBody.details)) {
        errors['global'] = errorBody.details.join(', ');
      } else {
        // Record<string, string[]>
        for (const [key, messages] of Object.entries(errorBody.details)) {
          errors[key] = messages.join(', ');
        }
      }
    } else if (errorBody.message) {
      errors['global'] = errorBody.message;
    }
  } else if (err instanceof Error) {
    errors['global'] = err.message;
  } else {
    errors['global'] = 'Ocorreu um erro inesperado.';
  }

  return errors;
}
