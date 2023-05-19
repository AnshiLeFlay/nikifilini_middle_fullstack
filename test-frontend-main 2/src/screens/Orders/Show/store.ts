import { makeAutoObservable } from "mobx";
import { SingleOrder } from "~/screens/Orders/Show/types";
import { createBrowserHistory, History } from "history";
import client from "api/gql";
import { ORDER_QUERY } from "./queries";

export default class OrdersShowStore {
    order: SingleOrder | null = null;
    id: string | null = null;
    loading: boolean = false;
    history: History;
    initialized = false;

    setInitialized(val: boolean) {
        this.initialized = val;
    }

    constructor() {
        makeAutoObservable(this);

        this.history = createBrowserHistory();

        const path = this.history.location.pathname;
        const orderID = path.split("/").pop();

        if (orderID) if (parseInt(orderID) > 0) this.id = orderID;
    }

    async loadOrder() {
        //console.log(this.history);
        this.loading = true;

        await client
            .query(ORDER_QUERY, { number: this.id })
            .toPromise()
            .then((res: any) => {
                console.log("order res", res);
                this.order = res.data.order;
            })
            .catch((err: any) => {
                console.log(err);
            });

        this.loading = false;
    }

    initialize() {
        if (this.initialized) return;
        this.initialized = true;
        this.loadOrder();
    }
}
