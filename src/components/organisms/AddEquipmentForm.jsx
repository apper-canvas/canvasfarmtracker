import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Equipment from "@/components/pages/Equipment";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";

const AddEquipmentForm = ({ onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    name: '',
    type: 'Tractor',
    condition: 'Good',
    purchaseDate: '',
    purchaseCost: '',
    maintenanceStatus: 'Current',
    lastMaintenance: '',
    nextMaintenance: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const equipmentTypes = ['Tractor', 'Harvester', 'Planter', 'Tillage', 'Irrigation', 'Sprayer', 'Hay Equipment'];
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];
  const maintenanceStatuses = ['Current', 'Due', 'Overdue'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Equipment name is required');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Plus" size={20} />
              <CardTitle>Add New Equipment</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ApperIcon name="X" size={16} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment Name *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter equipment name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  {equipmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition
                </label>
                <Select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                >
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </Select>
              </div>

<div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Date
                </label>
                <Input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Cost ($)
</label>
                <Input
                  type="number"
                  name="purchaseCost"
                  value={formData.purchaseCost}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maintenance Status
                </label>
                <Select
                  name="maintenanceStatus"
                  value={formData.maintenanceStatus}
                  onChange={handleChange}
                >
                  {maintenanceStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </Select>
              </div>

<div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Maintenance
                </label>
                <Input
                  type="date"
                  name="lastMaintenance"
                  value={formData.lastMaintenance}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Maintenance
</label>
                <Input
                  type="date"
                  name="nextMaintenance"
                  value={formData.nextMaintenance}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional notes about this equipment..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Add Equipment
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEquipmentForm;