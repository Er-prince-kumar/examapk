/**
 * Frontend API Service
 * Interacts with Node.js backend endpoints
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('ewnc_auth_token') || 'guest-token';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.warn(`[ApiService] Request to ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  // AI daily plan
  async getAiDailyPlan(payload) {
    return this.request('/ai/daily-plan', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // AI chat assistant
  async sendAiChatMessage(message, history = [], studentContext = {}) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history, studentContext })
    });
  }

  // Calculate wellness score
  async calculateWellnessScore(payload) {
    return this.request('/wellness/score', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Health check
  async getHealth() {
    return this.request('/health');
  }

  // Generate study schedule
  async generateStudySchedule(payload) {
    return this.request('/study/generate-schedule', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
}

export const apiService = new ApiService();
