import { Request } from 'express';
import { AppAbility } from '../casl/casl-abilty.factory';
import { User } from '../user/user.entity';

export type AuthRequestType = Request & {
  user?: User & { ability: AppAbility };
};
