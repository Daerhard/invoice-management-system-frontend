import { atom } from 'jotai';
import { CardmarketOrder, Customer, Invoice, PurchaseInvoice } from '../api/generated/Schemas'
import { Dayjs } from 'dayjs'

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
export const savedInvoicesAtom = atom<Invoice[]>([])

export const customerSelectAtom = atom<Customer | null>(null)
export const cardmarketOrderSelectAtom = atom<CardmarketOrder | null>(null)
export const startDateSelectAtom = atom<Dayjs | null>(null)
export const endDateSelectAtom = atom<Dayjs | null>(null)
export const businessCustomerSelectAtom = atom<boolean>(false)