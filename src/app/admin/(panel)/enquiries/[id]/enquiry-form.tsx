"use client";

import { useActionState } from "react";
import { SaveMessage, SubmitButton } from "@/components/admin/ui";
import { type EnquiryActionState, updateEnquiry } from "../actions";

const initial: EnquiryActionState = { status: "idle" };

export function EnquiryForm({
  id,
  status,
  notes,
}: {
  id: string;
  status: string;
  notes: string | null;
}) {
  const [state, action] = useActionState(updateEnquiry, initial);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="id" value={id} />
      <label className="block">
        <span className="block text-sm font-medium">Status</span>
        <select name="status" defaultValue={status} className="admin-input mt-1.5">
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
      </label>
      <label className="block">
        <span className="block text-sm font-medium">Internal notes</span>
        <span className="mt-0.5 block text-xs text-forest/55">Only staff can see these.</span>
        <textarea name="notes" defaultValue={notes ?? ""} rows={4} className="admin-input mt-1.5" />
      </label>
      <SaveMessage state={state} />
      <div>
        <SubmitButton>Save enquiry</SubmitButton>
      </div>
    </form>
  );
}
