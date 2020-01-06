package supplychain

import (
	"encoding/json"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type Contract struct {
	contractapi.Contract
}

/**
 * To be used by a retailer when he orders a product
 * Usage: submitTransaction ('orderProduct', 'Order001', 'mango', 100.00, 100, 'farm1', 'walmart')
 */
func (sc *Contract) OrderProduct(ctx contractapi.TransactionContextInterface, args []byte) (o *Order, error) {
	userType, err := GetCurrentUserType(ctx)
	if err {
		return nil, err
	}
	
	if userType != "admin" && userType != "retailer" {
		return nil, errors.New("Unauthorized")
	}

	orderDetails := new(Order)
	err := json.Unmarshal(bytes, &orderDetails)
	if err != nil {
		return nil, fmt.Errorf("Error deserializing order details - %s", err.Error())
	}

	orderId := orderDetails.orderId
	orderAsBytes, err := ctx.GetStub().GetState(orderId)
	if (orderAsBytes) {
		return nil, fmt.Errorf("Order with orderID %s already exists", orderId)
	}

	order := Order{
		OrderId: orderDetails.orderId,
		ProductId: orderDetails.productId,
		Price: orderDetails.price,
		Quantity: orderDetails.quantity,
		ProducerId: orderDetails.producerId,
		ShipperId: orderDetails.shipperId,
		RetailerId: or	role, ok, err := ctx.GetAttributeValue("role")
		if err != nil {
		return nil, fmt.Errorf("Error retrieving attribute `role` %s", err.Error())
		}
	
		if !ok {
		return nil, errors.New("Client doesn't have attribute role")
		}derDetails.retailerId
	}
	order.SetStateToOrderCreated()

	dataAsBytes, err := order.Serialize()
	if (err) {
		return nil, fmt.Errorf("Error occured while serialzing %s", err.Error())
	}


	err = ctx.GetStub().PutState(orderId, dataAsBytes)
	if err {
		return nil, errors.New("Failed to update state")
	}

	return &order, nil
}

func (sc *Contract) ReceiveOrder(ctx contractapi.TransactionContextInterface, orderId string) (o *Order, error) {
	userType, err := GetCurrentUserType(ctx)
	if err {
		return nil, err
	}
	
	if userType != "admin" && userType != "producer" {
		return nil, errors.New("Unauthorized")
	}

	if orderId == nil {
		return nil, errors.New("OrderID is required")
	}

	orderDetailsAsBytes, err := ctx.GetStub().GetState(orderId)
	if err {
		return nil, shim.Error(`Error occurred while processing %s`, err.Error())
	}

	if orderDetailsAsBytes == nil {
		return nil, fmt.Errorf("Order with the specified orderID %s not found", orderId)
	}

	order, err := Deserialize(orderDetailsAsBytes)
	if err {
		return nil, fmt.Errorf("Order details could not be retrieved %s", err.Error())
	}

	order.SetStateToOrderReceived()

	dataAsBytes, err := order.Serialize()
	if (err) {
		return nil, fmt.Errorf("Error occured while serialzing %s", err.Error())
	}

	err = ctx.GetStub().PutState(orderId, dataAsBytes)
	if err {
		return nil, errors.New("Failed to update state")
	}
	
	return &order, nil
}

func (sc *Contract) AssignShipper(ctx contractapi.TransactionContextInterface, orderId string, shipperId string) (o *Order, error) {
	userType, err umer:= GetCurrentUserType(ctx)
	if err {
		return nil, err
	}
	
	if userType != "admin" && userType != "producer" {
		return nil, errors.New("Unauthorized")
	}

	if orderId == nil {
		return nil, errors.New("OrderID is required")
	}

	orderDetailsAsBytes, err := ctx.GetStub().GetState(orderId)
	if err {
		return nil, shim.Error(`Error occurred while processing %s`, err.Error())
	}

	if orderDetailsAsBytes == nil {
		return nil, fmt.Errorf("Order with the specified orderID %s not found", orderId)
	}

	order, err := Deserialize(orderDetailsAsBytes)
	if err {
		return nil, fmt.Errorf("Order details could not be retrieved %s", err.Error())
	}

	userId := GetCurrentUserId(ctx)
	if userId != order.ProducerId && userId != "admin" {
		return nil, errors.New("Unauthorized")
	}

	order.SetStateToShipmentAssigned()

	dataAsBytes, err := order.Serialize()
	if (err) {
		return nil, fmt.Errorf("Error occured while serialzing %s", err.Error())
	}

	err = ctx.GetStub().PutState(orderId, dataAsBytes)
	if err {
		return nil, errors.New("Failed to update state")
	}
	
	return &order, nil
}

func (sc *Contract) CreateShipment(ctx contractapi.TransactionContextInterface, orderId string, transportInfo string) (o *Order, error) {
	userType, err umer:= GetCurrentUserType(ctx)
	if err {
		return nil, err
	}
	
	if userType != "admin" && userType != "shipper" {
		return nil, errors.New("Unauthorized")
	}

	if orderId == nil {
		return nil, errors.New("OrderID is required")
	}

	orderDetailsAsBytes, err := ctx.GetStub().GetState(orderId)
	if err {
		return nil, shim.Error(`Error occurred while processing %s`, err.Error())
	}

	if orderDetailsAsBytes == nil {
		return nil, fmt.Errorf("Order with the specified orderID %s not found", orderId)
	}

	order, err := Deserialize(orderDetailsAsBytes)
	if err {
		return nil, fmt.Errorf("Order details could not be retrieved %s", err.Error())
	}

	userId := GetCurrentUserId(ctx)
	if userId != order.ShipperId && userId != "admin" {
		return nil, errors.New("Unauthorized")
	}

	order.SetStateToShipmentCreated()
	order.SetTrackingInfo(transportInfo)

	dataAsBytes, err := order.Serialize()
	if (err) {
		return nil, fmt.Errorf("Error occured while serialzing %s", err.Error())
	}

	err = ctx.GetStub().PutState(orderId, dataAsBytes)
	if err {
		return nil, errors.New("Failed to update state")
	}
	
	return &order, nil
}

func (sc *Contract) TransportShipment(ctx contractapi.TransactionContextInterface, orderId string, shipperId string) (o *Order, error) {
	userType, err umer:= GetCurrentUserType(ctx)
	if err {
		return nil, err
	}
	
	if userType != "admin" && userType != "shipper" {
		return nil, errors.New("Unauthorized")
	}

	if orderId == nil {
		return nil, errors.New("OrderID is required")
	}

	orderDetailsAsBytes, err := ctx.GetStub().GetState(orderId)
	if err {
		return nil, shim.Error(`Error occurred while processing %s`, err.Error())
	}

	if orderDetailsAsBytes == nil {
		return nil, fmt.Errorf("Order with the specified orderID %s not found", orderId)
	}

	order, err := Deserialize(orderDetailsAsBytes)
	if err {
		return nil, fmt.Errorf("Order details could not be retrieved %s", err.Error())
	}

	userId := GetCurrentUserId(ctx)
	if userId != order.ShipperId && userId != "admin" {
		return nil, errors.New("Unauthorized")
	}

	order.SetStateToShipmentInTransit()

	dataAsBytes, err := order.Serialize()
	if (err) {
		return nil, fmt.Errorf("Error occured while serialzing %s", err.Error())
	}

	err = ctx.GetStub().PutState(orderId, dataAsBytes)
	if err {
		return nil, errors.New("Failed to update state")
	}
	
	return &order, nil
}

func (sc *Contract) ReceiveShipment(ctx contractapi.TransactionContextInterface, orderId string, shipperId string) (o *Order, error) {
	userType, err umer:= GetCurrentUserType(ctx)
	if err {
		return nil, err
	}
	
	if userType != "admin" && userType != "retailer" {
		return nil, errors.New("Unauthorized")
	}

	if orderId == nil {
		return nil, errors.New("OrderID is required")
	}

	orderDetailsAsBytes, err := ctx.GetStub().GetState(orderId)
	if err {
		return nil, shim.Error(`Error occurred while processing %s`, err.Error())
	}

	if orderDetailsAsBytes == nil {
		return nil, fmt.Errorf("Order with the specified orderID %s not found", orderId)
	}

	order, err := Deserialize(orderDetailsAsBytes)
	if err {
		return nil, fmt.Errorf("Order details could not be retrieved %s", err.Error())
	}

	userId := GetCurrentUserId(ctx)
	if userId != order.RetailerId && userId != "admin" {
		return nil, errors.New("Unauthorized")
	}

	order.SetStateToShipmentReceived()

	dataAsBytes, err := order.Serialize()
	if (err) {
		return nil, fmt.Errorf("Error occured while serialzing %s", err.Error())
	}

	err = ctx.GetStub().PutState(orderId, dataAsBytes)
	if err {
		return nil, errors.New("Failed to update state")
	}
	
	return &order, nil
}

func (sc *Contract) QueryOrder(ctx contractapi.TransactionContextInterface, orderId string) (o *Order, error) {
	if orderId == nil {
		return nil, erros.New("OrderID is missing")
	}

	orderDetailsAsBytes, err := ctx.GetStub().GetState(orderId)
	if err {
		return nil, shim.Error(`Error occurred while processing %s`, err.Error())
	}

	if orderDetailsAsBytes == nil {
		return nil, fmt.Errorf("Order with the specified orderID %s not found", orderId)
	}

	order, err := Deserialize(orderDetailsAsBytes)
	if err {
		return nil, fmt.Errorf("Order details could not be retrieved %s", err.Error())
	}

	userId := GetCurrentUserId(ctx)
	
	// Check permissions
	if userId != "admin" && userId != order.ProducerId && userId != order.RetailerId && userId != order.ShipperId {
		return nil, errors.new("Unauthorized")
	}

	return orderDetailsAsBytes, nil
}

func Deserialize(data []byte) (o *Order, error) {
	o := new(Order)
	err := json.Unmarshal(data, &o)

	if (err) {
		return nil, err
	}

	return o, nil
}

func GetCurrentUserId(ctx contractapi.TransactionContextInterface) {
	id, err := ctx.GetID()
	if err {
		return nil, fmt.Errorf("Error retrieving user ID %s", err.Error())
	}

	return id, nil
}

func GetCurrentUserType(ctx contractapi.TransactionContextInterface) {
	userType, ok, err := ctx.GetAttributeValue("userType")
	if err != nil {
	return nil, fmt.Errorf("Error retrieving attribute `role` %s", err.Error())
	}

	if !ok {
	return nil, errors.New("Client doesn't have attribute role")
	}

	return userType, nil
}