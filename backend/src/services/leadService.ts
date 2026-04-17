import Lead, { ILead, LeadStatus } from '../models/Lead';

const VALID_STATUSES: LeadStatus[] = ['new', 'contacted', 'converted', 'not_interested'];

export async function createLead(data: Partial<ILead>): Promise<ILead> {
  return Lead.create(data);
}

export async function listLeads(status?: string): Promise<ILead[]> {
  const filter = status ? { status } : {};
  return Lead.find(filter).sort({ createdAt: -1 });
}

export async function updateLeadStatus(id: string, status: string): Promise<ILead> {
  if (!VALID_STATUSES.includes(status as LeadStatus)) {
    throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });
  if (!lead) throw new Error('Lead not found');
  return lead;
}
