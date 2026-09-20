import { Injectable } from '@nestjs/common';

@Injectable()
export class LibraryService {
  private readonly libraryUrl = process.env.LIBRARY_SERVICE_URL;

  findByUserId(userId: string) {
    // TODO: llamar al microservicio de biblioteca
    return {
      message: 'LibraryService.findByUserId not implemented',
      userId,
    };
  }
}