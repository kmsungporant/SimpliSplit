import { Orders } from "../../interfaces/Orders";
import AddItems from "./AddItems";
import EditItems from "./EditItems";

export default function ItemsModal(
  index: number,
  orderItems: Orders[],
  setOrderItems: any,
  setEditingItem: any,
  handleRemoveItem: any
) {
  const currItem = orderItems[index];
  if (index === -2) {
    return AddItems(setOrderItems, setEditingItem, orderItems);
  } else {
    return EditItems(orderItems, setOrderItems, setEditingItem, handleRemoveItem, currItem, index);
  }
}
