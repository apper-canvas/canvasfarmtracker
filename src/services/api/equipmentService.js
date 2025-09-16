import mockEquipment from '../mockData/equipment.json';

// Enhanced Equipment Service with ApperClient-compatible patterns
// Ready for migration to database when equipment_c table becomes available
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ApperClient initialization for future database integration
// When equipment_c table is available, replace this service with:
// const { ApperClient } = window.ApperSDK;
// const apperClient = new ApperClient({
//   apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
//   apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
// });

class EquipmentService {
  constructor() {
    this.equipment = [...mockEquipment];
    
    // Initialize ApperClient for future database integration
    // Uncomment when equipment_c table becomes available:
    // const { ApperClient } = window.ApperSDK;
    // this.apperClient = new ApperClient({
    //   apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    //   apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    // });
  }

  // Enhanced getAll method with ApperClient-compatible response structure
  // Migration: Replace with apperClient.fetchRecords('equipment_c', params)
  async getAll() {
    await delay(300);
    try {
      // Mock implementation - returns copy to prevent mutations
      return {
        success: true,
        data: [...this.equipment],
        total: this.equipment.length
      };
    } catch (error) {
      console.error('Equipment service getAll error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch equipment'
      };
    }
  }

// Enhanced getById method with proper validation
  // Migration: Replace with apperClient.getRecordById('equipment_c', id, params)
  async getById(id) {
    await delay(200);
    try {
      const equipmentId = parseInt(id);
      if (isNaN(equipmentId) || equipmentId <= 0) {
        throw new Error("Invalid equipment ID - must be a positive integer");
      }
      
      const equipment = this.equipment.find(e => e.Id === equipmentId);
      if (!equipment) {
        throw new Error(`Equipment with ID ${equipmentId} not found`);
      }
      
      return {
        success: true,
        data: { ...equipment }
      };
    } catch (error) {
      console.error(`Equipment service getById error for ID ${id}:`, error);
      return {
        success: false,
        message: error.message || 'Failed to fetch equipment'
      };
    }
  }

// Enhanced create method with comprehensive validation
  // Migration: Replace with apperClient.createRecord('equipment_c', { records: [equipmentData] })
  async create(equipmentData) {
    await delay(400);
    try {
      // Enhanced validation with specific field requirements
      const errors = [];
      
      if (!equipmentData.name?.trim()) {
        errors.push("Equipment name is required");
      } else if (equipmentData.name.trim().length < 2) {
        errors.push("Equipment name must be at least 2 characters");
      }
      
      if (!equipmentData.type) {
        errors.push("Equipment type is required");
      }
      
      if (!equipmentData.purchaseCost) {
        errors.push("Purchase cost is required");
      } else {
        const cost = parseFloat(equipmentData.purchaseCost);
        if (isNaN(cost) || cost < 0) {
          errors.push("Purchase cost must be a valid positive number");
        }
      }
      
      if (errors.length > 0) {
        throw new Error(errors.join('; '));
      }

      // Check for duplicate names
      const existingName = this.equipment.find(e => 
        e.name.toLowerCase() === equipmentData.name.trim().toLowerCase()
      );
      if (existingName) {
        throw new Error("Equipment with this name already exists");
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
        notes: equipmentData.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.equipment.push(newEquipment);
      return {
        success: true,
        data: { ...newEquipment }
      };
    } catch (error) {
      console.error('Equipment service create error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create equipment'
      };
    }
  }

// Enhanced update method with comprehensive validation
  // Migration: Replace with apperClient.updateRecord('equipment_c', { records: [{ Id: id, ...equipmentData }] })
  async update(id, equipmentData) {
    await delay(350);
    try {
      const equipmentId = parseInt(id);
      if (isNaN(equipmentId) || equipmentId <= 0) {
        throw new Error("Invalid equipment ID - must be a positive integer");
      }

      const index = this.equipment.findIndex(e => e.Id === equipmentId);
      if (index === -1) {
        throw new Error(`Equipment with ID ${equipmentId} not found`);
      }

      // Enhanced validation with specific field requirements
      const errors = [];
      
      if (!equipmentData.name?.trim()) {
        errors.push("Equipment name is required");
      } else if (equipmentData.name.trim().length < 2) {
        errors.push("Equipment name must be at least 2 characters");
      }
      
      if (!equipmentData.purchaseCost) {
        errors.push("Purchase cost is required");
      } else {
        const cost = parseFloat(equipmentData.purchaseCost);
        if (isNaN(cost) || cost < 0) {
          errors.push("Purchase cost must be a valid positive number");
        }
      }
      
      if (errors.length > 0) {
        throw new Error(errors.join('; '));
      }

      // Check for duplicate names (excluding current equipment)
      const existingName = this.equipment.find(e => 
        e.Id !== equipmentId && 
        e.name.toLowerCase() === equipmentData.name.trim().toLowerCase()
      );
      if (existingName) {
        throw new Error("Another equipment with this name already exists");
      }

      const updatedEquipment = {
        ...this.equipment[index],
        name: equipmentData.name.trim(),
        type: equipmentData.type || this.equipment[index].type,
        condition: equipmentData.condition || this.equipment[index].condition,
        purchaseDate: equipmentData.purchaseDate || this.equipment[index].purchaseDate,
        purchaseCost: parseFloat(equipmentData.purchaseCost),
        maintenanceStatus: equipmentData.maintenanceStatus || this.equipment[index].maintenanceStatus,
        lastMaintenance: equipmentData.lastMaintenance || '',
        nextMaintenance: equipmentData.nextMaintenance || '',
        notes: equipmentData.notes || '',
        updatedAt: new Date().toISOString()
      };

      this.equipment[index] = updatedEquipment;
      return {
        success: true,
        data: { ...updatedEquipment }
      };
    } catch (error) {
      console.error(`Equipment service update error for ID ${id}:`, error);
      return {
        success: false,
        message: error.message || 'Failed to update equipment'
      };
    }
  }

// Enhanced delete method with proper validation and response
  // Migration: Replace with apperClient.deleteRecord('equipment_c', { RecordIds: [id] })
  async delete(id) {
    await delay(300);
    try {
      const equipmentId = parseInt(id);
      if (isNaN(equipmentId) || equipmentId <= 0) {
        throw new Error("Invalid equipment ID - must be a positive integer");
      }

      const index = this.equipment.findIndex(e => e.Id === equipmentId);
      if (index === -1) {
        throw new Error(`Equipment with ID ${equipmentId} not found`);
      }

      // Store equipment name for success message
      const equipmentName = this.equipment[index].name;
      
      this.equipment.splice(index, 1);
      return {
        success: true,
        data: { 
          deleted: true,
          equipmentId: equipmentId,
          equipmentName: equipmentName
        }
      };
    } catch (error) {
      console.error(`Equipment service delete error for ID ${id}:`, error);
      return {
        success: false,
        message: error.message || 'Failed to delete equipment'
      };
    }
  }

// Enhanced getByType method with validation
  // Migration: Replace with apperClient.fetchRecords with type filter
  async getByType(type) {
    await delay(250);
    try {
      if (!type || typeof type !== 'string') {
        throw new Error("Equipment type is required and must be a string");
      }
      
      const filtered = this.equipment
        .filter(e => e.type && e.type.toLowerCase() === type.toLowerCase())
        .map(e => ({ ...e }));
        
      return {
        success: true,
        data: filtered,
        total: filtered.length
      };
    } catch (error) {
      console.error(`Equipment service getByType error for type ${type}:`, error);
      return {
        success: false,
        message: error.message || 'Failed to fetch equipment by type'
      };
    }
  }

// Enhanced maintenance due method with improved date handling
  // Migration: Replace with apperClient.fetchRecords with maintenance date filters
  async getMaintenanceDue() {
    await delay(250);
    try {
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      
      const due = this.equipment.filter(e => {
        // Check maintenance status first
        if (e.maintenanceStatus === 'Due' || e.maintenanceStatus === 'Overdue') {
          return true;
        }
        
        // Check next maintenance date
        if (e.nextMaintenance) {
          try {
            const nextMaintenance = new Date(e.nextMaintenance);
            // Due if within 30 days or overdue
            return nextMaintenance <= thirtyDaysFromNow;
          } catch (dateError) {
            console.warn(`Invalid next maintenance date for equipment ID ${e.Id}:`, e.nextMaintenance);
            return false;
          }
        }
        
        return false;
      }).map(e => ({ ...e }));
      
      // Sort by urgency (overdue first, then by due date)
      due.sort((a, b) => {
        if (a.maintenanceStatus === 'Overdue' && b.maintenanceStatus !== 'Overdue') return -1;
        if (b.maintenanceStatus === 'Overdue' && a.maintenanceStatus !== 'Overdue') return 1;
        
        if (a.nextMaintenance && b.nextMaintenance) {
          return new Date(a.nextMaintenance) - new Date(b.nextMaintenance);
        }
        
        return 0;
      });
      
      return {
        success: true,
        data: due,
        total: due.length
      };
    } catch (error) {
      console.error('Equipment service getMaintenanceDue error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch maintenance due equipment'
      };
    }
  }

// Enhanced summary method with comprehensive analytics
  // Migration: Replace with apperClient.fetchRecords with aggregation queries
  async getSummary() {
    await delay(200);
    try {
      const total = this.equipment.length;
      
      // Get maintenance due count
      const maintenanceResponse = await this.getMaintenanceDue();
      const maintenanceDue = maintenanceResponse.success ? maintenanceResponse.data.length : 0;
      
      // Calculate total value and average
      const totalValue = this.equipment.reduce((sum, e) => sum + (e.purchaseCost || 0), 0);
      const averageValue = total > 0 ? totalValue / total : 0;
      
      // Count by condition
      const conditionCounts = this.equipment.reduce((acc, e) => {
        const condition = e.condition || 'Unknown';
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
      }, {});
      
      // Count by type
      const typeCounts = this.equipment.reduce((acc, e) => {
        const type = e.type || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});
      
      // Count by maintenance status
      const maintenanceStatusCounts = this.equipment.reduce((acc, e) => {
        const status = e.maintenanceStatus || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
      
      // Find most expensive equipment
      const mostExpensive = this.equipment.reduce((max, e) => 
        (e.purchaseCost || 0) > (max.purchaseCost || 0) ? e : max, 
        { purchaseCost: 0 }
      );
      
      return {
        success: true,
        data: {
          total,
          maintenanceDue,
          totalValue,
          averageValue: Math.round(averageValue * 100) / 100,
          conditionCounts,
          typeCounts,
          maintenanceStatusCounts,
          mostExpensive: mostExpensive.purchaseCost > 0 ? {
            name: mostExpensive.name,
            cost: mostExpensive.purchaseCost
          } : null
        }
      };
    } catch (error) {
      console.error('Equipment service getSummary error:', error);
      return {
        success: false,
        message: error.message || 'Failed to generate equipment summary'
      };
    }
  }
  
  // Additional helper method for search functionality
  // Migration: Replace with apperClient.fetchRecords with search filters
  async search(searchTerm) {
    await delay(250);
    try {
      if (!searchTerm || typeof searchTerm !== 'string') {
        return await this.getAll();
      }
      
      const term = searchTerm.toLowerCase().trim();
      const filtered = this.equipment.filter(e => 
        (e.name && e.name.toLowerCase().includes(term)) ||
        (e.type && e.type.toLowerCase().includes(term)) ||
        (e.condition && e.condition.toLowerCase().includes(term)) ||
        (e.notes && e.notes.toLowerCase().includes(term))
      ).map(e => ({ ...e }));
      
      return {
        success: true,
        data: filtered,
        total: filtered.length,
        searchTerm: term
      };
    } catch (error) {
      console.error(`Equipment service search error for term "${searchTerm}":`, error);
      return {
        success: false,
        message: error.message || 'Failed to search equipment'
      };
    }
  }
}

export const equipmentService = new EquipmentService();