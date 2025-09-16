class FarmService {
  constructor() {
    this.tableName = 'farm_c';
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
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(farm => ({
        Id: farm.Id,
        name: farm.name_c || farm.Name,
        size: farm.size_c,
        location: farm.location_c,
        createdAt: farm.created_at_c
      })) || [];
      
    } catch (error) {
      console.error("Error fetching farms:", error);
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
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success || !response.data) {
        throw new Error("Farm not found");
      }
      
      const farm = response.data;
      return {
        Id: farm.Id,
        name: farm.name_c || farm.Name,
        size: farm.size_c,
        location: farm.location_c,
        createdAt: farm.created_at_c
      };
      
    } catch (error) {
      console.error(`Error fetching farm ${id}:`, error);
      throw error;
    }
  }

  async create(farmData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: farmData.name,
          name_c: farmData.name,
          size_c: farmData.size,
          location_c: farmData.location,
          created_at_c: new Date().toISOString()
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
          console.error(`Failed to create farm:`, failed);
          throw new Error("Failed to create farm");
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            name: created.name_c || created.Name,
            size: created.size_c,
            location: created.location_c,
            createdAt: created.created_at_c
          };
        }
      }
      
      throw new Error("No farm created");
      
    } catch (error) {
      console.error("Error creating farm:", error);
      throw error;
    }
  }

  async update(id, farmData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: farmData.name,
          name_c: farmData.name,
          size_c: farmData.size,
          location_c: farmData.location
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
          console.error(`Failed to update farm:`, failed);
          throw new Error("Failed to update farm");
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            name: updated.name_c || updated.Name,
            size: updated.size_c,
            location: updated.location_c,
            createdAt: updated.created_at_c
          };
        }
      }
      
      throw new Error("No farm updated");
      
    } catch (error) {
      console.error("Error updating farm:", error);
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
          console.error(`Failed to delete farm:`, failed);
          throw new Error("Failed to delete farm");
        }
        
        return successful.length > 0;
      }
      
      return false;
      
    } catch (error) {
      console.error("Error deleting farm:", error);
      throw error;
    }
  }
}

export const farmService = new FarmService();