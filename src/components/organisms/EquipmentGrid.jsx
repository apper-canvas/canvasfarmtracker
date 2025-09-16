import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const EquipmentGrid = ({ equipment, onEdit, onDelete }) => {
  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Fair': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMaintenanceStatusColor = (status) => {
    switch (status) {
      case 'Current': return 'bg-green-100 text-green-800';
      case 'Due': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Tractor': return 'Truck';
      case 'Harvester': return 'Wheat';
      case 'Planter': return 'Sprout';
      case 'Tillage': return 'Shovel';
      case 'Irrigation': return 'Droplets';
      case 'Sprayer': return 'Spray';
      case 'Hay Equipment': return 'Wheat';
      default: return 'Settings';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {equipment.map((item) => (
        <Card key={item.Id} className="hover:scale-105 transform transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                  <ApperIcon name={getTypeIcon(item.type)} size={20} className="text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg leading-tight">{item.name}</CardTitle>
                  <p className="text-sm text-gray-600">{item.type}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(item)}
                >
                  <ApperIcon name="Edit" size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(item.Id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <ApperIcon name="Trash2" size={14} />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Wrench" size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Condition:</span>
              </div>
              <Badge className={getConditionColor(item.condition)}>
                {item.condition}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Calendar" size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Purchased:</span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {format(new Date(item.purchaseDate), "MMM d, yyyy")}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name="DollarSign" size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Cost:</span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                ${item.purchaseCost?.toLocaleString() || 'N/A'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Settings" size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Maintenance:</span>
              </div>
              <Badge className={getMaintenanceStatusColor(item.maintenanceStatus)}>
                {item.maintenanceStatus}
              </Badge>
            </div>

            {item.notes && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-600 line-clamp-2">{item.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EquipmentGrid;