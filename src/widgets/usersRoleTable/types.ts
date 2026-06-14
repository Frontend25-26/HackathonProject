import { User } from '@/shared/types';

export type UserTableRow = User & { readonly initials: string };
