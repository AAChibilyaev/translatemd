#!/usr/bin/env node
import 'module-alias/register';
import { CliService } from '@cli/cli-service';

CliService.run(process.argv.slice(2)).catch((error: unknown) => {
  console.error('Fatal error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});