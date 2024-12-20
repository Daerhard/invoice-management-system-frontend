import { atom } from 'jotai';
import { CardmarketOrder, Customer } from '../api/generated/Schemas'

export const cardmarketOrdersAtom = atom<CardmarketOrder[]>([]);

export const customersAtom = atom<Customer[]>([]);