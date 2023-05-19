import React, { useEffect } from "react";
import OrdersShowStore from "./store";
import { observer } from "mobx-react-lite";
import styles from "./styles.m.styl";
import DeliveryType from "~/components/DeliveryType";
import OrderStatus from "~/components/OrderStatus";
import ProductStatus from "~/components/ProductStatus";

const OrdersShow = observer(
    (): JSX.Element => {
        const [state] = React.useState(new OrdersShowStore());

        useEffect(() => {
            if (state.initialized) return;
            state.initialize();
        });

        return (
            <div className={styles.screenWrapper}>
                <div className={styles.screen}>
                    {state.loading && <span>Loading...</span>}
                    {!state.loading && (
                        <div className={styles.items}>
                            <div className={styles.header}>
                                <div>{state.order?.number}</div>
                                <div>
                                    {state.order?.status && (
                                        <OrderStatus
                                            code={state.order?.status}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className={styles.bodyRow}>
                                Delivery:{" "}
                                {state.order?.delivery && (
                                    <DeliveryType
                                        code={state.order.delivery?.code}
                                    />
                                )}
                            </div>
                            <div className={styles.divider}></div>
                            <div className={styles.bodyRow}>
                                <div className={styles.table}>
                                    {state.order?.items.map((item, index) => (
                                        <div
                                            className={styles.row}
                                            key={`${state.order?.id}_${index}`}
                                        >
                                            <div className={styles.cell}>
                                                <ProductStatus
                                                    code={item.status}
                                                />
                                            </div>
                                            <div className={styles.cell}>
                                                {item.offer.displayName}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

export default OrdersShow;
