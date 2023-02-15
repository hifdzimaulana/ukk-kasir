import { Module } from '@nestjs/common';
import { CaslAbiltyFactory } from './casl-abilty.factory';

@Module({
  providers: [CaslAbiltyFactory],
  exports: [CaslAbiltyFactory],
})
export class CaslModule {}
