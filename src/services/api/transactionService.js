class TransactionService {
  constructor() {
    this.tableName = 'transaction_c';
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "farm_id_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(transaction => ({
        Id: transaction.Id,
        type: transaction.type_c,
        category: transaction.category_c,
        amount: transaction.type_c === "expense" ? -Math.abs(transaction.amount_c) : Math.abs(transaction.amount_c),
        description: transaction.description_c || transaction.Name,
        date: transaction.date_c,
        farmId: transaction.farm_id_c?.Id || transaction.farm_id_c
      })) || [];
      
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "farm_id_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success || !response.data) {
        throw new Error("Transaction not found");
      }
      
      const transaction = response.data;
      return {
        Id: transaction.Id,
        type: transaction.type_c,
        category: transaction.category_c,
        amount: transaction.type_c === "expense" ? -Math.abs(transaction.amount_c) : Math.abs(transaction.amount_c),
        description: transaction.description_c || transaction.Name,
        date: transaction.date_c,
        farmId: transaction.farm_id_c?.Id || transaction.farm_id_c
      };
      
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error);
      throw error;
    }
  }

  async getByFarmId(farmId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "farm_id_c"}}
        ],
        where: [{
          "FieldName": "farm_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(farmId)]
        }],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(transaction => ({
        Id: transaction.Id,
        type: transaction.type_c,
        category: transaction.category_c,
        amount: transaction.type_c === "expense" ? -Math.abs(transaction.amount_c) : Math.abs(transaction.amount_c),
        description: transaction.description_c || transaction.Name,
        date: transaction.date_c,
        farmId: transaction.farm_id_c?.Id || transaction.farm_id_c
      })) || [];
      
    } catch (error) {
      console.error(`Error fetching transactions for farm ${farmId}:`, error);
      return [];
    }
  }

  async create(transactionData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: transactionData.description,
          type_c: transactionData.type,
          category_c: transactionData.category,
          amount_c: Math.abs(parseFloat(transactionData.amount)),
          description_c: transactionData.description,
          date_c: transactionData.date || new Date().toISOString(),
          farm_id_c: parseInt(transactionData.farmId)
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
          console.error(`Failed to create transaction:`, failed);
          throw new Error("Failed to create transaction");
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            type: created.type_c,
            category: created.category_c,
            amount: created.type_c === "expense" ? -Math.abs(created.amount_c) : Math.abs(created.amount_c),
            description: created.description_c || created.Name,
            date: created.date_c,
            farmId: created.farm_id_c?.Id || created.farm_id_c
          };
        }
      }
      
      throw new Error("No transaction created");
      
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  }

  async update(id, transactionData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: transactionData.description,
          type_c: transactionData.type,
          category_c: transactionData.category,
          amount_c: Math.abs(parseFloat(transactionData.amount)),
          description_c: transactionData.description,
          date_c: transactionData.date,
          farm_id_c: parseInt(transactionData.farmId)
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
          console.error(`Failed to update transaction:`, failed);
          throw new Error("Failed to update transaction");
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            type: updated.type_c,
            category: updated.category_c,
            amount: updated.type_c === "expense" ? -Math.abs(updated.amount_c) : Math.abs(updated.amount_c),
            description: updated.description_c || updated.Name,
            date: updated.date_c,
            farmId: updated.farm_id_c?.Id || updated.farm_id_c
          };
        }
      }
      
      throw new Error("No transaction updated");
      
    } catch (error) {
      console.error("Error updating transaction:", error);
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
          console.error(`Failed to delete transaction:`, failed);
          throw new Error("Failed to delete transaction");
        }
        
        return successful.length > 0;
      }
      
      return false;
      
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  }

  async getSummary() {
    try {
      const transactions = await this.getAll();
      
      const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      const totalExpenses = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      return {
        totalIncome,
        totalExpenses,
        netProfit: totalIncome - totalExpenses,
        recentTransactions: transactions.slice(0, 5)
      };
      
    } catch (error) {
      console.error("Error calculating transaction summary:", error);
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netProfit: 0,
        recentTransactions: []
      };
    }
  }
}

export const transactionService = new TransactionService();