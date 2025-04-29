import { useState } from "react";
import { Button } from "@/components/ui/Button";
import TextField from "@/components/shared/TextField";

interface AlertConfigFormProps {
  onSubmit: (alertConfig: AlertConfig) => void;
}

interface AlertConfig {
  channelId: number;
  threshold: number;
  condition: string;
  notificationType: string;
  isActive: boolean;
}

export function AlertConfigForm({ onSubmit }: AlertConfigFormProps) {
  const [formData, setFormData] = useState<AlertConfig>({
    channelId: 0,
    threshold: 0,
    condition: "greater_than",
    notificationType: "email",
    isActive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        label="Channel ID"
        name="channelId"
        type="number"
        value={String(formData.channelId)}
        onChange={handleChange}
        placeholder="Enter channel ID"
        required
      />
      <TextField
        label="Threshold"
        name="threshold"
        type="number"
        value={String(formData.threshold)}
        onChange={handleChange}
        placeholder="Enter threshold value"
        required
      />
      <div>
        <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
          Condition
        </label>
        <select
          id="condition"
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        >
          <option value="greater_than">Greater Than</option>
          <option value="less_than">Less Than</option>
        </select>
      </div>
      <div>
        <label htmlFor="notificationType" className="block text-sm font-medium text-gray-700">
          Notification Type
        </label>
        <select
          id="notificationType"
          name="notificationType"
          value={formData.notificationType}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="webhook">Webhook</option>
        </select>
      </div>
      <div className="flex items-center">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
          className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Active
        </label>
      </div>
      <Button type="submit" className="w-full">
        Save Alert
      </Button>
    </form>
  );
}