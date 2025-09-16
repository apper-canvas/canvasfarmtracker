class WeatherService {
  constructor() {
    this.tableName = 'weather_c';
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

  async getCurrent() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "temperature_c"}},
          {"field": {"Name": "condition_c"}},
          {"field": {"Name": "humidity_c"}},
          {"field": {"Name": "wind_speed_c"}},
          {"field": {"Name": "precipitation_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data?.length) {
        return this.getDefaultWeather();
      }
      
      const weather = response.data[0];
      return {
        Id: weather.Id,
        date: weather.date_c,
        temperature: weather.temperature_c,
        condition: weather.condition_c,
        humidity: weather.humidity_c,
        windSpeed: weather.wind_speed_c,
        precipitation: weather.precipitation_c
      };
      
    } catch (error) {
      console.error("Error fetching current weather:", error);
      return this.getDefaultWeather();
    }
  }

  async getForecast(days = 4) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "temperature_c"}},
          {"field": {"Name": "condition_c"}},
          {"field": {"Name": "humidity_c"}},
          {"field": {"Name": "wind_speed_c"}},
          {"field": {"Name": "precipitation_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": days, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data?.length) {
        return this.getDefaultForecast(days);
      }
      
      return response.data.map(weather => ({
        Id: weather.Id,
        date: weather.date_c,
        temperature: weather.temperature_c,
        condition: weather.condition_c,
        humidity: weather.humidity_c,
        windSpeed: weather.wind_speed_c,
        precipitation: weather.precipitation_c
      }));
      
    } catch (error) {
      console.error("Error fetching weather forecast:", error);
      return this.getDefaultForecast(days);
    }
  }

  async getToday() {
    try {
      return await this.getCurrent();
    } catch (error) {
      console.error("Error fetching today's weather:", error);
      return this.getDefaultWeather();
    }
  }

  getDefaultWeather() {
    return {
      Id: 1,
      date: new Date().toISOString().split('T')[0],
      temperature: 72,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 8,
      precipitation: 10
    };
  }

  getDefaultForecast(days) {
    const forecast = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      forecast.push({
        Id: i + 1,
        date: date.toISOString().split('T')[0],
        temperature: 70 + Math.floor(Math.random() * 20),
        condition: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
        humidity: 50 + Math.floor(Math.random() * 30),
        windSpeed: 5 + Math.floor(Math.random() * 10),
        precipitation: Math.floor(Math.random() * 100)
      });
    }
    return forecast;
  }
}

export const weatherService = new WeatherService();