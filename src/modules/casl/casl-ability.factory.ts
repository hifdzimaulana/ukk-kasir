import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
  ConditionsMatcher,
  MatchConditions,
  FieldMatcher,
} from '@casl/ability';

import { Injectable } from '@nestjs/common';
import { DetailTransaksi } from '../detail-transaksi/detail-transaksi.entity';
import { Meja } from '../meja/meja.entity';
import { Menu } from '../menu/menu.entity';
import { Transaksi } from '../transaksi/transaksi.entity';
import { User, USER_ROLES } from '../user/user.entity';

export type Subjects =
  | InferSubjects<
      | typeof User
      | typeof Meja
      | typeof Menu
      | typeof Transaksi
      | typeof DetailTransaksi
    >
  | 'all';

export enum Actions {
  Manage = 'manage',
  Read = 'read',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

export type AppAbility = PureAbility<[Actions, Subjects]>;

export const fieldMatcher: FieldMatcher = (fields) => (field) =>
  fields.includes(field);
export const lambdaMatcher: ConditionsMatcher<MatchConditions> = (
  matchConditions,
) => matchConditions;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<AppAbility>(
      PureAbility as AbilityClass<AppAbility>,
    );

    switch (user.role) {
      case USER_ROLES.ADMIN:
        can(Actions.Manage, [User, Menu, Meja]);
        break;
      case USER_ROLES.MANAJER:
        can(Actions.Read, 'all');
        break;
      default:
        can(Actions.Create, [Transaksi, DetailTransaksi]);
        can(Actions.Read, Transaksi, {
          user: { id: user.id },
        });
        can(Actions.Update, Transaksi, ['status']);
        break;
    }

    return build({
      detectSubjectType: (item) => {
        return item.constructor as ExtractSubjectType<Subjects>;
      },
      fieldMatcher: fieldMatcher,
      conditionsMatcher: lambdaMatcher,
    });
  }
}
