import { atom } from 'jotai';
import { CardmarketOrder, Customer } from '../api/generated/Schemas'
import dayjs, { Dayjs } from 'dayjs'

export const cardmarketOrdersAtom = atom<CardmarketOrder[]>([])
export const customersAtom = atom<Customer[]>([])

export const customerSelectAtom = atom<Customer | null>(null)
export const cardmarketOrderSelectAtom = atom<CardmarketOrder | null>(null)
export const startDateSelectAtom = atom<Dayjs>(dayjs())
export const endDateSelectAtom = atom<Dayjs>(dayjs())