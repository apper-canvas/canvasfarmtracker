import mockEquipment from '../mockData/equipment.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class EquipmentService {
  constructor() {
    this.equipment = [...mockEquipment];
  }

  // Enhanced getAll method with ApperClient-like response structure
  async getAll() {
    await delay(300);
    try {
      return {
        success: true,
        data: [...this.equipment]
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Enhanced getById method with proper validation
  async getById(id) {
    await delay(200);
    try {
      const equipmentId = parseInt(id);
      if (isNaN(equipmentId)) {
        throw new Error("Invalid equipment ID");
      }
      
      const equipment = this.equipment.find(e => e.Id === equipmentId);
      if (!equipment) {
        throw new Error("Equipment not found");
      }
      
      return {
        success: true,
        data: { ...equipment }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Enhanced create method with validation and response formatting
  async create(equipmentData) {
    await delay(400);
    try {
      // Validate required fields
      if (!equipmentData.name?.trim()) {
        throw new Error("Equipment name is required");
      }
      if (!equipmentData.type) {
        throw new Error("Equipment type is required");
      }
      if (!equipmentData.purchaseCost || isNaN(parseFloat(equipmentData.purchaseCost))) {
        throw new Error("Valid purchase cost is required");
      }

      const newEquipment = {
        Id: this.equipment.length > 0 ? Math.max(...this.equipment.map(e => e.Id)) + 1 : 1,
        name: equipmentData.name.trim(),
        type: equipmentData.type,
        condition: equipmentData.condition || 'Good',
        purchaseDate: equipmentData.purchaseDate || new Date().toISOString().split('T')[0],
        purchaseCost: parseFloat(equipmentData.purchaseCost),
        maintenanceStatus: equipmentData.maintenanceStatus || 'Current',
        lastMaintenance: equipmentData.lastMaintenance || '',
        nextMaintenance: equipmentData.nextMaintenance || '',
        notes: equipmentData.notes || ''
      };
      
      this.equipment.push(newEquipment);
      return {
        success: true,
        data: { ...newEquipment }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Enhanced update method with validation
  async update(id, equipmentData) {
    await delay(350);
    try {
      const equipmentId = parseInt(id);
      if (isNaN(equipmentId)) {
        throw new Error("Invalid equipment ID");
      }

      const index = this.equipment.findIndex(e => e.Id === equipmentId);
      if (index === -1) {
        throw new Error("Equipment not found");
      }

      // Validate required fields
      if (!equipmentData.name?.trim()) {
        throw new Error("Equipment name is required");
      }
      if (!equipmentData.purchaseCost || isNaN(parseFloat(equipmentData.purchaseCost))) {
        throw new Error("Valid purchase cost is required");
      }

      const updatedEquipment = {
        ...this.equipment[index],
        name: equipmentData.name.trim(),
        type: equipmentData.type,
        condition: equipmentData.condition,
        purchaseDate: equipmentData.purchaseDate,
        purchaseCost: parseFloat(equipmentData.purchaseCost),
        maintenanceStatus: equipmentData.maintenanceStatus,
        lastMaintenance: equipmentData.lastMaintenance || '',
        nextMaintenance: equipmentData.nextMaintenance || '',
        notes: equipmentData.notes || ''
      };

      this.equipment[index] = updatedEquipment;
      return {
        success: true,
        data: { ...updatedEquipment }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Enhanced delete method with proper response
  async delete(id) {
    await delay(300);
    try {
      const equipmentId = parseInt(id);
      if (isNaN(equipmentId)) {
        throw new Error("Invalid equipment ID");
      }

      const index = this.equipment.findIndex(e => e.Id === equipmentId);
      if (index === -1) {
        throw new Error("Equipment not found");
      }

      this.equipment.splice(index, 1);
      return {
        success: true,
        data: { deleted: true }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Enhanced getByType method
  async getByType(type) {
    await delay(250);
    try {
      const filtered = this.equipment.filter(e => e.type === type).map(e => ({ ...e }));
      return {
        success: true,
        data: filtered
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Enhanced maintenance due method
  async getMaintenanceDue() {
    await delay(250);
    try {
      const now = new Date();
      const due = this.equipment.filter(e => {
        if (!e.nextMaintenance) return e.maintenanceStatus === 'Due' || e.maintenanceStatus === 'Overdue';
        const nextMaintenance = new Date(e.nextMaintenance);
        return nextMaintenance <= now || e.maintenanceStatus === 'Due' || e.maintenanceStatus === 'Overdue';
      }).map(e => ({ ...e }));
      
      return {
        success: true,
        data: due
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Enhanced summary method
  async getSummary() {
    await delay(200);
    try {
      const total = this.equipment.length;
      const maintenanceResponse = await this.getMaintenanceDue();
      const maintenanceDue = maintenanceResponse.success ? maintenanceResponse.data.length : 0;
      const totalValue = this.equipment.reduce((sum, e) => sum + (e.purchaseCost || 0), 0);
      
      const conditionCounts = this.equipment.reduce((acc, e) => {
        acc[e.condition] = (acc[e.condition] || 0) + 1;
        return acc;
      }, {});

      return {
        success: true,
        data: {
          total,
          maintenanceDue,
          totalValue,
          conditionCounts
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export const equipmentService = new EquipmentService();