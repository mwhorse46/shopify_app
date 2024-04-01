import { v4 as uuidv4 } from "uuid";
import db from "../db.server";

export async function checkStatus(shopId) {
  try {
    const status = await db.gyuAppStatus.findUnique({
      where: {
        shop_id: shopId,
      },
    });

    console.log("Is this shop registered? ", status);

    return status;
  } catch (error) {
    console.error("Error occurred while checking status:", error);
    throw error; // Re-throw the error to propagate it further if needed
  }
}

export async function newPlan(shopId, date, expireDate) {
  const newPlan = {
    id: uuidv4(),
    shop_id: shopId,
    installed_date: date,
    expire_date: expireDate,
  };

  console.log("New Plan---------", newPlan);

  await db.gyuAppStatus.create({
    data: newPlan,
  });

  return null;
}

export async function updatePlan(shopId, expireDate) {
  await db.gyuAppStatus.update({
    where: { shop_id: shopId },
    data: { expire_date: expireDate },
  });
  return null;
}

export async function topUpBalance() {
  console.log("Top Up Your Balance");
  return null;
}
