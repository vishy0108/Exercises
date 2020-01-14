import { Application, Router, Request, Response, request } from "express";
import { handleError } from "../errorHandler";
import { HTTP_RESPONSE_CODES } from "../errors";
import { CONTRACT_METHODS } from "../config";

const { STATUS_SUCCESS } = HTTP_RESPONSE_CODES;

export const supplyChainRouter = (app: Application) => {
  const router = Router();
  const fabricCAClient = app.get("fabric-ca-client");

  router.get("/orders", async (req: Request, res: Response) => {
    try {
      const queryOrderResponse = await fabricCAClient.submitTransaction(
        CONTRACT_METHODS.QUERY_ALL_ORDERS,
        ""
      );
      return res.status(STATUS_SUCCESS).send(queryOrderResponse);
    } catch (error) {
      return handleError(res, error);
    }
  });

  router.get("/orders/:id", async (req: Request, res: Response) => {
    try {
      const orderID = req.params.id;
      const queryOrderResponse = await fabricCAClient.submitTransaction(
        CONTRACT_METHODS.QUERY_ORDER_ID,
        orderID
      );
      return res.status(STATUS_SUCCESS).send(queryOrderResponse);
    } catch (error) {
      return handleError(res, error);
    }
  });

  router.post("/orders", async (req: Request, res: Response) => {
    try {
      const createOrderResponse = await fabricCAClient.submitTransaction(
        CONTRACT_METHODS.ORDER_PRODUCT,
        JSON.stringify(request.body)
      );
      console.log(createOrderResponse);
      return res.status(STATUS_SUCCESS).send(createOrderResponse);
    } catch (error) {
      return handleError(res, error, "There was a problem placing the order");
    }
  });

  router.put("/orders/:id/receive", async (req: Request, res: Response) => {
    try {
      const orderID = req.params.id;
      const receiveOrderResponse = await fabricCAClient.submitTransaction(
        CONTRACT_METHODS.RECEIVE_ORDER,
        orderID
      );
      return res.status(STATUS_SUCCESS).send(receiveOrderResponse);
    } catch (error) {
      return handleError(
        res,
        error,
        `There was a problem in receiving order with ID ${request.params.id}`
      );
    }
  });

  router.put(
    "/orders/:id/assign-shipper",
    async (req: Request, res: Response) => {
      try {
        const orderID = req.params.id;
        const assignShipperResponse = await fabricCAClient.submitTransaction(
          CONTRACT_METHODS.ASSIGN_SHIPPER,
          orderID
        );
        return res.status(STATUS_SUCCESS).send(assignShipperResponse);
      } catch (error) {
        return handleError(
          res,
          error,
          `There was a problem assigning shipper for order, ${request.params.id}`
        );
      }
    }
  );

  router.put(
    "/orders/:id/create-shipment",
    async (req: Request, res: Response) => {
      try {
        const orderID = req.params.id;
        const assignShipperResponse = await fabricCAClient.submitTransaction(
          CONTRACT_METHODS.CREATE_SHIPMENT,
          orderID
        );
        return res.status(STATUS_SUCCESS).send(assignShipperResponse);
      } catch (error) {
        return handleError(
          res,
          error,
          `There was a problem in creating shipment for order, ${request.params.id}`
        );
      }
    }
  );

  router.put(
    "/orders/:id/transit-shipment",
    async (req: Request, res: Response) => {
      try {
        const orderID = req.params.id;
        const transportShipmentResponse = await fabricCAClient.submitTransaction(
          CONTRACT_METHODS.TRANSPORT_SHIPEMNT,
          orderID
        );
        return res.status(STATUS_SUCCESS).send(transportShipmentResponse);
      } catch (error) {
        return handleError(
          res,
          error,
          `There was a problem initiating shipment transport for order, ${request.params.id}`
        );
      }
    }
  );

  router.put(
    "/orders/:id/receive-shipment",
    async (req: Request, res: Response) => {
      try {
        const orderID = req.params.id;
        const receiveShipmentResponse = await fabricCAClient.submitTransaction(
          CONTRACT_METHODS.RECEIVE_SHIPMENT,
          orderID
        );
        return res.status(STATUS_SUCCESS).send(receiveShipmentResponse);
      } catch (error) {
        return handleError(
          res,
          error,
          `There was a problem in receiving shipment for order, ${request.params.id}`
        );
      }
    }
  );

  router.delete("/orders/:id", async (req: Request, res: Response) => {
    try {
      const orderID = req.params.id;
      const deleteOrderResponse = await fabricCAClient.submitTransaction(
        CONTRACT_METHODS.DELETE_ORDER,
        orderID
      );
      return res.status(STATUS_SUCCESS).send(deleteOrderResponse);
    } catch (error) {
      return handleError(
        res,
        error,
        `There was a problem in deleting order, ${request.params.id}`
      );
    }
  });

  router.get("/order-history/:id", async (req: Request, res: Response) => {
    try {
      const orderID = req.params.id;
      const orderHistoryResponse = await fabricCAClient.submitTransaction(
        CONTRACT_METHODS.QUERY_ORDER_HISTORY,
        orderID
      );
      return res.status(STATUS_SUCCESS).send(orderHistoryResponse);
    } catch (error) {
      return handleError(
        res,
        error,
        `There was a problem fetching history for order, ${request.params.id}`
      );
    }
  });
};
