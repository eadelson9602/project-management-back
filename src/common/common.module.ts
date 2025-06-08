import { Module } from '@nestjs/common';
import { AdvancedSearchService } from './services/advanced-search.service';

@Module({
  providers: [AdvancedSearchService],
  exports: [AdvancedSearchService],
})
export class CommonModule {}
