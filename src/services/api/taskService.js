class TaskService {
  constructor() {
    this.tableName = 'task_c';
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "crop_id_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c,
        dueDate: task.due_date_c,
        priority: task.priority_c?.toLowerCase() || "medium",
        completed: task.completed_c || false,
        category: task.category_c?.toLowerCase() || "maintenance",
        farmId: task.farm_id_c?.Id || task.farm_id_c,
        cropId: task.crop_id_c?.Id || task.crop_id_c
      })) || [];
      
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "crop_id_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success || !response.data) {
        throw new Error("Task not found");
      }
      
      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c,
        dueDate: task.due_date_c,
        priority: task.priority_c?.toLowerCase() || "medium",
        completed: task.completed_c || false,
        category: task.category_c?.toLowerCase() || "maintenance",
        farmId: task.farm_id_c?.Id || task.farm_id_c,
        cropId: task.crop_id_c?.Id || task.crop_id_c
      };
      
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  }

  async getByFarmId(farmId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "crop_id_c"}}
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
      
      return response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c,
        dueDate: task.due_date_c,
        priority: task.priority_c?.toLowerCase() || "medium",
        completed: task.completed_c || false,
        category: task.category_c?.toLowerCase() || "maintenance",
        farmId: task.farm_id_c?.Id || task.farm_id_c,
        cropId: task.crop_id_c?.Id || task.crop_id_c
      })) || [];
      
    } catch (error) {
      console.error(`Error fetching tasks for farm ${farmId}:`, error);
      return [];
    }
  }

  async create(taskData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: taskData.title,
          title_c: taskData.title,
          description_c: taskData.description || "",
          due_date_c: taskData.dueDate,
          priority_c: taskData.priority?.charAt(0).toUpperCase() + taskData.priority?.slice(1).toLowerCase() || "Medium",
          completed_c: taskData.completed || false,
          category_c: taskData.category?.charAt(0).toUpperCase() + taskData.category?.slice(1).toLowerCase() || "Maintenance",
          farm_id_c: parseInt(taskData.farmId),
          crop_id_c: taskData.cropId ? parseInt(taskData.cropId) : null
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
          console.error(`Failed to create task:`, failed);
          throw new Error("Failed to create task");
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            title: created.title_c || created.Name,
            description: created.description_c,
            dueDate: created.due_date_c,
            priority: created.priority_c?.toLowerCase() || "medium",
            completed: created.completed_c || false,
            category: created.category_c?.toLowerCase() || "maintenance",
            farmId: created.farm_id_c?.Id || created.farm_id_c,
            cropId: created.crop_id_c?.Id || created.crop_id_c
          };
        }
      }
      
      throw new Error("No task created");
      
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: taskData.title,
          title_c: taskData.title,
          description_c: taskData.description || "",
          due_date_c: taskData.dueDate,
          priority_c: taskData.priority?.charAt(0).toUpperCase() + taskData.priority?.slice(1).toLowerCase() || "Medium",
          completed_c: taskData.completed || false,
          category_c: taskData.category?.charAt(0).toUpperCase() + taskData.category?.slice(1).toLowerCase() || "Maintenance",
          farm_id_c: parseInt(taskData.farmId),
          crop_id_c: taskData.cropId ? parseInt(taskData.cropId) : null
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
          console.error(`Failed to update task:`, failed);
          throw new Error("Failed to update task");
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            title: updated.title_c || updated.Name,
            description: updated.description_c,
            dueDate: updated.due_date_c,
            priority: updated.priority_c?.toLowerCase() || "medium",
            completed: updated.completed_c || false,
            category: updated.category_c?.toLowerCase() || "maintenance",
            farmId: updated.farm_id_c?.Id || updated.farm_id_c,
            cropId: updated.crop_id_c?.Id || updated.crop_id_c
          };
        }
      }
      
      throw new Error("No task updated");
      
    } catch (error) {
      console.error("Error updating task:", error);
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
          console.error(`Failed to delete task:`, failed);
          throw new Error("Failed to delete task");
        }
        
        return successful.length > 0;
      }
      
      return false;
      
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  async complete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          completed_c: true
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
          console.error(`Failed to complete task:`, failed);
          throw new Error("Failed to complete task");
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            title: updated.title_c || updated.Name,
            description: updated.description_c,
            dueDate: updated.due_date_c,
            priority: updated.priority_c?.toLowerCase() || "medium",
            completed: updated.completed_c || false,
            category: updated.category_c?.toLowerCase() || "maintenance",
            farmId: updated.farm_id_c?.Id || updated.farm_id_c,
            cropId: updated.crop_id_c?.Id || updated.crop_id_c
          };
        }
      }
      
      throw new Error("No task completed");
      
    } catch (error) {
      console.error("Error completing task:", error);
      throw error;
    }
  }

  async getUpcoming(days = 7) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const future = new Date();
      future.setDate(future.getDate() + days);
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "crop_id_c"}}
        ],
        where: [
          {
            "FieldName": "completed_c",
            "Operator": "EqualTo",
            "Values": [false]
          },
          {
            "FieldName": "due_date_c",
            "Operator": "LessThanOrEqualTo",
            "Values": [future.toISOString()]
          }
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c,
        dueDate: task.due_date_c,
        priority: task.priority_c?.toLowerCase() || "medium",
        completed: task.completed_c || false,
        category: task.category_c?.toLowerCase() || "maintenance",
        farmId: task.farm_id_c?.Id || task.farm_id_c,
        cropId: task.crop_id_c?.Id || task.crop_id_c
      })) || [];
      
    } catch (error) {
      console.error("Error fetching upcoming tasks:", error);
      return [];
    }
  }
}

export const taskService = new TaskService();