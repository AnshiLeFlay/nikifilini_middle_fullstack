import { Injectable } from '@nestjs/common'
import { CrmType, Order, OrdersFilter, RetailPagination } from './types'
import axios, { AxiosInstance } from 'axios'
import { ConcurrencyManager } from 'axios-concurrency'
import { serialize } from '../tools'
import { plainToClass } from 'class-transformer'
import { OrdersResponse } from 'src/graphql'

@Injectable()
export class RetailService {
  private readonly axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: `${process.env.RETAIL_URL}/api/v5`,
      timeout: 10000,
      headers: {},
    })

    this.axios.interceptors.request.use((config) => {
      console.log(config.url)

      const retailKey = process.env.RETAIL_KEY

      console.log(retailKey)

      if (config.headers && retailKey)
        config.headers = { 'X-API-KEY': retailKey }

      return config
    })
    this.axios.interceptors.response.use(
      (r) => {
        console.log('Result:', r.data)
        return r
      },
      (r) => {
        console.log('Error:', r.response.data)
        return r
      },
    )
  }

  async orders(filter?: OrdersFilter): Promise<OrdersResponse> {
    //async orders(filter?: OrdersFilter): Promise<[Order[], RetailPagination]> {
    const params = serialize(filter, '')
    const resp = await this.axios.get('/orders?' + params)

    if (!resp.data) throw new Error('RETAIL CRM ERROR (0)')

    const orders = plainToClass(Order, resp.data.orders as Array<any>)
    const pagination: RetailPagination = resp.data.pagination

    return { orders, pagination }
  }

  /* */
  async findOrder(id: string): Promise<Order | null> {
    const res = await this.axios.get(`/orders/${id}`, {
      params: { site: 'demo-magazin' },
    })
    if (!res.data) throw new Error('RETAIL CRM ERROR (1)')

    const order = plainToClass(Order, res.data.order)
    return order
  }

  async orderStatuses(): Promise<CrmType[]> {
    const res = await this.axios.get('/orders/orders-statuses', {
      params: { site: 'demo-magazin' },
    })
    if (!res?.data.orderStatuses) throw new Error('RETAIL CRM ERROR (2)')

    const statuses = plainToClass(CrmType, res.data.orderStatuses)
    return Object.values(statuses)
  }

  async productStatuses(): Promise<CrmType[]> {
    const res = await this.axios.get('/reference/product-statuses')

    if (!res?.data.productStatuses) throw new Error('RETAIL CRM ERROR (3)')

    const statuses = plainToClass(CrmType, res.data.productStatuses)
    return Object.values(statuses)
  }

  async deliveryTypes(): Promise<CrmType[]> {
    const res = await this.axios.get('/reference/delivery-types')

    if (!res?.data.deliveryTypes) throw new Error('RETAIL CRM ERROR (4)')

    const types = plainToClass(CrmType, res.data.deliveryTypes)
    return Object.values(types)
  }
  /* */
}
