package supplychain

import (
	"encoding/json"
)

type OrderState uint

const (
	ORDER_CREATED = 1       // Retailer
    ORDER_RECEIVED = 2      // Producer
    SHIPMENT_ASSIGNED = 3   // Producer
    SHIPMENT_CREATED = 4    // Shipper
    SHIPMENT_IN_TRANSIT = 5 // Shipper
    SHIPMENT_RECEIVED = 6   // Retailer
    ORDER_CLOSED = 7  
)

type Order struct {
	OrderId string `json:"orderId"`
	ProductId string `json:"productI"d`
	Price float32 `json:"price"`
	Quantity int `json:"quantity"`
	ProducerId string `json:"producerId"`
	ShipperId string `json:"shipperId"`
	RetailerId string `json:"retailerId"`
	TrackingInfo string `json:"trackingInfo"`

	State OrderState `metadata:"state"`
	class string `metadata:"class"`

	GetClass func() string
}

// Class methods

func (o *Order) SetStateToOrderCreated() {
	o.State = ORDER_CREATED
}

func (o *Order) SetStateToOrderReceived() {
	o.State = ORDER_RECEIVED
}

func (o *Order) SetStateToShipmentAssigned() {
	o.State = SHIPMENT_ASSIGNED
}

func (o *Order) SetStateToShipmentCreated() {
	o.State = SHIPMENT_CREATED
}

func (o *Order) SetStateToShipmentInTransit() {
	o.State = SHIPMENT_IN_TRANSIT
}

func (o *Order) SetStateToShipmentReceived() {
	o.State = SHIPMENT_RECEIVED
}

func (o *Order) SetStateToOrderClosed() {
	o.State = ORDER_CLOSED
}

func (o *Order) SetTrackingInfo(trackingInfo string) {
	o.TrackingInfo = trackingInfo
}

func (o * Order) GetState() OrderState {
	return o.State
}

func (o *Order) GetOrderId() string {
	return o.OrderId
}

func (o *Order) Serialize() ([]byte, error) {
	dataAsBytes, err := json.Marshal(o)

	if (err) {
		return nil, err
	}

	return dataAsBytes, nil
}

func GetClass() string {
	return "org.supplychainnet.order"
}
