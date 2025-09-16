import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import EquipmentGrid from '@/components/organisms/EquipmentGrid';
import AddEquipmentForm from '@/components/organisms/AddEquipmentForm';
import EditEquipmentForm from '@/components/organisms/EditEquipmentForm';
import { equipmentService } from '@/services/api/equipmentService';
import { toast } from 'react-toastify';

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [filterType, setFilterType] = useState('All');

  const equipmentTypes = ['All', 'Tractor', 'Harvester', 'Planter', 'Tillage', 'Irrigation', 'Sprayer', 'Hay Equipment'];

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await equipmentService.getAll();
      setEquipment(data);
    } catch (error) {
      console.error("Error loading equipment:", error);
      setError(error.message);
      toast.error("Failed to load equipment");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEquipment = async (equipmentData) => {
    try {
      const newEquipment = await equipmentService.create(equipmentData);
      setEquipment(prev => [...prev, newEquipment]);
      setShowAddForm(false);
      toast.success("Equipment added successfully!");
    } catch (error) {
      console.error("Error adding equipment:", error);
      toast.error("Failed to add equipment");
    }
  };

  const handleEditEquipment = async (equipmentData) => {
    try {
      const updatedEquipment = await equipmentService.update(editingEquipment.Id, equipmentData);
      setEquipment(prev => prev.map(e => 
        e.Id === editingEquipment.Id ? updatedEquipment : e
      ));
      setEditingEquipment(null);
      toast.success("Equipment updated successfully!");
    } catch (error) {
      console.error("Error updating equipment:", error);
      toast.error("Failed to update equipment");
    }
  };

  const handleDeleteEquipment = async (equipmentId) => {
    if (!window.confirm("Are you sure you want to delete this equipment?")) {
      return;
    }

    try {
      await equipmentService.delete(equipmentId);
      setEquipment(prev => prev.filter(e => e.Id !== equipmentId));
      toast.success("Equipment deleted successfully!");
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toast.error("Failed to delete equipment");
    }
  };

  const filteredEquipment = filterType === 'All' 
    ? equipment 
    : equipment.filter(e => e.type === filterType);

  if (loading) return <Loading rows={3} />;
  if (error) return <Error message={error} onRetry={loadEquipment} />;

  return (
    <div className="max-w-7xl mx-auto p-4 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipment</h1>
          <p className="text-gray-600">Manage your farm equipment inventory</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Equipment</span>
        </Button>
      </div>

      {/* Equipment Type Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {equipmentTypes.map((type) => (
          <Button
            key={type}
            variant={filterType === type ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterType(type)}
            className="flex items-center space-x-1"
          >
            <span>{type}</span>
            {type !== 'All' && (
              <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                {equipment.filter(e => e.type === type).length}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Equipment Grid */}
      {filteredEquipment.length === 0 ? (
        <Empty
          title="No equipment found"
          description={filterType === 'All' 
            ? "Start by adding your first piece of equipment" 
            : `No ${filterType.toLowerCase()} equipment found`
          }
          action={
            <Button onClick={() => setShowAddForm(true)}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Equipment
            </Button>
          }
        />
      ) : (
        <EquipmentGrid
          equipment={filteredEquipment}
          onEdit={setEditingEquipment}
          onDelete={handleDeleteEquipment}
        />
      )}

      {/* Add Equipment Modal */}
      {showAddForm && (
        <AddEquipmentForm
          onSubmit={handleAddEquipment}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Equipment Modal */}
      {editingEquipment && (
        <EditEquipmentForm
          equipment={editingEquipment}
          onSubmit={handleEditEquipment}
          onCancel={() => setEditingEquipment(null)}
        />
      )}
    </div>
  );
};

export default Equipment;