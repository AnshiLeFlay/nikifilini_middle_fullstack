import { createContext, useContext } from "react";
import client from "api/gql";
import {
    DELIVERY_TYPES_QUERY,
    ORDER_STATUSES_QUERY,
    PRODUCT_STATUSES_QUERY,
} from "~/screens/queries";
import { CrmType } from "~/api/types/crmType";
import { makeAutoObservable } from "mobx";

type Status = null | Promise<any> | true;

export class GlobalState {
    data: {
        orderStatuses: CrmType[];
        deliveryTypes: CrmType[];
        productStatuses: CrmType[];
    } = {
        orderStatuses: [],
        deliveryTypes: [],
        productStatuses: [],
    };

    status: {
        orderStatuses: Status;
        deliveryTypes: Status;
        productStatuses: Status;
    } = {
        orderStatuses: null,
        deliveryTypes: null,
        productStatuses: null,
    };

    initialized = false;

    constructor() {
        makeAutoObservable(this);
    }

    get orderStatuses() {
        if (this.status.orderStatuses === null) {
        }
        return this.data.orderStatuses;
    }

    setOrderStatuses(statuses: CrmType[]) {
        console.log(statuses);
        this.data.orderStatuses = statuses;
        this.status.orderStatuses = true;
    }

    setProductStatuses(statuses: CrmType[]) {
        this.data.productStatuses = statuses;
        this.status.productStatuses = true;
    }

    setDeliveryTypes(statuses: CrmType[]) {
        this.data.deliveryTypes = statuses;
        this.status.deliveryTypes = true;
    }

    get productStatuses() {
        if (this.status.productStatuses === null) {
        }
        return this.data.productStatuses;
    }

    get deliveryTypes() {
        if (this.status.deliveryTypes === null) {
        }
        return this.data.deliveryTypes;
    }

    async load() {
        client
            .query(DELIVERY_TYPES_QUERY)
            .toPromise()
            .then((res) => this.setDeliveryTypes(res.data.deliveryTypes));

        client
            .query(PRODUCT_STATUSES_QUERY)
            .toPromise()
            .then((res) => this.setProductStatuses(res.data.productStatuses));

        client
            .query(ORDER_STATUSES_QUERY)
            .toPromise()
            .then((res) => {
                console.log("order statuses", res);
                this.setOrderStatuses(res.data.orderStatuses);
            });
    }

    async initialize() {
        if (this.initialized) return;

        await this.load();

        this.initialized = true;
    }
}

export const GlobalStateContext = createContext(new GlobalState());
export const GlobalStateProvider = GlobalStateContext.Provider;

export function useGlobalState() {
    return useContext(GlobalStateContext);
}
