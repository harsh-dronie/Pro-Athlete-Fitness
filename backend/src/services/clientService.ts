import Client, { IClient } from '../models/Client';
import Payment from '../models/Payment';
import { calculateExpiry, classifyExpiry } from '../utils/dateHelpers';

type ClientWithStatus = IClient & { expiryStatus: 'active' | 'expiring_soon' | 'expired' };

export async function createClient(data: Partial<IClient>): Promise<IClient> {
  const expiryDate = calculateExpiry(
    new Date(data.joinDate || Date.now()),
    data.planDuration as number
  );
  try {
    return await Client.create({ ...data, expiryDate });
  } catch (err: any) {
    if (err.code === 11000) throw new Error('Phone number already registered');
    throw err;
  }
}

export async function updateClient(id: string, data: Partial<IClient>): Promise<IClient> {
  if (data.planDuration !== undefined || data.joinDate !== undefined) {
    const existing = await Client.findById(id);
    if (!existing) throw new Error('Client not found');
    const joinDate = data.joinDate ? new Date(data.joinDate) : existing.joinDate;
    const planDuration = data.planDuration ?? existing.planDuration;
    data.expiryDate = calculateExpiry(joinDate, planDuration);
  }

  const updated = await Client.findByIdAndUpdate(id, data, { new: true });
  if (!updated) throw new Error('Client not found');
  return updated;
}

export async function deleteClient(id: string): Promise<void> {
  await Client.findByIdAndDelete(id);
  await Payment.deleteMany({ clientId: id });
}

export async function listClients(filters?: { status?: string }): Promise<ClientWithStatus[]> {
  const clients = await Client.find();
  const mapped = clients.map((c) => {
    const obj = c.toObject() as unknown as ClientWithStatus;
    obj.expiryStatus = classifyExpiry(c.expiryDate);
    return obj;
  });

  if (filters?.status) {
    return mapped.filter((c) => c.expiryStatus === filters.status);
  }
  return mapped;
}

export async function getClient(id: string): Promise<ClientWithStatus> {
  const client = await Client.findById(id);
  if (!client) throw new Error('Client not found');
  const obj = client.toObject() as unknown as ClientWithStatus;
  obj.expiryStatus = classifyExpiry(client.expiryDate);
  return obj;
}
