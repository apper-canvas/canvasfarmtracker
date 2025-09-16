class CropService {
  constructor() {
    this.tableName = 'crop_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planted_date_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farm_id_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(crop => ({
        Id: crop.Id,
        name: crop.name_c || crop.Name,
        variety: crop.variety_c,
        plantedDate: crop.planted_date_c,
        expectedHarvest: crop.expected_harvest_c,
        status: crop.status_c,
        notes: crop.notes_c,
        farmId: crop.farm_id_c?.Id || crop.farm_id_c
      })) || [];
      
    } catch (error) {
      console.error("Error fetching crops:", error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planted_date_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farm_id_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success || !response.data) {
        throw new Error("Crop not found");
      }
      
      const crop = response.data;
      return {
        Id: crop.Id,
        name: crop.name_c || crop.Name,
        variety: crop.variety_c,
        plantedDate: crop.planted_date_c,
        expectedHarvest: crop.expected_harvest_c,
        status: crop.status_c,
        notes: crop.notes_c,
        farmId: crop.farm_id_c?.Id || crop.farm_id_c
      };
      
    } catch (error) {
      console.error(`Error fetching crop ${id}:`, error);
      throw error;
    }
  }

  async getByFarmId(farmId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planted_date_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farm_id_c"}}
        ],
        where: [{
          "FieldName": "farm_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(farmId)]
        }]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(crop => ({
        Id: crop.Id,
        name: crop.name_c || crop.Name,
        variety: crop.variety_c,
        plantedDate: crop.planted_date_c,
        expectedHarvest: crop.expected_harvest_c,
        status: crop.status_c,
        notes: crop.notes_c,
        farmId: crop.farm_id_c?.Id || crop.farm_id_c
      })) || [];
      
    } catch (error) {
      console.error(`Error fetching crops for farm ${farmId}:`, error);
      return [];
    }
  }

  async create(cropData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: cropData.name,
          name_c: cropData.name,
          variety_c: cropData.variety,
          planted_date_c: cropData.plantedDate,
          expected_harvest_c: cropData.expectedHarvest,
          status_c: cropData.status || "Planted",
          notes_c: cropData.notes || "",
          farm_id_c: parseInt(cropData.farmId)
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create crop:`, failed);
          throw new Error("Failed to create crop");
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            name: created.name_c || created.Name,
            variety: created.variety_c,
            plantedDate: created.planted_date_c,
            expectedHarvest: created.expected_harvest_c,
            status: created.status_c,
            notes: created.notes_c,
            farmId: created.farm_id_c?.Id || created.farm_id_c
          };
        }
      }
      
      throw new Error("No crop created");
      
    } catch (error) {
      console.error("Error creating crop:", error);
      throw error;
    }
  }

  async update(id, cropData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: cropData.name,
          name_c: cropData.name,
          variety_c: cropData.variety,
          planted_date_c: cropData.plantedDate,
          expected_harvest_c: cropData.expectedHarvest,
          status_c: cropData.status,
          notes_c: cropData.notes || "",
          farm_id_c: parseInt(cropData.farmId)
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update crop:`, failed);
          throw new Error("Failed to update crop");
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            name: updated.name_c || updated.Name,
            variety: updated.variety_c,
            plantedDate: updated.planted_date_c,
            expectedHarvest: updated.expected_harvest_c,
            status: updated.status_c,
            notes: updated.notes_c,
            farmId: updated.farm_id_c?.Id || updated.farm_id_c
          };
        }
      }
      
      throw new Error("No crop updated");
      
    } catch (error) {
      console.error("Error updating crop:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete crop:`, failed);
          throw new Error("Failed to delete crop");
        }
        
        return successful.length > 0;
      }
      
      return false;
      
    } catch (error) {
      console.error("Error deleting crop:", error);
      throw error;
    }
  }

  async harvest(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: "Harvested"
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to harvest crop:`, failed);
          throw new Error("Failed to harvest crop");
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            name: updated.name_c || updated.Name,
            variety: updated.variety_c,
            plantedDate: updated.planted_date_c,
            expectedHarvest: updated.expected_harvest_c,
            status: updated.status_c,
            notes: updated.notes_c,
            farmId: updated.farm_id_c?.Id || updated.farm_id_c
          };
        }
      }
      
      throw new Error("No crop harvested");
      
    } catch (error) {
      console.error("Error harvesting crop:", error);
      throw error;
    }
  }
}

export const cropService = new CropService();