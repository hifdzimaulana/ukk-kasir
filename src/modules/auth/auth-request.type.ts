import { Request } from 'express';
import { AppAbility } from '../casl/casl-ability.factory';
import { User } from '../user/user.entity';

export type AuthRequestType = Request & {
  user?: User & { ability: AppAbility };
};
