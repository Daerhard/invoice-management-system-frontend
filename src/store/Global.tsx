import { atom } from 'jotai';
import { CardmarketOrder, Customer } from '../api/generated/Schemas'
import dayjs, { Dayjs } from 'dayjs'

export const cardmarketOrdersAtom = atom<CardmarketOrder[]>([])
export const customersAtom = atom<Customer[]>([])

export const customerSelectAtom = atom<Customer | null>(null)
export const cardmarketOrderSelectAtom = atom<CardmarketOrder | null>(null)
export const startDateSelectAtom = atom<Dayjs>(dayjs().startOf('year'))
export const endDateSelectAtom = atom<Dayjs>(dayjs().endOf('year'))
export const businessCustomerSelectAtom = atom<boolean>(false)