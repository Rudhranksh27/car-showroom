import { ObjectId } from "mongodb";
import { getUsersCollection } from "./mongodb";
import type { BookingAction, BookingEntry } from "./mongodb";

export const ALREADY_BOOKED_MESSAGE = "You have already booked this variant.";

// A booking is a duplicate when the same user already has one with the same action for the same car variant.
const sameBooking = (action: BookingAction, carId: string, carName: string) => ({
  $elemMatch: { action, carId, carName },
});

export async function hasUserBooked(userId: string, action: BookingAction, carId: string, carName: string) {
  if (!ObjectId.isValid(userId)) return false;
  const match = await (await getUsersCollection()).findOne(
    { _id: new ObjectId(userId), bookings: sameBooking(action, carId, carName) },
    { projection: { _id: 1 } },
  );
  return match !== null;
}

// Appends the booking in a single atomic update, so two simultaneous requests cannot both succeed.
export async function addUserBooking(userId: string, entry: BookingEntry): Promise<"saved" | "duplicate" | "no-user"> {
  if (!ObjectId.isValid(userId)) return "no-user";
  const users = await getUsersCollection();
  const _id = new ObjectId(userId);

  const result = await users.updateOne(
    { _id, bookings: { $not: sameBooking(entry.action, entry.carId, entry.carName) } },
    { $push: { bookings: entry } },
  );
  if (result.matchedCount === 1) return "saved";

  const exists = await users.countDocuments({ _id }, { limit: 1 });
  return exists ? "duplicate" : "no-user";
}

export function cleanString(value: unknown, maxLength = 200) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}
