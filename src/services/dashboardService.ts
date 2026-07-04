import { finishedGoodsService } from "./finishedGoodsService";
import { inventoryService } from "./inventoryService";
import { pipelineService } from "./pipelineService";
import { productOrderService } from "./productOrderService";
import { stockService } from "./stockService";
import { vendorPurchaseService } from "./vendorPurchaseService";
import { workOrderService } from "./workOrderService";

export const dashboardService = {
  async superAdmin() {
    const [workOrders, productOrders, inventory, pipeline, vendorPurchases] = await Promise.all([
      workOrderService.counts(),
      productOrderService.counts(),
      inventoryService.counts(),
      pipelineService.overview(),
      vendorPurchaseService.counts(),
    ]);
    return { workOrders, productOrders, inventory, pipeline, vendorPurchases };
  },
  async productionHead() {
    const [workOrders, productOrders, stock, pipeline] = await Promise.all([
      workOrderService.counts(),
      productOrderService.counts(),
      stockService.counts(),
      pipelineService.overview(),
    ]);
    return {
      productOrdersOpen: productOrders.totalProductOrders - productOrders.completed,
      workOrdersOpen: workOrders.totalWorkOrders - workOrders.completed,
      ordersDelayed: 0,
      dispatchReadyOrders: stock.inStockDispatch,
      workOrders,
      productOrders,
      pipeline,
    };
  },
  async storeHead() {
    const [inventory, workOrders] = await Promise.all([inventoryService.counts(), workOrderService.counts()]);
    return {
      inventoryInStock: inventory.inInventory,
      totalWorkOrders: workOrders.totalWorkOrders,
      pendingAssignments: workOrders.yetToStart,
      rawMaterialsBeingUsed: inventory.beingUsed,
    };
  },
  async personA() {
    const [workOrders, stock] = await Promise.all([workOrderService.counts(), stockService.counts()]);
    return {
      activeWorkOrders: workOrders.totalWorkOrders - workOrders.completed,
      metallisationStage: workOrders.inProgress,
      slittingStage: stock.slittingQueue,
      stockGenerated: stock.totalProductLots,
    };
  },
  async personB() {
    const productOrders = await productOrderService.counts();
    const finishedGoods = await finishedGoodsService.list({ limit: 25 });
    return {
      totalProductOrders: productOrders.totalProductOrders,
      yetToStart: productOrders.pendingOrders,
      inProgress: productOrders.inProgressOrders,
      completed: productOrders.completed,
      finishedGoods,
    };
  },
};
