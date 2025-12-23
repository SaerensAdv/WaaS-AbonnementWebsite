/**
 * ClickUp API Integration
 * Handles task creation and management for the abonnement.website platform
 */

const CLICKUP_API_BASE = "https://api.clickup.com/api/v2";

// Your ClickUp List IDs
export const CLICKUP_LISTS = {
  PRODUCT_OVERZICHT: "901519034021",
  DEVELOPMENT: "901519034023",
  OPERATIONS: "901519034022",
  RECURRING: "901519034024",
  DONE_ARCHIVE: "901519034025",
} as const;

// Task priority levels
export const CLICKUP_PRIORITY = {
  URGENT: 1,
  HIGH: 2,
  NORMAL: 3,
  LOW: 4,
} as const;

interface ClickUpTaskData {
  name: string;
  description?: string;
  markdown_description?: string;
  assignees?: number[];
  tags?: string[];
  status?: string;
  priority?: 1 | 2 | 3 | 4;
  due_date?: number; // Unix timestamp in milliseconds
  due_date_time?: boolean;
  time_estimate?: number; // milliseconds
  start_date?: number;
  start_date_time?: boolean;
  notify_all?: boolean;
  parent?: string; // Parent task ID for subtasks
  custom_fields?: Array<{ id: string; value: any }>;
}

interface ClickUpTask {
  id: string;
  name: string;
  status: { status: string };
  priority?: { id: string };
  url: string;
  date_created: string;
}

interface ClickUpResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ClickUpService {
  private apiToken: string;

  constructor() {
    const token = process.env.CLICKUP_API_TOKEN;
    if (!token) {
      console.warn("CLICKUP_API_TOKEN not set - ClickUp integration disabled");
    }
    this.apiToken = token || "";
  }

  private get headers() {
    return {
      Authorization: this.apiToken,
      "Content-Type": "application/json",
    };
  }

  private isConfigured(): boolean {
    return !!this.apiToken;
  }

  /**
   * Create a task in a specific list
   */
  async createTask(
    listId: string,
    taskData: ClickUpTaskData
  ): Promise<ClickUpResponse<ClickUpTask>> {
    if (!this.isConfigured()) {
      return { success: false, error: "ClickUp API token not configured" };
    }

    try {
      const response = await fetch(
        `${CLICKUP_API_BASE}/list/${listId}/task`,
        {
          method: "POST",
          headers: this.headers,
          body: JSON.stringify(taskData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("ClickUp API error:", response.status, errorText);
        return {
          success: false,
          error: `ClickUp API error: ${response.status} - ${errorText}`,
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("ClickUp request failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Request failed",
      };
    }
  }

  /**
   * Get tasks from a list
   */
  async getTasks(listId: string): Promise<ClickUpResponse<ClickUpTask[]>> {
    if (!this.isConfigured()) {
      return { success: false, error: "ClickUp API token not configured" };
    }

    try {
      const response = await fetch(
        `${CLICKUP_API_BASE}/list/${listId}/task`,
        {
          method: "GET",
          headers: this.headers,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `ClickUp API error: ${response.status} - ${errorText}`,
        };
      }

      const data = await response.json();
      return { success: true, data: data.tasks };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Request failed",
      };
    }
  }

  /**
   * Get a single task by ID
   */
  async getTask(taskId: string): Promise<ClickUpResponse<ClickUpTask>> {
    if (!this.isConfigured()) {
      return { success: false, error: "ClickUp API token not configured" };
    }

    try {
      const response = await fetch(
        `${CLICKUP_API_BASE}/task/${taskId}`,
        {
          method: "GET",
          headers: this.headers,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `ClickUp API error: ${response.status} - ${errorText}`,
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Request failed",
      };
    }
  }

  /**
   * Update a task
   */
  async updateTask(
    taskId: string,
    updates: Partial<ClickUpTaskData>
  ): Promise<ClickUpResponse<ClickUpTask>> {
    if (!this.isConfigured()) {
      return { success: false, error: "ClickUp API token not configured" };
    }

    try {
      const response = await fetch(
        `${CLICKUP_API_BASE}/task/${taskId}`,
        {
          method: "PUT",
          headers: this.headers,
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `ClickUp API error: ${response.status} - ${errorText}`,
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Request failed",
      };
    }
  }

  // ============================================
  // Business Logic Helpers
  // ============================================

  /**
   * Create a new customer onboarding task in Operations
   */
  async createCustomerOnboardingTask(customerData: {
    customerName: string;
    email: string;
    planName: string;
    subscriptionId?: string;
  }): Promise<ClickUpResponse<ClickUpTask>> {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // 7 days from now

    return this.createTask(CLICKUP_LISTS.OPERATIONS, {
      name: `Onboarding: ${customerData.customerName}`,
      markdown_description: `## Nieuwe Klant Onboarding

**Klant:** ${customerData.customerName}
**Email:** ${customerData.email}
**Plan:** ${customerData.planName}
${customerData.subscriptionId ? `**Subscription ID:** ${customerData.subscriptionId}` : ""}

### Checklist
- [ ] Welkomstmail verzenden
- [ ] Template keuze bevestigen
- [ ] Eerste gesprek inplannen
- [ ] Content verzamelen
- [ ] Website opzetten
- [ ] Review met klant
- [ ] Go-live`,
      tags: ["onboarding", "nieuw"],
      priority: CLICKUP_PRIORITY.HIGH,
      due_date: dueDate.getTime(),
      due_date_time: false,
    });
  }

  /**
   * Create a development task for new feature or bug
   */
  async createDevelopmentTask(taskData: {
    title: string;
    description: string;
    type: "feature" | "bug" | "improvement";
    priority?: 1 | 2 | 3 | 4;
  }): Promise<ClickUpResponse<ClickUpTask>> {
    return this.createTask(CLICKUP_LISTS.DEVELOPMENT, {
      name: `[${taskData.type.toUpperCase()}] ${taskData.title}`,
      markdown_description: taskData.description,
      tags: [taskData.type],
      priority: taskData.priority || CLICKUP_PRIORITY.NORMAL,
    });
  }

  /**
   * Create a support/operations task
   */
  async createOperationsTask(taskData: {
    title: string;
    description: string;
    customerName?: string;
    priority?: 1 | 2 | 3 | 4;
    dueInDays?: number;
  }): Promise<ClickUpResponse<ClickUpTask>> {
    const tags = ["support"];
    if (taskData.customerName) {
      tags.push("klant");
    }

    let dueDate: number | undefined;
    if (taskData.dueInDays) {
      const due = new Date();
      due.setDate(due.getDate() + taskData.dueInDays);
      dueDate = due.getTime();
    }

    return this.createTask(CLICKUP_LISTS.OPERATIONS, {
      name: taskData.customerName
        ? `${taskData.customerName}: ${taskData.title}`
        : taskData.title,
      markdown_description: taskData.description,
      tags,
      priority: taskData.priority || CLICKUP_PRIORITY.NORMAL,
      due_date: dueDate,
      due_date_time: false,
    });
  }

  /**
   * Create a recurring task (monthly maintenance, invoicing, etc.)
   */
  async createRecurringTask(taskData: {
    title: string;
    description: string;
    frequency: "daily" | "weekly" | "monthly";
  }): Promise<ClickUpResponse<ClickUpTask>> {
    return this.createTask(CLICKUP_LISTS.RECURRING, {
      name: `[${taskData.frequency.toUpperCase()}] ${taskData.title}`,
      markdown_description: taskData.description,
      tags: [taskData.frequency, "recurring"],
      priority: CLICKUP_PRIORITY.NORMAL,
    });
  }

  /**
   * Log a contact form submission as a task
   */
  async createContactFormTask(formData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message: string;
  }): Promise<ClickUpResponse<ClickUpTask>> {
    return this.createTask(CLICKUP_LISTS.OPERATIONS, {
      name: `Contactformulier: ${formData.name}`,
      markdown_description: `## Nieuw Contactformulier

**Van:** ${formData.name}
**Email:** ${formData.email}
${formData.phone ? `**Telefoon:** ${formData.phone}` : ""}
${formData.company ? `**Bedrijf:** ${formData.company}` : ""}

### Bericht
${formData.message}

---
*Ontvangen op: ${new Date().toLocaleString("nl-BE")}*`,
      tags: ["contact", "lead"],
      priority: CLICKUP_PRIORITY.HIGH,
    });
  }

  /**
   * Verify API connection
   */
  async verifyConnection(): Promise<ClickUpResponse<{ user: any; teams: any[] }>> {
    if (!this.isConfigured()) {
      return { success: false, error: "ClickUp API token not configured" };
    }

    try {
      const response = await fetch(`${CLICKUP_API_BASE}/user`, {
        method: "GET",
        headers: this.headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `ClickUp API error: ${response.status} - ${errorText}`,
        };
      }

      const userData = await response.json();
      
      // Also get teams
      const teamsResponse = await fetch(`${CLICKUP_API_BASE}/team`, {
        method: "GET",
        headers: this.headers,
      });
      
      const teamsData = teamsResponse.ok ? await teamsResponse.json() : { teams: [] };

      return {
        success: true,
        data: {
          user: userData.user,
          teams: teamsData.teams || [],
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Request failed",
      };
    }
  }
}

// Export singleton instance
export const clickup = new ClickUpService();
