import mockEquipment from '../mockData/equipment.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class EquipmentService {
  constructor() {
    this.equipment = [...mockEquipment];
  }

  async getAll() {
    await delay(300);
    return [...this.equipment];
  }

  async getById(id) {
    await delay(200);
    const equipment = this.equipment.find(e => e.Id === parseInt(id));
    if (!equipment) {
      throw new Error("Equipment not found");
    }
    return { ...equipment };
  }

  async create(equipmentData) {
    await delay(400);
    const newEquipment = {
      Id: Math.max(...this.equipment.map(e => e.Id)) + 1,
      name: equipmentData.name,
      type: equipmentData.type,
      condition: equipmentData.condition,
      purchaseDate: equipmentData.purchaseDate,
      purchaseCost: parseFloat(equipmentData.purchaseCost),
      maintenanceStatus: equipmentData.maintenanceStatus || 'Current',
      lastMaintenance: equipmentData.lastMaintenance,
      nextMaintenance: equipmentData.nextMaintenance,
      notes: equipmentData.notes || ''
    };
    
    this.equipment.push(newEquipment);
    return { ...newEquipment };
  }

  async update(id, equipmentData) {
    await delay(350);
    const index = this.equipment.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Equipment not found");
    }

    const updatedEquipment = {
      ...this.equipment[index],
      name: equipmentData.name,
      type: equipmentData.type,
      condition: equipmentData.condition,
      purchaseDate: equipmentData.purchaseDate,
      purchaseCost: parseFloat(equipmentData.purchaseCost),
      maintenanceStatus: equipmentData.maintenanceStatus,
      lastMaintenance: equipmentData.lastMaintenance,
      nextMaintenance: equipmentData.nextMaintenance,
      notes: equipmentData.notes || ''
    };

    this.equipment[index] = updatedEquipment;
    return { ...updatedEquipment };
  }

  async delete(id) {
    await delay(300);
    const index = this.equipment.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Equipment not found");
    }

    this.equipment.splice(index, 1);
    return true;
  }

  async getByType(type) {
    await delay(250);
    return this.equipment.filter(e => e.type === type).map(e => ({ ...e }));
  }

  async getMaintenanceDue() {
    await delay(250);
    const now = new Date();
    return this.equipment.filter(e => {
      const nextMaintenance = new Date(e.nextMaintenance);
      return nextMaintenance <= now || e.maintenanceStatus === 'Due' || e.maintenanceStatus === 'Overdue';
    }).map(e => ({ ...e }));
  }

  async getSummary() {
    await delay(200);
    const total = this.equipment.length;
    const maintenanceDue = await this.getMaintenanceDue();
    const totalValue = this.equipment.reduce((sum, e) => sum + e.purchaseCost, 0);
    
    const conditionCounts = this.equipment.reduce((acc, e) => {
      acc[e.condition] = (acc[e.condition] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      maintenanceDue: maintenanceDue.length,
      totalValue,
      conditionCounts
    };
  }
}

export const equipmentService = new EquipmentService();