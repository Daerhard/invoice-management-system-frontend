import { atom } from 'jotai';
import { CardmarketOrder, Customer, PurchaseInvoice } from '../api/generated/Schemas'
import dayjs, { Dayjs } from 'dayjs'

export interface Einkauf {
    id: number;
    produktname: string;
    anzahlDisplays: number;
    preis: number;
    datum: string;
}

export const cardmarketOrdersAtom = atom<CardmarketOrder[]>([])
export const customersAtom = atom<Customer[]>([])
export const einkaeufeAtom = atom<Einkauf[]>([])
export const purchaseInvoicesAtom = atom<PurchaseInvoice[]>([])

export const customerSelectAtom = atom<Customer | null>(null)
export const cardmarketOrderSelectAtom = atom<CardmarketOrder | null>(null)
export const startDateSelectAtom = atom<Dayjs>(dayjs().startOf('month'))
export const endDateSelectAtom = atom<Dayjs>(dayjs().endOf('month'))
export const businessCustomerSelectAtom = atom<boolean>(false)